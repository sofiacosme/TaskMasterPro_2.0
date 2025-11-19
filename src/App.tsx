import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab1">
            <Tab1 />
          </Route>
          <Route exact path="/tab2">
            <Tab2 />
          </Route>
          <Route path="/tab3">
            <Tab3 />
          </Route>
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>Tab 1</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Tab 2</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Tab 3</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;

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