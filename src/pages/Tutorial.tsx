import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonMenuButton,
  IonSpinner,
  IonText,
} from '@ionic/react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const Tutorial: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <IonPage>

      {/* HEADER */}
      <IonHeader>
        <IonToolbar>
          <IonMenuButton slot="start" />
          <IonTitle>Tutorial</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* EL FULLSCREEN ES CRÍTICO PARA QUE NO SE VEA TODO BLANCO */}
      <IonContent fullscreen>

        {/* CONTENEDOR FIJO PARA EVITAR COLAPSO EN ANDROID */}
        <div style={{ height: "100%", width: "100%" }}>

          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            style={{ height: "100%" }}
          >

            <SwiperSlide>

              {/* DIV CON ALTURA FIJA PARA EL VIDEO */}
              <div
                style={{
                  width: "100%",
                  height: "350px",
                  backgroundColor: "#000",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* LOADING SPINNER */}
                {loading && (
                  <IonSpinner
                    name="crescent"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 10,
                    }}
                  />
                )}

                {/* ERROR AL CARGAR VIDEO */}
                {error ? (
                  <IonText color="danger">
                    <p style={{ textAlign: "center", padding: 16 }}>{error}</p>
                  </IonText>
                ) : (

                  /* IFRAMME ✔ CON tabIndex PARA EVITAR ERROR ARIA */
                  <iframe
                    tabIndex={-1}
                    src="https://www.youtube.com/embed/xdnQQPlrJh4"
                    title="Tutorial Nestlé"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setError("No se pudo cargar el video.");
                      setLoading(false);
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "0",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  ></iframe>

                )}
              </div>

            </SwiperSlide>

          </Swiper>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tutorial;
