// src/services/profile.ts
import { db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export type UserProfile = {
  displayName: string;
  rol?: string;
  habilidades?: string;
  experiencia?: string;
  photoUrl?: string;
  email?: string;
};

export async function getUserProfile(uid: string): Promise<UserProfile> {
  const snap = await getDoc(doc(db, "users", uid));
  const data = snap.exists() ? (snap.data() as Partial<UserProfile>) : {};
  return {
    displayName: data.displayName ?? "",
    rol: data.rol ?? "Gestora de Proyectos",
    habilidades: data.habilidades ?? "-",
    experiencia: data.experiencia ?? "-",
    photoUrl: data.photoUrl,
    email: data.email,
  };
}

export async function updateUserProfile(uid: string, patch: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, "users", uid), patch, { merge: true });
}

export async function uploadProfilePhoto(uid: string, file: File): Promise<string> {
  const r = ref(storage, `profile_pics/${uid}.jpg`);
  await uploadBytes(r, file, { contentType: file.type });
  return await getDownloadURL(r);
}