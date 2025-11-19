// src/pages/auth/Register.tsx
import React, { useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonToast,
  IonText,
} from "@ionic/react";
import { useHistory } from "react-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./Register.css";

const Register: React.FC = () => {
  const nav = useHistory();

  // Estado de formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");

  // Imagen de perfil (opcional)
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // UI
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  function onPickFile() {
    fileRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
    // Limpia el value para permitir reseleccionar la misma imagen luego
    e.target.value = "";
  }

  function isEmailValid(v: string) {
    // Validación básica (similar a Patterns.EMAIL_ADDRESS)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  async function onSignup() {
    try {
      // Validaciones equivalentes a tu fragmento Java
      if (!name.trim()) throw new Error("Ingrese su nombre");
      if (!isEmailValid(email)) throw new Error("Correo inválido");
      if (!pass) throw new Error("Ingrese contraseña");
      if (pass !== conf) throw new Error("Contraseñas no coinciden");

      setBusy(true);

      // 1) Crear cuenta en Auth
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const uid = cred.user.uid;

      // 2) Subir foto si hay (igual que en Android: users/{uid}/profile.jpg)
      let photoUrl: string | undefined;
      if (file) {
        try {
          const r = ref(storage, `users/${uid}/profile.jpg`);
          await uploadBytes(r, file, { contentType: file.type });
          photoUrl = await getDownloadURL(r);
        } catch (e) {
          // Si falla la foto, continuamos guardando el perfil sin photoUrl (como en tu Java)
          console.warn("No se pudo subir/obtener URL de la foto.", e);
        }
      }

      // 3) Guardar perfil en Firestore
      await setDoc(
        doc(db, "users", uid),
        {
          displayName: name.trim(),
          email: email.trim(),
          ...(photoUrl ? { photoUrl } : {}),
          createdAt: Date.now(),
        },
        { merge: true }
      );

      // 4) Navegar al área privada (equivalente a HomeActivity en Android)
      nav.replace("/perfil");
    } catch (e: any) {
      setToast(e?.message ?? "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        {/* Imagen de perfil con círculo (equivale al ImageView con circle_background) */}
        <div className="reg__avatar">
          <img
            src={previewUrl || "/assets/icon/icon.png"}
            alt="avatar"
            className="reg__avatar-img"
          />
        </div>

        <IonButton fill="outline" onClick={onPickFile} className="ion-margin-top">
          Seleccionar foto
        </IonButton>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onFileChange}
        />

        {/* Campos: Nombre, Email, Pass, Confirm (como en tu XML) */}
        <IonItem className="ion-margin-top">
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput
            value={name}
            onIonInput={(e) => setName(e.detail.value || "")}
            placeholder="Tu nombre"
          />
        </IonItem>

        <IonItem className="ion-margin-top">
          <IonLabel position="stacked">Correo</IonLabel>
          <IonInput
            value={email}
            inputMode="email"
            onIonInput={(e) => setEmail(e.detail.value || "")}
            placeholder="usuario@correo.com"
          />
        </IonItem>

        <IonItem className="ion-margin-top">
          <IonLabel position="stacked">Contraseña</IonLabel>
          <IonInput
            type="password"
            value={pass}
            onIonInput={(e) => setPass(e.detail.value || "")}
            placeholder="********"
          />
        </IonItem>

        <IonItem className="ion-margin-top">
          <IonLabel position="stacked">Confirmar contraseña</IonLabel>
          <IonInput
            type="password"
            value={conf}
            onIonInput={(e) => setConf(e.detail.value || "")}
            placeholder="********"
          />
        </IonItem>

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={onSignup}
          disabled={busy}
        >
          {busy ? "Creando cuenta..." : "Crear cuenta"}
        </IonButton>

        <IonButton
          expand="block"
          fill="clear"
          routerLink="/auth/login"
          className="ion-margin-top"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </IonButton>

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

export default Register;