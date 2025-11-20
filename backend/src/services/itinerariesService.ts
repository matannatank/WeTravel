import { db } from "../lib/firebaseAdmin.js";
import type { ItineraryRecord, CreateItineraryPayload } from "../types/itinerary.js";
import { FieldValue } from "firebase-admin/firestore";

const COLLECTION = "itineraries";

export const createItinerary = async (
  payload: CreateItineraryPayload,
): Promise<string> => {
  const now = FieldValue.serverTimestamp();
  const docRef = await db.collection(COLLECTION).add({
    ...payload,
    visibility: "public",
    status: "draft",
    days: [],
    createdAt: now,
    updatedAt: now,
    ratingAverage: 0,
    ratingCount: 0,
    favoritesCount: 0,
    shareCount: 0,
  });

  return docRef.id;
};

export const getItinerary = async (id: string): Promise<ItineraryRecord | null> => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() } as ItineraryRecord & { id: string };
};

export const updateItinerary = async (
  id: string,
  updates: Partial<ItineraryRecord>,
): Promise<void> => {
  await db.collection(COLLECTION).doc(id).update({
    ...updates,
    updatedAt: FieldValue.serverTimestamp(),
  });
};

export const deleteItinerary = async (id: string): Promise<void> => {
  await db.collection(COLLECTION).doc(id).delete();
};

export const getUserItineraries = async (
  ownerId: string,
): Promise<(ItineraryRecord & { id: string })[]> => {
  const snapshot = await db
    .collection(COLLECTION)
    .where("ownerId", "==", ownerId)
    .orderBy("updatedAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (ItineraryRecord & { id: string })[];
};

export const getPublicItineraries = async (
  limit = 50,
): Promise<(ItineraryRecord & { id: string })[]> => {
  const snapshot = await db
    .collection(COLLECTION)
    .where("status", "==", "published")
    .where("visibility", "==", "public")
    .orderBy("updatedAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (ItineraryRecord & { id: string })[];
};

