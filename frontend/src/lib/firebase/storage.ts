import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  type UploadResult,
} from "firebase/storage";
import { firebaseApp } from "./client";

export const storage = getStorage(firebaseApp);

export const uploadBlob = async (path: string, file: Blob) => {
  const storageRef = ref(storage, path);
  const result: UploadResult = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(result.ref);
  return { result, url };
};

