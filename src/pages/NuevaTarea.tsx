// src/pages/NuevaTarea.tsx
import React, { useMemo, useState } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  IonToast,
  useIonAlert,
  IonMenuButton,
} from "@ionic/react";
import { useHistory } from "react-router";
import { useAuth } from "../context/AuthContext";
import { addTarea } from "../services/tasks";

export default function NuevaTarea() {
  const { user } = useAuth();
  const nav = useHistory();
  const [presentAlert] = useIonAlert();

  const [titulo, setTitulo] = useState("");
  const [prioridad, setPrioridad] = useState<"baja" | "media" | "alta">("baja");
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  // Para saber si hay cambios no guardados
  const dirty = useMemo(() => !!titulo || prioridad !== "baja", [titulo, prioridad]);

  function goCapturas() {
    // Si hay historial, vuelve; si no, vete directo a /capturas
    if (nav.length > 1) nav.goBack();
    else nav.replace("/capturas");
  }

  async function onSave() {
    if (!user) { setToast("Usuario no autenticado"); return; }
    if (!titulo.trim()) { setToast("Ingrese título"); return; }

    setSaving(true);
    try {
      await addTarea(user.uid, {
        titulo: titulo.trim(),
        prioridad,
        completada: false,
      });
      setToast("Tarea guardada");
      // Redirige a la lista
      nav.replace("/capturas");
    } catch (e: any) {
      setToast(e?.message ?? "Error guardando");
    } finally {
      setSaving(false);
    }
  }

  async function onCancel() {
    // Si no hay cambios, salimos de una
    if (!dirty) { goCapturas(); return; }

    // Confirmación (opcional)
    presentAlert({
      header: "Descartar cambios",
      message: "Tienes cambios sin guardar. ¿Deseas descartarlos?",
      buttons: [
        { text: "Seguir editando", role: "cancel" },
        { text: "Descartar", role: "destructive", handler: goCapturas },
      ],
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* Botón menú por consistencia con el resto del Shell; 
             si prefieres sólo atrás, puedes quitar IonMenuButton */}
          <IonMenuButton slot="start" />
          {/* Botón atrás nativo (fallback a /capturas si no hay history) */}
          <IonButtons slot="start">
            /capturas
          </IonButtons>
          <IonTitle>Nueva Tarea</IonTitle>

          {/* Acciones derecha: Cancelar y Guardar */}
          <IonButtons slot="end">
            <IonButton onClick={onCancel} disabled={saving} color="medium">
              Cancelar
            </IonButton>
            <IonButton onClick={onSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Título</IonLabel>
          <IonInput
            value={titulo}
            onIonInput={(e) => setTitulo(e.detail.value || "")}
            placeholder="Ej: Reunión con cliente"
          />
        </IonItem>

        <IonItem className="ion-margin-top">
          <IonLabel>Prioridad</IonLabel>
          <IonSelect value={prioridad} onIonChange={(e) => setPrioridad(e.detail.value)}>
            <IonSelectOption value="baja">baja</IonSelectOption>
            <IonSelectOption value="media">media</IonSelectOption>
            <IonSelectOption value="alta">alta</IonSelectOption>
          </IonSelect>
        </IonItem>

        {/* También puedes poner los botones abajo si quieres duplicarlos estilo Android */}
        {/* <IonButton expand="block" className="ion-margin-top" onClick={onSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </IonButton>
        <IonButton expand="block" fill="outline" color="medium" onClick={onCancel} className="ion-margin-top">
          Cancelar
        </IonButton> */}

        <IonToast
          isOpen={!!toast}
          message={toast}
          duration={1500}
          onDidDismiss={() => setToast("")}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
}