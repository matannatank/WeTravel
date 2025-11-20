import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

const collectionName = "ratings";

export interface Rating {
  id: string;
  userId: string;
  itineraryId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

export const addRating = async (
  userId: string,
  itineraryId: string,
  rating: number,
  comment?: string,
): Promise<void> => {
  // Check if user already rated this itinerary
  const existing = await getUserRating(userId, itineraryId);
  
  if (existing) {
    // Update existing rating
    const docRef = doc(db, collectionName, existing.id);
    await updateDoc(docRef, {
      rating,
      comment: comment || null,
      updatedAt: new Date().toISOString(),
    });
  } else {
    // Create new rating
    const ref = collection(db, collectionName);
    await addDoc(ref, {
      userId,
      itineraryId,
      rating,
      comment: comment || null,
      createdAt: new Date().toISOString(),
    });
  }

  // Update itinerary rating statistics
  await updateItineraryRatings(itineraryId);
};

export const removeRating = async (
  userId: string,
  itineraryId: string,
): Promise<void> => {
  const rating = await getUserRating(userId, itineraryId);
  if (!rating) {
    return;
  }

  const docRef = doc(db, collectionName, rating.id);
  await deleteDoc(docRef);

  // Update itinerary rating statistics
  await updateItineraryRatings(itineraryId);
};

export const getUserRating = async (
  userId: string,
  itineraryId: string,
): Promise<Rating | null> => {
  const ref = collection(db, collectionName);
  const q = query(
    ref,
    where("userId", "==", userId),
    where("itineraryId", "==", itineraryId),
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }

  const docSnap = snapshot.docs[0];
  const data = docSnap.data();
  return {
    id: docSnap.id,
    userId: data.userId,
    itineraryId: data.itineraryId,
    rating: data.rating,
    comment: data.comment,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const subscribeToItineraryRatings = (
  itineraryId: string,
  callback: (ratings: Rating[]) => void,
): Unsubscribe => {
  const ref = collection(db, collectionName);
  const q = query(ref, where("itineraryId", "==", itineraryId));

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        itineraryId: data.itineraryId,
        rating: data.rating,
        comment: data.comment,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
    callback(items);
  });
};

// Helper function to update itinerary rating statistics
async function updateItineraryRatings(itineraryId: string): Promise<void> {
  const ref = collection(db, collectionName);
  const q = query(ref, where("itineraryId", "==", itineraryId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    // No ratings, set to 0
    const itineraryRef = doc(db, "itineraries", itineraryId);
    await updateDoc(itineraryRef, {
      ratingAverage: 0,
      ratingCount: 0,
    });
    return;
  }

  const ratings = snapshot.docs.map((doc) => doc.data().rating as number);
  const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  const count = ratings.length;

  const itineraryRef = doc(db, "itineraries", itineraryId);
  await updateDoc(itineraryRef, {
    ratingAverage: Math.round(average * 10) / 10, // Round to 1 decimal
    ratingCount: count,
  });
}

