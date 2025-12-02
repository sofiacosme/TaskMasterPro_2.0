// src/pages/Acciones.tsx
import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
} from "@ionic/react";
import { useHistory } from "react-router";
import { useAuth } from "../context/AuthContext";
import { exportTexto, limpiarTareas } from "../services/tasks";
import type { IonInputCustomEvent } from '@ionic/core';
import type { InputChangeEventDetail } from '@ionic/core/components';


/**
 * Equivalente a tu AccionesFragment (Android):
 * - 📝 Nueva Tarea  -> navega a /nueva-tarea
 * - 📤 Exportar     -> copia al portapapeles las tareas del usuario
 * - 🗑 Limpiar      -> elimina todas las tareas del usuario
 * - 🔄 Sincronizar  -> mensaje simulado
 */
const Acciones: React.FC = () => {
  const { user } = useAuth();
  const nav = useHistory();
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  function needAuth(): string | null {
    if (!user) {
      setToast("Usuario no autenticado");
      return null;
    }
    return user.uid;
  }

  async function onNuevaTarea() {
    nav.push("/nueva-tarea");
  }

  async function onExportar() {
    const uid = needAuth();
    if (!uid) return;
    try {
      setBusy(true);
      const texto = await exportTexto(uid);
      try {
        await navigator.clipboard.writeText(texto);
        setToast("Tareas copiadas al portapapeles");
      } catch {
        // Fallback si el navegador no permite Clipboard API
        window.prompt("Copia el texto de tus tareas:", texto);
        setToast("Texto listo para copiar");
      }
    } catch (e: any) {
      setToast(e?.message ?? "Error al exportar");
    } finally {
      setBusy(false);
    }
  }

  async function onLimpiar() {
    const uid = needAuth();
    if (!uid) return;
    try {
      setBusy(true);
      await limpiarTareas(uid);
      setToast("Tareas eliminadas");
    } catch (e: any) {
      setToast(e?.message ?? "No se pudo limpiar");
    } finally {
      setBusy(false);
    }
  }

  function onSincronizar() {
    // Simulación como en Android
    setToast("Tareas sincronizadas desde Firestore");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* Botón de menú para abrir el panel lateral en móviles */}
          <IonMenuButton slot="start" />
          <IonTitle>Acciones</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        {/* Botón Nueva Tarea */}
        <IonButton expand="block" onClick={onNuevaTarea} disabled={busy}>
          📝 Nueva Tarea
        </IonButton>

        {/* Botón Exportar */}
        <IonButton
          expand="block"
          color="success"
          className="ion-margin-top"
          onClick={onExportar}
          disabled={busy}
        >
          📤 Exportar
        </IonButton>

        {/* Botón Limpiar */}
        <IonButton
          expand="block"
          color="danger"
          className="ion-margin-top"
          onClick={onLimpiar}
          disabled={busy}
        >
          🗑 Limpiar Tareas
        </IonButton>

        {/* Botón Sincronizar */}
        <IonButton
          expand="block"
          color="tertiary"
          className="ion-margin-top"
          onClick={onSincronizar}
          disabled={busy}
        >
          🔄 Sincronizar
        </IonButton>

        <IonToast
          isOpen={!!toast}
          message={toast}
          duration={1500}
          position="bottom"
          onDidDismiss={() => setToast("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default Acciones;