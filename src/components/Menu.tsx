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
} from "@ionic/react";
import { useHistory } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Menu.css";

const Menu: React.FC = () => {
  const nav = useHistory();

  async function onLogout() {
    try {
      await signOut(auth);
      nav.replace("/auth/login");
    } catch {
      // opcional: toast de error
    }
  }

  return (
    <IonMenu contentId="main" side="start" type="overlay" className="left-menu">
      <IonHeader>
        {/* Control total del color por CSS, NO usamos color="dark" aquí */}
        <IonToolbar className="left-menu__toolbar">
          <IonTitle>TaskMaster Pro</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* NOTA: agregamos className en IonContent para aplicar nuestros estilos */}
      <IonContent className="left-menu__content" forceOverscroll={false}>
        <IonList lines="none" className="left-menu__list">
          <IonItem routerLink="/perfil" routerDirection="root" detail={false} className="left-menu__item">
            <IonLabel>Mi Perfil</IonLabel>
          </IonItem>
          <IonItem routerLink="/capturas" routerDirection="root" detail={false} className="left-menu__item">
            <IonLabel>Capturas</IonLabel>
          </IonItem>
          <IonItem routerLink="/recursos" routerDirection="root" detail={false} className="left-menu__item">
            <IonLabel>Recursos</IonLabel>
          </IonItem>
         <IonItem routerLink="/acciones" routerDirection="root" detail={false} className="left-menu__item">
            <IonLabel>Acciones</IonLabel>
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