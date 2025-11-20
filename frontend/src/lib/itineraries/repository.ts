import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import type {
  Itinerary,
  TravelCategory,
  TravelCosts,
  DaySegment,
  PointOfInterest,
} from "@/types";
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

export const getItinerary = async (id: string): Promise<Itinerary | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }
  return mapItinerary(docSnap.id, docSnap.data());
};

export const updateItineraryDays = async (
  id: string,
  days: DaySegment[],
) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    days,
    updatedAt: timestamp(),
  });
};

export const addDayToItinerary = async (
  id: string,
  day: DaySegment,
) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("מסלול לא נמצא");
  }
  const currentDays = (docSnap.data().days ?? []) as DaySegment[];
  await updateDoc(docRef, {
    days: [...currentDays, day],
    updatedAt: timestamp(),
  });
};

export const updateDayInItinerary = async (
  id: string,
  dayIndex: number,
  day: DaySegment,
) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("מסלול לא נמצא");
  }
  const currentDays = (docSnap.data().days ?? []) as DaySegment[];
  const updatedDays = [...currentDays];
  updatedDays[dayIndex] = day;
  await updateDoc(docRef, {
    days: updatedDays,
    updatedAt: timestamp(),
  });
};

export const deleteDayFromItinerary = async (
  id: string,
  dayIndex: number,
) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("מסלול לא נמצא");
  }
  const currentDays = (docSnap.data().days ?? []) as DaySegment[];
  const updatedDays = currentDays.filter((_, index) => index !== dayIndex);
  await updateDoc(docRef, {
    days: updatedDays,
    updatedAt: timestamp(),
  });
};

export const addPointToDay = async (
  id: string,
  dayIndex: number,
  point: PointOfInterest,
) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("מסלול לא נמצא");
  }
  const currentDays = (docSnap.data().days ?? []) as DaySegment[];
  const updatedDays = [...currentDays];
  if (!updatedDays[dayIndex]) {
    throw new Error("יום לא נמצא");
  }
  updatedDays[dayIndex] = {
    ...updatedDays[dayIndex],
    points: [...(updatedDays[dayIndex].points ?? []), point],
  };
  await updateDoc(docRef, {
    days: updatedDays,
    updatedAt: timestamp(),
  });
};

export const updatePointInDay = async (
  id: string,
  dayIndex: number,
  pointIndex: number,
  point: PointOfInterest,
) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("מסלול לא נמצא");
  }
  const currentDays = (docSnap.data().days ?? []) as DaySegment[];
  const updatedDays = [...currentDays];
  if (!updatedDays[dayIndex]) {
    throw new Error("יום לא נמצא");
  }
  const updatedPoints = [...(updatedDays[dayIndex].points ?? [])];
  updatedPoints[pointIndex] = point;
  updatedDays[dayIndex] = {
    ...updatedDays[dayIndex],
    points: updatedPoints,
  };
  await updateDoc(docRef, {
    days: updatedDays,
    updatedAt: timestamp(),
  });
};

export const deletePointFromDay = async (
  id: string,
  dayIndex: number,
  pointIndex: number,
) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("מסלול לא נמצא");
  }
  const currentDays = (docSnap.data().days ?? []) as DaySegment[];
  const updatedDays = [...currentDays];
  if (!updatedDays[dayIndex]) {
    throw new Error("יום לא נמצא");
  }
  const updatedPoints = (updatedDays[dayIndex].points ?? []).filter(
    (_, index) => index !== pointIndex,
  );
  updatedDays[dayIndex] = {
    ...updatedDays[dayIndex],
    points: updatedPoints,
  };
  await updateDoc(docRef, {
    days: updatedDays,
    updatedAt: timestamp(),
  });
};

export const deleteItinerary = async (id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

export const duplicateItinerary = async (
  sourceId: string,
  newOwnerId: string,
): Promise<string> => {
  const sourceDoc = await getDoc(doc(db, collectionName, sourceId));
  if (!sourceDoc.exists()) {
    throw new Error("מסלול מקור לא נמצא");
  }

  const sourceData = sourceDoc.data();
  const now = timestamp();

  // Create a deep copy of the itinerary with new owner
  const newItinerary = {
    ownerId: newOwnerId,
    title: `${sourceData.title} (עותק)`,
    summary: sourceData.summary || "",
    primaryDestination: sourceData.primaryDestination,
    regions: sourceData.regions ?? [],
    categories: sourceData.categories ?? [],
    budget: sourceData.budget,
    days: sourceData.days ?? [],
    tags: sourceData.tags ?? [],
    visibility: "public" as const,
    status: "draft" as const,
    heroImage: sourceData.heroImage,
    createdAt: now,
    updatedAt: now,
    // Reset counters for the copy
    ratingAverage: 0,
    ratingCount: 0,
    favoritesCount: 0,
    shareCount: 0,
  };

  const ref = collection(db, collectionName);
  const docRef = await addDoc(ref, newItinerary);
  return docRef.id;
};

const mapItinerary = (id: string, data: DocumentData): Itinerary => {
  const createdAt = data.createdAt instanceof Timestamp
    ? data.createdAt.toDate().toISOString()
    : new Date().toISOString();
  const updatedAt = data.updatedAt instanceof Timestamp
    ? data.updatedAt.toDate().toISOString()
    : new Date().toISOString();

  // Map days and ensure points have IDs
  const days = (data.days ?? []).map((day: DaySegment) => ({
    ...day,
    points: (day.points ?? []).map((point: PointOfInterest, index: number) => ({
      ...point,
      id: point.id || `point-${index}-${Date.now()}`,
    })),
  }));

  return {
    id,
    ownerId: data.ownerId,
    ownerDisplayName: data.ownerDisplayName,
    title: data.title,
    summary: data.summary || "",
    primaryDestination: data.primaryDestination,
    regions: data.regions ?? [],
    categories: data.categories ?? [],
    createdAt,
    updatedAt,
    visibility: data.visibility ?? "public",
    status: data.status ?? "draft",
    heroImage: data.heroImage,
    budget: data.budget,
    days,
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

export const subscribeToPublicItineraries = (
  callback: (itineraries: Itinerary[]) => void,
): Unsubscribe => {
  const ref = collection(db, collectionName);
  const q = query(
    ref,
    where("status", "==", "published"),
    where("visibility", "==", "public"),
    orderBy("updatedAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) =>
      mapItinerary(docSnap.id, docSnap.data()),
    );
    callback(items);
  });
};

