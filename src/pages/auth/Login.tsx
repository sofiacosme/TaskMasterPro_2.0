// src/pages/auth/Login.tsx
import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonToast,
} from "@ionic/react";
import { useHistory } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const Login: React.FC = () => {
  const nav = useHistory();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  function isEmailValid(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  async function doLogin() {
    const e = email.trim();
    const p = pass;

    if (!isEmailValid(e)) {
      setToast("Correo inválido");
      return;
    }
    if (!p) {
      setToast("La contraseña es obligatoria");
      return;
    }

    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, e, p);
      // Éxito → navega al “Home” (nuestro Shell) en /perfil
      nav.replace("/perfil");
    } catch (err: any) {
      setToast(err?.message ?? "Error al iniciar sesión");
    } finally {
      setBusy(false);
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        {/* Cabecera con ícono (equivalente a imgLoginHeader) */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <img
            src="/assets/icon/icon.png"
            alt="user"
            width={72}
            height={72}
            style={{ borderRadius: 16, opacity: 0.9 }}
          />
        </div>

        {/* Campo Email */}
        <IonItem>
          <IonLabel position="stacked">Correo</IonLabel>
          <IonInput
            inputMode="email"
            placeholder="usuario@correo.com"
            value={email}
            onIonInput={(ev) => setEmail(ev.detail.value || "")}
          />
        </IonItem>

        {/* Campo Password (con toggle, lo podemos hacer luego con un pequeño componente) */}
        <IonItem className="ion-margin-top">
          <IonLabel position="stacked">Contraseña</IonLabel>
          <IonInput
            type="password"
            placeholder="********"
            value={pass}
            onIonInput={(ev) => setPass(ev.detail.value || "")}
          />
        </IonItem>

        {/* Botón Iniciar sesión */}
        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={doLogin}
          disabled={busy}
        >
          {busy ? "Entrando..." : "Iniciar sesión"}
        </IonButton>

        {/* Link a registro */}
        <IonButton
          expand="block"
          fill="clear"
          routerLink="/auth/register"
          className="ion-margin-top"
        >
          ¿No tienes cuenta? Regístrate
        </IonButton>

        <IonToast
          isOpen={!!toast}
          message={toast}
          duration={1800}
          onDidDismiss={() => setToast("")}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;