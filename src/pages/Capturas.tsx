// src/pages/Capturas.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  IonToast,
} from "@ionic/react";
import { addOutline, checkmarkCircle, closeCircle, searchOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import { useAuth } from "../context/AuthContext";
import { borrarTarea, listTareas, toggleCompletar } from "../services/tasks";
import { Tarea } from "../types";

const Capturas: React.FC = () => {
  const { user } = useAuth();
  const nav = useHistory();

  // Lista original y lista filtrada (como en Android)
  const [listaOriginal, setListaOriginal] = useState<Tarea[]>([]);
  const [lista, setLista] = useState<Tarea[]>([]);
  const [q, setQ] = useState(""); // texto de búsqueda
  const [toast, setToast] = useState("");

  async function cargarTareas() {
    try {
      if (!user) {
        setToast("Usuario no autenticado");
        return;
      }
      const arr = await listTareas(user.uid);
      setListaOriginal(arr);
      // Aplica el filtro actual (si había texto)
      filtrarLista(q, arr);
    } catch (e: any) {
      setToast(e?.message ?? "Error al cargar tareas");
    }
  }

  useEffect(() => {
    cargarTareas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Filtro en tiempo real (como TextWatcher.onTextChanged)
  useEffect(() => {
    filtrarLista(q, listaOriginal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function filtrarLista(query: string, base: Tarea[]) {
    if (!query.trim()) {
      setLista(base);
    } else {
      const t = query.toLowerCase();
      setLista(base.filter((x) => x.titulo?.toLowerCase().includes(t)));
    }
  }

  const progreso = useMemo(() => {
    if (!lista.length) return "Sin tareas";
    const done = lista.filter((x) => x.completada).length;
    const pct = Math.round((done * 100) / lista.length);
    return `Progreso: ${pct}% completado`;
  }, [lista]);

  async function onCompletar(t: Tarea) {
    await toggleCompletar(t);
    await cargarTareas();
  }

  async function onBorrar(t: Tarea) {
    await borrarTarea(t);
    await cargarTareas();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* Botón de menú para abrir el panel lateral en móviles */}
          <IonMenuButton slot="start" />
          <IonTitle>Capturas</IonTitle>

          {/* Botón Agregar (abre NuevaTarea) */}
          <IonButtons slot="end">
            <IonButton onClick={() => nav.push("/nueva-tarea")}>
              <IonIcon icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Campo de búsqueda arriba */}
        <IonItem>
          <IonLabel position="stacked">Buscar por título</IonLabel>
          <IonInput
            placeholder="Escribe y filtra..."
            value={q}
            onIonInput={(e) => setQ(e.detail.value || "")}
          />
        </IonItem>

        {/* Barra de botones abajo del input: Buscar y Agregar (como en el layout Android) */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, margin: "8px 0" }}>
          <IonButton onClick={() => filtrarLista(q, listaOriginal)}>
            <IonIcon slot="start" icon={searchOutline} /> Buscar
          </IonButton>
          <IonButton onClick={() => nav.push("/nueva-tarea")}>
            <IonIcon slot="start" icon={addOutline} /> Agregar
          </IonButton>
        </div>

        {/* Lista de tareas */}
        <IonList>
          {lista.map((t) => (
            <IonCard key={t.id}>
              <IonCardContent className="ion-text-wrap">
                <IonText>
                  <h2 style={{ marginBottom: 6 }}>{t.titulo}</h2>
                </IonText>

                {/* Indicador de prioridad por color (como tus colores Android) */}
                <IonText
                  color={
                    t.prioridad === "alta"
                      ? "danger"
                      : t.prioridad === "media"
                      ? "warning"
                      : "success"
                  }
                >
                  <p style={{ marginTop: 0, marginBottom: 10 }}>
                    Prioridad: {t.prioridad ?? "sin prioridad"}
                  </p>
                </IonText>

                <IonButtons>
                  <IonButton fill="clear" onClick={() => onCompletar(t)}>
                    <IonIcon slot="start" icon={checkmarkCircle} />
                    {t.completada ? "Marcar pendiente" : "Completar"}
                  </IonButton>

                  <IonButton color="danger" fill="clear" onClick={() => onBorrar(t)}>
                    <IonIcon slot="start" icon={closeCircle} />
                    Eliminar
                  </IonButton>
                </IonButtons>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {/* Métrica de progreso al final */}
        <IonText className="ion-text-center ion-margin-top">
          <h3>{progreso}</h3>
        </IonText>

        <IonToast
          isOpen={!!toast}
          message={toast}
          duration={1800}
          position="bottom"
          onDidDismiss={() => setToast("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default Capturas;