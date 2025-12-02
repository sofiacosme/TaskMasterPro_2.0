import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact, IonLoading } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import React from "react";
import Menu from "./components/Menu";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Perfil from "./pages/Perfil";
import Capturas from "./pages/Capturas";
import NuevaTarea from "./pages/NuevaTarea";
import Recursos from "./pages/Recursos";
import Acciones from "./pages/Acciones";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Tutorial from "./pages/Tutorial";

setupIonicReact();

// Ruta privada: si no hay user, manda a /auth/login
const Private: React.FC<{ component: React.FC; path: string; exact?: boolean }> = ({ component: Comp, ...rest }) => {
  const { user, ready } = useAuth();
  if (!ready) return <IonLoading isOpen message="Cargando..." />;
  return <Route {...rest} render={() => (user ? <Comp /> : <Redirect to="/auth/login" />)} />;
};

// Shell con menú + contenido (solo con sesión)
const Shell: React.FC = () => {
  return (
    <IonSplitPane contentId="main">
      <Menu />
      <IonRouterOutlet id="main">
        <Private exact path="/perfil" component={Perfil} />
        <Private exact path="/capturas" component={Capturas} />
        <Private exact path="/nueva-tarea" component={NuevaTarea} />
        <Private exact path="/recursos" component={Recursos} />
        <Private exact path="/acciones" component={Acciones} />
        <Private exact path="/tutorial" component={Tutorial} />
        {/* Dentro del Shell, "/" redirige a /perfil */}
        <Route exact path="/" render={() => <Redirect to="/perfil" />} />
      </IonRouterOutlet>
    </IonSplitPane>
  );
};

// Gate: decide si renderiza Shell o redirige a /auth/login
const Gate: React.FC = () => {
  const { user, ready } = useAuth();
  if (!ready) return <IonLoading isOpen message="Cargando..." />;
  return user ? <Shell /> : <Redirect to="/auth/login" />;
};

export default function App() {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          {/* Rutas públicas */}
          <Route path="/auth/login" component={Login} exact />
          <Route path="/auth/register" component={Register} exact />
          {/* Todo lo demás pasa por el Gate */}
          <Route path="/" component={Gate} />
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
}