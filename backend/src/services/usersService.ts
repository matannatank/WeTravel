import { db } from "../lib/firebaseAdmin.js";
import { FieldValue, type Timestamp } from "firebase-admin/firestore";

const COLLECTION = "users";

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  role?: "user" | "admin";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const createUserProfile = async (
  userId: string,
  email: string,
  displayName?: string,
  photoURL?: string,
): Promise<void> => {
  const now = FieldValue.serverTimestamp();
  await db.collection(COLLECTION).doc(userId).set({
    email,
    displayName,
    photoURL,
    role: "user",
    createdAt: now,
    updatedAt: now,
  });
};

export const getUserProfile = async (
  userId: string,
): Promise<UserProfile | null> => {
  const doc = await db.collection(COLLECTION).doc(userId).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() } as UserProfile;
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>,
): Promise<void> => {
  await db.collection(COLLECTION).doc(userId).update({
    ...updates,
    updatedAt: FieldValue.serverTimestamp(),
  });
};

export const isAdmin = async (userId: string): Promise<boolean> => {
  const profile = await getUserProfile(userId);
  return profile?.role === "admin" || false;
};

