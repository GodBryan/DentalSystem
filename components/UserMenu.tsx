"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  cerrarSesion,
  obtenerSesion,
  type Rol,
  type Usuario,
} from "@/lib/auth";

const nombresRol: Record<Rol, string> = {
  admin: "Administrador",
  doctor: "Doctor",
  recepcion: "Recepción",
};

function obtenerIniciales(nombre: string) {
  const partes = nombre.trim().split(/\s+/);

  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase();
  }

  return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
}

export default function UserMenu() {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    setUsuario(obtenerSesion());

    const actualizarSesion = () => {
      setUsuario(obtenerSesion());
    };

    window.addEventListener(
      "storage",
      actualizarSesion
    );

    return () => {
      window.removeEventListener(
        "storage",
        actualizarSesion
      );
    };
  }, []);

  if (!usuario) {
    return null;
  }

  const salir = () => {
    cerrarSesion();
    router.replace("/login");
  };

  const iniciales = obtenerIniciales(
    usuario.nombre
  );

  return (
    <div className="relative">

      {/* BOTÓN DEL USUARIO */}

      <button
        type="button"
        onClick={() =>
          setAbierto((actual) => !actual)
        }
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 transition"
        aria-expanded={abierto}
        aria-label="Abrir menú de usuario"
      >

        <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
          {iniciales}
        </div>

        <div className="hidden sm:block text-left min-w-0">

          <p className="text-sm font-semibold text-slate-900 truncate max-w-[170px]">
            {usuario.nombre}
          </p>

          <p className="text-xs text-slate-500">
            {nombresRol[usuario.rol]}
          </p>

        </div>

        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${
            abierto
              ? "rotate-180"
              : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01.02 1.06z"
            clipRule="evenodd"
          />
        </svg>

      </button>


      {/* MENÚ DESPLEGABLE */}

      {abierto && (
        <>

          {/* FONDO INVISIBLE PARA CERRAR */}

          <button
            type="button"
            aria-label="Cerrar menú"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() =>
              setAbierto(false)
            }
          />


          {/* PANEL */}

          <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">

            {/* INFORMACIÓN */}

            <div className="p-4 border-b border-slate-100">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                  {iniciales}
                </div>

                <div className="min-w-0">

                  <p className="font-semibold text-slate-900 truncate">
                    {usuario.nombre}
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {nombresRol[usuario.rol]}
                  </p>

                  <p className="text-xs text-slate-400 truncate mt-1">
                    {usuario.email}
                  </p>

                </div>

              </div>

            </div>


            {/* ACCIONES */}

            <div className="p-2">

              <button
                type="button"
                onClick={salir}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >

                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
                  />
                </svg>

                Cerrar sesión

              </button>

            </div>

          </div>

        </>
      )}

    </div>
  );
}