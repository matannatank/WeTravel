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

const collectionName = "favorites";

export interface Favorite {
  id: string;
  userId: string;
  itineraryId: string;
  createdAt: string;
}

export const addFavorite = async (
  userId: string,
  itineraryId: string,
): Promise<void> => {
  // Check if already favorited
  const existing = await getFavorite(userId, itineraryId);
  if (existing) {
    return; // Already favorited
  }

  const ref = collection(db, collectionName);
  await addDoc(ref, {
    userId,
    itineraryId,
    createdAt: new Date().toISOString(),
  });

  // Update itinerary favorites count
  await updateItineraryFavoritesCount(itineraryId, 1);
};

export const removeFavorite = async (
  userId: string,
  itineraryId: string,
): Promise<void> => {
  const favorite = await getFavorite(userId, itineraryId);
  if (!favorite) {
    return; // Not favorited
  }

  const docRef = doc(db, collectionName, favorite.id);
  await deleteDoc(docRef);

  // Update itinerary favorites count
  await updateItineraryFavoritesCount(itineraryId, -1);
};

export const getFavorite = async (
  userId: string,
  itineraryId: string,
): Promise<Favorite | null> => {
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
    createdAt: data.createdAt,
  };
};

export const subscribeToUserFavorites = (
  userId: string,
  callback: (favorites: Favorite[]) => void,
): Unsubscribe => {
  const ref = collection(db, collectionName);
  const q = query(ref, where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      userId: docSnap.data().userId,
      itineraryId: docSnap.data().itineraryId,
      createdAt: docSnap.data().createdAt,
    }));
    callback(items);
  });
};

export const isFavorite = async (
  userId: string,
  itineraryId: string,
): Promise<boolean> => {
  const favorite = await getFavorite(userId, itineraryId);
  return favorite !== null;
};

// Helper function to update itinerary favorites count
async function updateItineraryFavoritesCount(
  itineraryId: string,
  delta: number,
): Promise<void> {
  const itineraryRef = doc(db, "itineraries", itineraryId);
  const itinerarySnap = await getDoc(itineraryRef);

  if (itinerarySnap.exists()) {
    const currentCount = itinerarySnap.data().favoritesCount || 0;
    await updateDoc(itineraryRef, {
      favoritesCount: Math.max(0, currentCount + delta),
    });
  }
}

