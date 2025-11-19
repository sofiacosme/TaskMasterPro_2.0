// src/types.ts
export type Tarea = {
  id: string;
  userId: string;
  titulo: string;
  descripcion?: string;
  prioridad: "baja" | "media" | "alta";
  completada: boolean;
  createdAt: number; // epoch ms
};