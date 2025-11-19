// src/services/resources.ts
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

/**
 * Guarda un recurso visitado por el usuario en:
 * users/{uid}/recursos
 */
export async function saveRecurso(uid: string, url: string) {
  await addDoc(collection(db, "users", uid, "recursos"), {
    url,
    createdAt: Date.now(),
  });
}