import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  type CollectionReference,
  type DocumentReference,
} from "firebase/firestore";
import { firebaseApp } from "./client";

export const db = getFirestore(firebaseApp);

export const timestamp = () => serverTimestamp();

export const collectionRef = <T = unknown>(path: string) =>
  collection(db, path) as CollectionReference<T>;

export const docRef = <T = unknown>(path: string) =>
  doc(db, path) as DocumentReference<T>;

