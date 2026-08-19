"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  inicializarUsuarios,
  iniciarSesion,
  obtenerSesion,
  obtenerUsuarios,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    inicializarUsuarios();

    if (obtenerSesion()) {
      router.replace("/");
    }
  }, [router]);

  const entrar = (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setCargando(true);

    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(
      (item) =>
        item.email.toLowerCase() ===
          email.trim().toLowerCase() &&
        item.password === password &&
        item.activo
    );

    if (!usuario) {
      setError(
        "Correo o contraseña incorrectos, o la cuenta está inactiva."
      );

      setCargando(false);
      return;
    }

    iniciarSesion(usuario);

    router.replace("/");
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        {/* LOGO */}

        <div className="text-center mb-8">

          <div className="mx-auto w-20 h-20 rounded-3xl bg-cyan-500 flex items-center justify-center text-4xl shadow-lg">
            🦷
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mt-5">
            Dental System
          </h1>

          <p className="text-slate-500 mt-2">
            Gestión odontológica
          </p>

        </div>


        {/* LOGIN */}

        <form
          onSubmit={entrar}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8"
        >

          <h2 className="text-xl font-bold text-slate-900">
            Iniciar sesión
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-6">
            Ingresa con tu cuenta autorizada.
          </p>


          {/* CORREO */}

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Correo electrónico
          </label>

          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="correo@clinica.com"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white outline-none focus:ring-2 focus:ring-cyan-400"
          />


          {/* CONTRASEÑA */}

          <label className="block text-sm font-semibold text-slate-700 mt-5 mb-2">
            Contraseña
          </label>

          <div className="relative">

            <input
              type={
                mostrar
                  ? "text"
                  : "password"
              }
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-20 text-slate-900 bg-white outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <button
              type="button"
              onClick={() =>
                setMostrar(!mostrar)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 hover:text-cyan-600"
            >
              {mostrar
                ? "Ocultar"
                : "Ver"}
            </button>

          </div>


          {/* ERROR */}

          {error && (

            <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              {error}
            </div>

          )}


          {/* BOTÓN */}

          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white font-bold rounded-xl py-3.5 transition"
          >
            {cargando
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>

        </form>


        {/* INFORMACIÓN */}

        <p className="text-center text-xs text-slate-400 mt-6">
          Sistema de gestión odontológica
        </p>

      </div>

    </main>
  );
}