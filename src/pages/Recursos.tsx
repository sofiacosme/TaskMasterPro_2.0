// src/pages/Recursos.tsx
import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
  IonMenuButton,
} from "@ionic/react";
import { useAuth } from "../context/AuthContext";
import { saveRecurso } from "../services/resources";
import { Browser } from "@capacitor/browser";

const DENY_IFRAME = [
  "google.com",
  "mail.google.com",
  "accounts.google.com",
  "console.firebase.google.com",
  "drive.google.com",
  "docs.google.com",
  "youtube.com",
  "linkedin.com",
  "x.com",
];

function normalizeUrl(input: string): string | null {
  const u = (input || "").trim();
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

function bloqueaIframe(u: string): boolean {
  try {
    const { hostname } = new URL(u);
    return DENY_IFRAME.some((d) => hostname === d || hostname.endsWith(`.${d}`));
  } catch {
    return true;
  }
}

async function abrirEnNavegador(u: string) {
  try {
    await Browser.open({ url: u }); // en móvil abre navegador in-app
  } catch {
    window.open(u, "_blank", "noopener,noreferrer"); // fallback web
  }
}

const Recursos: React.FC = () => {
  const { user } = useAuth();

  const [raw, setRaw] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const [toast, setToast] = useState("");

  async function onGo() {
    const n = normalizeUrl(raw);
    if (!n) {
      setToast("Ingresa una URL válida");
      return;
    }

    setUrl(n);
    setIframeBlocked(bloqueaIframe(n));

    if (!user) {
      setToast("Debes iniciar sesión para guardar el recurso");
      return;
    }
    try {
      await saveRecurso(user.uid, n);
    } catch {
      setToast("No se pudo guardar el recurso");
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonMenuButton slot="start" />
          <IonTitle>Recursos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Campo para escribir la URL */}
        <IonItem>
          <IonLabel position="stacked">Ingresa la URL</IonLabel>
          <IonInput
            placeholder="https://ejemplo.com"
            value={raw}
            onIonInput={(e) => setRaw(e.detail.value || "")}
            inputMode="url"
          />
        </IonItem>

        {/* Aviso si no es HTTPS */}
        {!/^https:\/\//i.test(raw.trim() || "") && !!raw && (
          <IonText color="warning">
            <p style={{ marginTop: 8 }}>Sugerencia: usa HTTPS para mayor seguridad.</p>
          </IonText>
        )}

        {/* Botón Ir */}
        <IonButton className="ion-margin-top" onClick={onGo}>
          Ir
        </IonButton>

        {/* Vista: iframe o botón Abrir (si el sitio bloquea iframe) */}
        {url && iframeBlocked ? (
          <div style={{ marginTop: 12 }}>
            <IonText>
              <p>Este sitio no permite mostrarse dentro de la app.</p>
            </IonText>
            <IonButton onClick={() => abrirEnNavegador(url)}>Abrir en navegador</IonButton>
          </div>
        ) : url ? (
          <div style={{ marginTop: 12, height: "60vh", border: "1px solid #e0e0e0" }}>
            <iframe
              title="web"
              src={url}
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          </div>
        ) : (
          <div
            style={{
              marginTop: 12,
              height: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#777",
              border: "1px solid #e0e0e0",
            }}
          >
            Ingresa una URL y pulsa <strong>&nbsp;Ir&nbsp;</strong> para cargarla aquí.
          </div>
        )}

        <IonToast
          isOpen={!!toast}
          message={toast}
          duration={1600}
          onDidDismiss={() => setToast("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default Recursos;