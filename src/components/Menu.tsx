// src/components/Menu.tsx
import React from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
} from "@ionic/react";

import { useHistory } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import "./Menu.css";

// Íconos
import {
  personCircleOutline,
  cameraOutline,
  folderOpenOutline,
  flashOutline,
  bookOutline,
} from "ionicons/icons";

const Menu: React.FC = () => {
  const nav = useHistory();

  async function onLogout() {
    try {
      await signOut(auth);
      nav.replace("/auth/login");
    } catch (e) {
      console.error("Error cerrando sesión:", e);
    }
  }


  return (
    <IonMenu contentId="main" side="start" type="overlay" className="left-menu">
      <IonHeader>
        <IonToolbar className="left-menu__toolbar">
          <IonTitle>TaskMaster Pro</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="left-menu__content" forceOverscroll={false}>
        <IonList lines="none" className="left-menu__list">

          <IonItem routerLink="/perfil" routerDirection="root" detail={false} className="left-menu__item">
            <IonIcon icon={personCircleOutline} slot="start" />
            <IonLabel>Mi Perfil</IonLabel>
          </IonItem>

          <IonItem routerLink="/capturas" routerDirection="root" detail={false} className="left-menu__item">
            <IonIcon icon={cameraOutline} slot="start" />
            <IonLabel>Capturas</IonLabel>
          </IonItem>

          <IonItem routerLink="/recursos" routerDirection="root" detail={false} className="left-menu__item">
            <IonIcon icon={folderOpenOutline} slot="start" />
            <IonLabel>Recursos</IonLabel>
          </IonItem>

          <IonItem routerLink="/acciones" routerDirection="root" detail={false} className="left-menu__item">
            <IonIcon icon={flashOutline} slot="start" />
            <IonLabel>Acciones</IonLabel>
          </IonItem>

          <IonItem routerLink="/tutorial" routerDirection="root" detail={false} className="left-menu__item">
            <IonIcon icon={bookOutline} slot="start" />
            <IonLabel>Tutorial</IonLabel>
          </IonItem>

        </IonList>

        <div className="left-menu__footer">
          <IonButton expand="block" color="light" fill="outline" onClick={onLogout}>
            Salir
          </IonButton>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
