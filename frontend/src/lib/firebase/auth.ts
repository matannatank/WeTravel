import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseApp } from "./client";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth(firebaseApp);

export const initAuthPersistence = () =>
  setPersistence(auth, browserLocalPersistence);

export const signInWithGoogle = async () => {
  await initAuthPersistence();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logOut = () => signOut(auth);

export type AuthUser = User;

