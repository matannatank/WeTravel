import { db } from "../lib/firebaseAdmin.js";
import { FieldValue, type Timestamp } from "firebase-admin/firestore";

const COLLECTION = "reports";

export interface Report {
  id: string;
  itineraryId: string;
  reporterId: string;
  reason: "offensive" | "spam" | "copyright" | "other";
  notes?: string;
  status: "open" | "reviewing" | "closed";
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
  resolvedBy?: string;
}

export interface CreateReportPayload {
  itineraryId: string;
  reporterId: string;
  reason: "offensive" | "spam" | "copyright" | "other";
  notes?: string;
}

export const createReport = async (
  payload: CreateReportPayload,
): Promise<string> => {
  const now = FieldValue.serverTimestamp();
  const docRef = await db.collection(COLLECTION).add({
    ...payload,
    status: "open",
    createdAt: now,
  });

  return docRef.id;
};

export const getReport = async (id: string): Promise<Report | null> => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() } as Report;
};

export const getReports = async (
  status?: "open" | "reviewing" | "closed",
): Promise<Report[]> => {
  let query = db.collection(COLLECTION).orderBy("createdAt", "desc");

  if (status) {
    query = query.where("status", "==", status) as any;
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Report[];
};

export const updateReportStatus = async (
  id: string,
  status: "open" | "reviewing" | "closed",
  resolvedBy: string,
): Promise<void> => {
  const updates: any = {
    status,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (status === "closed") {
    updates.resolvedAt = FieldValue.serverTimestamp();
    updates.resolvedBy = resolvedBy;
  }

  await db.collection(COLLECTION).doc(id).update(updates);
};

export const deleteReport = async (id: string): Promise<void> => {
  await db.collection(COLLECTION).doc(id).delete();
};

