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
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

const collectionName = "reports";

export type ReportReason = "offensive" | "spam" | "copyright" | "other";
export type ReportStatus = "open" | "reviewing" | "closed";

export interface Report {
  id: string;
  itineraryId: string;
  reporterId: string;
  reason: ReportReason;
  notes?: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export const createReport = async (
  itineraryId: string,
  reporterId: string,
  reason: ReportReason,
  notes?: string,
): Promise<string> => {
  // Check if user already reported this itinerary
  const existing = await getUserReport(reporterId, itineraryId);
  if (existing) {
    throw new Error("כבר דיווחת על מסלול זה");
  }

  const ref = collection(db, collectionName);
  const docRef = await addDoc(ref, {
    itineraryId,
    reporterId,
    reason,
    notes: notes || null,
    status: "open" as ReportStatus,
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
};

export const getUserReport = async (
  reporterId: string,
  itineraryId: string,
): Promise<Report | null> => {
  const ref = collection(db, collectionName);
  const q = query(
    ref,
    where("reporterId", "==", reporterId),
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
    itineraryId: data.itineraryId,
    reporterId: data.reporterId,
    reason: data.reason,
    notes: data.notes,
    status: data.status,
    createdAt: data.createdAt,
    resolvedAt: data.resolvedAt,
    resolvedBy: data.resolvedBy,
  };
};

export const updateReportStatus = async (
  reportId: string,
  status: ReportStatus,
  resolvedBy: string,
): Promise<void> => {
  const docRef = doc(db, collectionName, reportId);
  const updates: any = {
    status,
    resolvedBy,
  };

  if (status === "closed") {
    updates.resolvedAt = new Date().toISOString();
  }

  await updateDoc(docRef, updates);
};

export const deleteReport = async (reportId: string): Promise<void> => {
  const docRef = doc(db, collectionName, reportId);
  await deleteDoc(docRef);
};

export const subscribeToReports = (
  callback: (reports: Report[]) => void,
  status?: ReportStatus,
): Unsubscribe => {
  const ref = collection(db, collectionName);
  let q = query(ref, orderBy("createdAt", "desc"));

  if (status) {
    q = query(ref, where("status", "==", status), orderBy("createdAt", "desc"));
  }

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        itineraryId: data.itineraryId,
        reporterId: data.reporterId,
        reason: data.reason,
        notes: data.notes,
        status: data.status,
        createdAt: data.createdAt,
        resolvedAt: data.resolvedAt,
        resolvedBy: data.resolvedBy,
      };
    });
    callback(items);
  });
};

export const subscribeToItineraryReports = (
  itineraryId: string,
  callback: (reports: Report[]) => void,
): Unsubscribe => {
  const ref = collection(db, collectionName);
  const q = query(
    ref,
    where("itineraryId", "==", itineraryId),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        itineraryId: data.itineraryId,
        reporterId: data.reporterId,
        reason: data.reason,
        notes: data.notes,
        status: data.status,
        createdAt: data.createdAt,
        resolvedAt: data.resolvedAt,
        resolvedBy: data.resolvedBy,
      };
    });
    callback(items);
  });
};

