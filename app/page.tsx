
"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";

import { auth } from "../src/app/lib/firebase";
import Login from "../src/app/components/Login";
import "./page.css";

export default function Home() {
  const [mensaje, setMensaje] = useState("");
  const [seccion, setSeccion] = useState("Inicio");
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorSesion, setErrorSesion] = useState("");

  useEffect(() => {
    const cancelar = onAuthStateChanged(
      auth,
      (user) => {
        setUsuario(user);
        setCargando(false);
        setErrorSesion("");
      },
      (error) => {
        console.error("Error de Firebase Auth:", error);
        setErrorSesion("No se pudo verificar tu sesión.");
        setCargando(false);
      }
    );

    return () => cancelar();
  }, []);

  async function cerrarSesion() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setErrorSesion("No se pudo cerrar la sesión. Inténtalo de nuevo.");
    }
  }

  function enviarMensaje() {
    if (!mensaje.trim()) return;

    console.log("Mensaje enviado:", mensaje);
    setMensaje("");
  }

  if (cargando) {
    return (
      <main className="nova">
        <div className="center">
          <h1 className="novaTitle">NOVA</h1>
          <p className="description">Verificando sesión...</p>
        </div>
      </main>
    );
  }

  if (errorSesion && !usuario) {
    return (
      <main className="nova">
        <div className="center">
          <h1 className="novaTitle">NOVA</h1>
          <p className="description" role="alert">
            {errorSesion}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return <Login />;
  }

  const secciones = [
    "Inicio",
    "Tutor",
    "Conversaciones",
    "Mis proyectos",
    "Memoria",
    "Preferencias",
  ];

  return (
    <main className="nova">
      <aside className="sidebar">
        <div className="logo">
          <div className="logoIcon">N</div>
          <div>
            <h1>NOVA</h1>
            <span>VIRTUAL ASSISTANT</span>
          </div>
        </div>

        <nav>
          {secciones.map((nombre) => (
            <button
              key={nombre}
              type="button"
              className={`menu ${seccion === nombre ? "active" : ""}`}
              onClick={() => setSeccion(nombre)}
            >
              <span>{nombre}</span>
            </button>
          ))}
        </nav>

        <div className="status">
          <div className="online" />
          <div>
            <p>Sistema conectado</p>
            <small>NOVA está lista</small>
          </div>
        </div>

        <div style={{ padding: "16px" }}>
          <p
            style={{
              fontSize: "12px",
              overflowWrap: "anywhere",
              marginBottom: "10px",
              color: "#9ca3af",
            }}
          >
            {usuario.email || "Sesión iniciada con Google"}
          </p>

          <button
            type="button"
            onClick={cerrarSesion}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #444",
              backgroundColor: "#222",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>

          {errorSesion && (
            <p role="alert" style={{ color: "#ff8585" }}>
              {errorSesion}
            </p>
          )}
        </div>
      </aside>

      <section className="content">
        <header>
          <div>
            <h2>{seccion}</h2>
            <p>Neural Operations & Virtual Assistant</p>
          </div>
          <div className="onlineText">● ONLINE</div>
        </header>

        {seccion === "Inicio" && (
          <div className="center">
            <div className="core">
              <div className="coreOuter">
                <div className="coreMiddle">
                  <div className="coreInner">
                    <div className="corePoint" />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="novaTitle">NOVA</h1>
            <p className="description">
              Tu asistente virtual para aprender programación,
              desarrollar proyectos y resolver tus dudas.
            </p>
            <p className="question">¿En qué puedo ayudarte?</p>
          </div>
        )}

        {seccion === "Tutor" && (
          <div className="center">
            <h1 className="novaTitle">TUTOR</h1>
            <p className="description">
              Aprende programación paso a paso con ayuda de NOVA.
            </p>
          </div>
        )}

        {seccion === "Conversaciones" && (
          <div className="center">
            <h1 className="novaTitle">CONVERSACIONES</h1>
            <p className="description">
              Aquí aparecerán tus conversaciones con NOVA.
            </p>
          </div>
        )}

        {seccion === "Mis proyectos" && (
          <div className="center">
            <h1 className="novaTitle">MIS PROYECTOS</h1>
            <p className="description">
              Aquí podrás consultar y trabajar en tus proyectos.
            </p>
          </div>
        )}

        {seccion === "Memoria" && (
          <div className="center">
            <h1 className="novaTitle">MEMORIA</h1>
            <p className="description">
              Aquí podrás consultar la información que NOVA recuerde.
            </p>
          </div>
        )}

        {seccion === "Preferencias" && (
          <div className="center">
            <h1 className="novaTitle">PREFERENCIAS</h1>
            <p className="description">
              Aquí podrás personalizar el comportamiento y la apariencia de NOVA.
            </p>
          </div>
        )}

        <div className="chat">
          <div className="inputBox">
            <input
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") enviarMensaje();
              }}
              placeholder="Escribe tu pregunta para NOVA..."
            />

            <button type="button" className="voice" aria-label="Activar voz">
              🎙️
            </button>

            <button
              type="button"
              className="send"
              onClick={enviarMensaje}
              aria-label="Enviar mensaje"
            >
              ➤
            </button>
          </div>

          <p>
            NOVA puede ayudarte a comprender conceptos,
            programar y desarrollar proyectos.
          </p>
        </div>
      </section>
    </main>
  );
}
