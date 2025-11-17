import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import type { Itinerary, TravelCategory, TravelCosts } from "@/types";
import { db } from "@/lib/firebase/firestore";
import { timestamp } from "@/lib/firebase/firestore";

export interface ItineraryInput {
  title: string;
  summary: string;
  primaryDestination: string;
  regions?: string[];
  categories: TravelCategory[];
  budget?: TravelCosts;
}

const collectionName = "itineraries";

export const createItinerary = async (
  ownerId: string,
  payload: ItineraryInput,
) => {
  const ref = collection(db, collectionName);
  const now = timestamp();

  const docRef = await addDoc(ref, {
    ...payload,
    ownerId,
    visibility: "public",
    status: "draft",
    days: [],
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
};

export const updateItinerary = async (
  id: string,
  payload: Partial<ItineraryInput>,
) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...payload,
    updatedAt: timestamp(),
  });
};

export const deleteItinerary = async (id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

const mapItinerary = (id: string, data: DocumentData): Itinerary => {
  const createdAt = data.createdAt instanceof Timestamp
    ? data.createdAt.toDate().toISOString()
    : new Date().toISOString();
  const updatedAt = data.updatedAt instanceof Timestamp
    ? data.updatedAt.toDate().toISOString()
    : new Date().toISOString();

  return {
    id,
    ownerId: data.ownerId,
    ownerDisplayName: data.ownerDisplayName,
    title: data.title,
    summary: data.summary,
    primaryDestination: data.primaryDestination,
    regions: data.regions ?? [],
    categories: data.categories ?? [],
    createdAt,
    updatedAt,
    visibility: data.visibility ?? "public",
    status: data.status ?? "draft",
    heroImage: data.heroImage,
    budget: data.budget,
    days: data.days ?? [],
    tags: data.tags ?? [],
    ratingAverage: data.ratingAverage ?? 0,
    ratingCount: data.ratingCount ?? 0,
    favoritesCount: data.favoritesCount ?? 0,
    shareCount: data.shareCount ?? 0,
  };
};

export const subscribeToOwnerItineraries = (
  ownerId: string,
  callback: (itineraries: Itinerary[]) => void,
): Unsubscribe => {
  const ref = collection(db, collectionName);
  const q = query(
    ref,
    where("ownerId", "==", ownerId),
    orderBy("updatedAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) =>
      mapItinerary(docSnap.id, docSnap.data()),
    );
    callback(items);
  });
};

