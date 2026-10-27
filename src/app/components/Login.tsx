
"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function Login() {
  const [registro, setRegistro] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async () => {
    setError("");
    setCargando(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("No se pudo iniciar sesión. Verifica tu correo y contraseña.");
    } finally {
      setCargando(false);
    }
  };

  const crearCuenta = async () => {
    setError("");
    setCargando(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch {
      setError("No se pudo crear la cuenta. Verifica tus datos y que la contraseña tenga al menos 6 caracteres.");
    } finally {
      setCargando(false);
    }
  };

  const iniciarConGoogle = async () => {
    setError("");
    setCargando(true);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setError("No se pudo iniciar sesión con Google. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  const enviarFormulario = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (registro) {
      void crearCuenta();
    } else {
      void iniciarSesion();
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0b1020",
      color: "#ffffff",
      padding: "24px"
    }}>
      <section style={{
        width: "100%",
        maxWidth: "400px",
        padding: "32px",
        border: "1px solid #29334d",
        borderRadius: "16px",
        background: "#121a2c"
      }}>
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>NOVA</h1>
        <p style={{ color: "#aab6cf", marginBottom: "28px" }}>
          Tu asistente para aprender programación
        </p>

        <h2 style={{ marginBottom: "20px" }}>
          {registro ? "Crear cuenta" : "Iniciar sesión"}
        </h2>

        <form onSubmit={enviarFormulario}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            autoComplete="email"
            style={estiloInput}
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
            autoComplete={registro ? "new-password" : "current-password"}
            style={estiloInput}
          />

          {error && (
            <p role="alert" style={{ color: "#ff8585", margin: "12px 0" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={cargando} style={estiloBoton}>
            {cargando
              ? "Procesando..."
              : registro
                ? "Crear cuenta"
                : "Entrar a NOVA"}
          </button>
        </form>

        <button
          type="button"
          disabled={cargando}
          onClick={iniciarConGoogle}
          style={{ ...estiloBoton, background: "#ffffff", color: "#172033" }}
        >
          Continuar con Google
        </button>

        <p style={{ textAlign: "center", marginTop: "22px", color: "#aab6cf" }}>
          {registro ? "¿Ya tienes cuenta?" : "¿Eres nuevo en NOVA?"}{" "}
          <button
            type="button"
            onClick={() => {
              setRegistro(!registro);
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#8da8ff",
              cursor: "pointer"
            }}
          >
            {registro ? "Inicia sesión" : "Crear cuenta"}
          </button>
        </p>
      </section>
    </main>
  );
}

const estiloInput: React.CSSProperties = {
  display: "block",
  boxSizing: "border-box",
  width: "100%",
  padding: "12px",
  margin: "8px 0 18px",
  borderRadius: "8px",
  border: "1px solid #35415c",
  background: "#0b1020",
  color: "#ffffff"
};

const estiloBoton: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginTop: "12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600
};
