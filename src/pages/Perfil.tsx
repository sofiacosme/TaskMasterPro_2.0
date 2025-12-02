// src/pages/Perfil.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
  IonText,
} from "@ionic/react";
import { pencilOutline, saveOutline } from "ionicons/icons";
import "./Perfil.css";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile, uploadProfilePhoto, type UserProfile } from "../services/profile";
import { IonMenuButton } from "@ionic/react";




const DEFAULT_AVATAR = "https://ionicframework.com/docs/img/demos/avatar.svg";

const Perfil: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado de UI / datos
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [changed, setChanged] = useState(false);     // Equivale a visibilidad del btnGuardar
  const [canEdit, setCanEdit] = useState(false);     // Equivale a edtNombre.setEnabled(false)

  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    rol: "Gestora de Proyectos",
    habilidades: "-",
    experiencia: "-",
    photoUrl: undefined,
  });

  // Carga inicial del perfil
  useEffect(() => {
    (async () => {
      try {
        if (!user) {
          setToast("Debes iniciar sesión");
          setLoading(false);
          return;
        }
        const p = await getUserProfile(user.uid);
        setProfile(p);
      } catch (e: any) {
        setToast(e?.message ?? "Error cargando perfil");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  // Selección de imagen (equivalente a imagePickerLauncher.launch("image/*"))
  function onPickFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0];
    if (!f) return;
    setSelectedFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setChanged(true);       // btnGuardar visible
    setCanEdit(true);       // Nombre editable
    // Limpia el input para permitir volver a seleccionar la misma imagen
    ev.target.value = "";
  }

  // Cambio de nombre (equivalente al TextWatcher para mostrar boton Guardar)
  function onNameInput(e: CustomEvent) {
    const value = (e.detail as any).value as string;
    setProfile((prev) => ({ ...prev, displayName: value }));
    setChanged(true);
  }

  async function onSave() {
    if (!user) { setToast("Debes iniciar sesión"); return; }
    const nombre = profile.displayName?.trim() ?? "";
    if (!nombre) { setToast("Nombre no puede estar vacío"); return; }

    setSaving(true);
    try {
      const uid = user.uid;
      const patch: Partial<UserProfile> = { displayName: nombre };

      // Si hay foto seleccionada, primero subimos a Storage y guardamos URL
      if (selectedFile) {
        const url = await uploadProfilePhoto(uid, selectedFile);
        patch.photoUrl = url;
      }
      await updateUserProfile(uid, patch);

      // Post-guardado: UI igual que en Android
      setToast("Perfil actualizado");
      setSelectedFile(null);
      setPreviewUrl(undefined);
      setCanEdit(false);
      setChanged(false);
      setProfile((prev) => ({ ...prev, ...patch }));
    } catch (e: any) {
      setToast(e?.message ?? "Error actualizando perfil");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar><IonTitle>Perfil</IonTitle></IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
  
          <IonHeader>
            <IonToolbar>
              <IonMenuButton slot="start" />    {/* 👈 esto abre el menú */}
              <IonTitle>Perfil profesional</IonTitle>
                {changed && (
              <IonButton onClick={onSave} disabled={saving}>
                {saving ? <IonSpinner name="crescent" /> : <IonIcon icon={saveOutline} />}
              </IonButton>
                 )}
            </IonToolbar>
          </IonHeader>
       

      <IonContent fullscreen className="ion-padding">
        {/* Contenedor de foto con lápiz (equivalente al FrameLayout) */}
        <div className="avatar-wrapper">
          <IonAvatar className="avatar-120">
            <img
              src={previewUrl || profile.photoUrl || DEFAULT_AVATAR}
              alt="Foto de perfil"
            />
          </IonAvatar>
          <IonButton className="edit-fab" size="small" onClick={openFilePicker}>
            <IonIcon icon={pencilOutline} />
          </IonButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onPickFile}
          />
        </div>

        {/* Nombre editable (deshabilitado hasta que se elija imagen) */}
        <IonItem lines="none" className="ion-text-center name-item">
          <IonLabel position="stacked"><strong>Nombre del Usuario</strong></IonLabel>
          <IonInput
            placeholder="Nombre del Usuario"
            disabled={!canEdit}
            value={profile.displayName}
            onIonInput={onNameInput}
            className="name-input"
          />
        </IonItem>

        {/* Rol fijo (texto centrado) */}
        <IonText className="ion-text-center">
          <p style={{ fontSize: 16, marginTop: 8 }}>
            <strong>Rol:</strong> {profile.rol ?? "Gestora de Proyectos"}
          </p>
        </IonText>

        {/* Sección información fija (habilidades / experiencia) */}
        <IonList className="ion-margin-top non-edit-info" inset={false}>
          <IonItem lines="none">
            <IonLabel>
              <p style={{ marginBottom: 8 }}>
                <strong>Habilidades:</strong> {profile.habilidades ?? "-"}
              </p>
              <p>
                <strong>Experiencia:</strong> {profile.experiencia ?? "-"}
              </p>
            </IonLabel>
          </IonItem>
        </IonList>

        {/* Botón Guardar (estilo “abajo y ancho”), visible sólo si hay cambios */}
        {changed && (
          <IonButton expand="block" className="ion-margin-top" onClick={onSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </IonButton>
        )}

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

export default Perfil;