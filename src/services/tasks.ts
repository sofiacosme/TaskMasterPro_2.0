// src/services/tasks.ts
import { db } from "../firebase";
import { Tarea } from "../types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  // orderBy, // ← lo quitamos en la variante DEV para no depender de índice
  query,
  setDoc,
  where,
} from "firebase/firestore";

/**
 * Lista todas las tareas del usuario.
 * Variante DEV: SIN orderBy para evitar índice compuesto. Ordenamos en cliente.
 */
export async function listTareas(uid: string): Promise<Tarea[]> {
  const q = query(collection(db, "tareas"), where("userId", "==", uid));
  const s = await getDocs(q);
  return s.docs
    .map((d) => d.data() as Tarea)
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

/**
 * Crea una tarea y guarda id, userId y createdAt.
 */
export async function addTarea(
  uid: string,
  t: Omit<Tarea, "id" | "userId" | "createdAt">
) {
  const ref = await addDoc(collection(db, "tareas"), {
    ...t,
    userId: uid,
    createdAt: Date.now(),
  });
  await setDoc(ref, { id: ref.id }, { merge: true });
}

/**
 * Alterna el estado completada de una tarea.
 */
export async function toggleCompletar(t: Tarea) {
  await setDoc(doc(db, "tareas", t.id), { completada: !t.completada }, { merge: true });
}

/**
 * Borra una tarea por id.
 */
export async function borrarTarea(t: Tarea) {
  await deleteDoc(doc(db, "tareas", t.id));
}

/**
 * Borra todas las tareas del usuario.
 */
export async function limpiarTareas(uid: string) {
  const items = await listTareas(uid);
  await Promise.all(items.map((i) => deleteDoc(doc(db, "tareas", i.id))));
}

/**
 * Exporta las tareas como texto plano con formato.
 */
export async function exportTexto(uid: string): Promise<string> {
  const items = await listTareas(uid);
  if (!items.length) return "No hay tareas para exportar";
  const lines = ["📋 Mis Tareas:"];
  for (const t of items) {
    lines.push(`• ${t.titulo ?? "Sin título"} [${t.prioridad ?? "sin prioridad"}]`);
  }
  return lines.join("\n");
}