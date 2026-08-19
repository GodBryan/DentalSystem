"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cerrarSesion, obtenerSesion, type Usuario } from "@/lib/auth";

type Paciente = {
  id: string;
  nombres?: string;
  apellidos?: string;
  documento?: string;
  estado?: string;
};

type Cita = {
  id: number;
  pacienteId?: string;
  paciente?: string;
  fecha?: string;
  hora?: string;
  tipo?: string;
  estado?: string;
};

type Pago = {
  id: number;
  pacienteId?: string;
  paciente?: string;
  monto?: number;
  estado?: string;
  fecha?: string;
};

type Tratamiento = {
  id: number;
  pacienteId?: string;
  paciente?: string;
  nombre?: string;
  estado?: string;
  costo?: number;
};

export default function Home() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [tratamientos, setTratamientos] =
    useState<Tratamiento[]>([]);

  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    cargarDatos();
    setUsuario(obtenerSesion());
  }, []);

  const cargarDatos = () => {
    try {
      const pacientesData = localStorage.getItem(
        "dentalSystemPacientes"
      );

      const citasData =
        localStorage.getItem("citas-bryan");

      const pagosData =
        localStorage.getItem("pagos-bryan");

      const tratamientosData =
        localStorage.getItem("tratamientos-bryan");

      if (pacientesData) {
        setPacientes(JSON.parse(pacientesData));
      }

      if (citasData) {
        setCitas(JSON.parse(citasData));
      }

      if (pagosData) {
        setPagos(JSON.parse(pagosData));
      }

      if (tratamientosData) {
        setTratamientos(JSON.parse(tratamientosData));
      }
    } catch (error) {
      console.error(
        "Error cargando datos del dashboard:",
        error
      );
    }
  };

  /* ===================================================== */
  /* FECHA ACTUAL */
  /* ===================================================== */

  const hoy = new Date();

  const fechaHoy = hoy.toISOString().split("T")[0];

  const mesActual = hoy.getMonth();

  const anioActual = hoy.getFullYear();


  /* ===================================================== */
  /* PACIENTES */
  /* ===================================================== */

  const pacientesActivos = pacientes.filter(
    (paciente) =>
      paciente.estado !== "Inactivo"
  ).length;


  /* ===================================================== */
  /* CITAS */
  /* ===================================================== */

  const citasHoy = citas.filter(
    (cita) => cita.fecha === fechaHoy
  );

  const citasProximas = useMemo(() => {
    return [...citas]
      .filter((cita) => {
        if (!cita.fecha) return false;

        const fechaCita = new Date(
          `${cita.fecha}T${cita.hora || "00:00"}`
        );

        return fechaCita >= hoy;
      })
      .sort((a, b) => {
        const fechaA = new Date(
          `${a.fecha}T${a.hora || "00:00"}`
        ).getTime();

        const fechaB = new Date(
          `${b.fecha}T${b.hora || "00:00"}`
        ).getTime();

        return fechaA - fechaB;
      })
      .slice(0, 5);
  }, [citas]);


  /* ===================================================== */
  /* TRATAMIENTOS */
  /* ===================================================== */

  const tratamientosActivos =
    tratamientos.filter(
      (tratamiento) =>
        tratamiento.estado === "Pendiente" ||
        tratamiento.estado === "En proceso" ||
        tratamiento.estado === "Activo"
    ).length;

  const tratamientosPendientes =
    tratamientos.filter(
      (tratamiento) =>
        tratamiento.estado === "Pendiente"
    ).length;


  /* ===================================================== */
  /* PAGOS */
  /* ===================================================== */

  const pagosMes = pagos.filter((pago) => {
    if (!pago.fecha) return false;

    const fecha = new Date(pago.fecha);

    return (
      fecha.getMonth() === mesActual &&
      fecha.getFullYear() === anioActual
    );
  });

  const ingresosMes = pagosMes
    .filter(
      (pago) =>
        pago.estado === "Pagado" ||
        pago.estado === "Completado"
    )
    .reduce(
      (total, pago) =>
        total + Number(pago.monto || 0),
      0
    );


  const pagosPendientes = pagos.filter(
    (pago) =>
      pago.estado === "Pendiente" ||
      pago.estado === "Pendiente de pago"
  ).length;


  /* ===================================================== */
  /* FORMATO DINERO */
  /* ===================================================== */

  const dinero = (valor: number) => {
    return `$${valor.toLocaleString("es-CO")}`;
  };


  /* ===================================================== */
  /* NOMBRE DEL PACIENTE */
  /* ===================================================== */

  const obtenerNombrePaciente = (
    cita: Cita
  ) => {
    if (cita.paciente) {
      return cita.paciente;
    }

    if (cita.pacienteId) {
      const paciente = pacientes.find(
        (p) =>
          String(p.id) ===
          String(cita.pacienteId)
      );

      if (paciente) {
        return `${paciente.nombres || ""} ${
          paciente.apellidos || ""
        }`.trim();
      }
    }

    return "Paciente";
  };


  const cerrarSesionUsuario = () => {
    cerrarSesion();
    window.location.href = "/login";
  };

  const nombreUsuario = usuario?.nombre || "Usuario";
  const rolUsuario =
    usuario?.rol === "doctor"
      ? "Doctor"
      : usuario?.rol === "recepcion"
      ? "Recepción"
      : "Administrador";

  const inicialesUsuario = (usuario?.nombre || "US")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden lg:flex w-[270px] bg-[#0b1220] text-white flex-col shrink-0">

          <div className="px-6 py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#0b1220]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3.5c-3.1-2.1-7.5-.2-7.5 3.8 0 2.2.9 3.7 1.4 5.8.5 2 .8 5.5 2.4 7.1.7.7 1.6.4 2-.7l.8-2.4c.2-.7 1.1-.7 1.4 0l.8 2.4c.4 1.1 1.3 1.4 2 .7 1.6-1.6 1.9-5.1 2.4-7.1.5-2.1 1.4-3.6 1.4-5.8 0-4-4.4-5.9-7.5-3.8Z"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-base font-bold tracking-tight">
                  Dental System
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gestión odontológica
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 overflow-y-auto">

            <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Principal
            </p>

            <div className="space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-semibold"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" />
                </svg>
                Inicio
              </Link>

              <Link href="/pacientes" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white text-sm font-medium transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 20v-1.5a4.5 4.5 0 0 0-3-4.24M16 2.13a4 4 0 0 1 0 7.74" />
                </svg>
                Pacientes
              </Link>

              <Link href="/agenda" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white text-sm font-medium transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path strokeLinecap="round" d="M16 3v4M8 3v4M3 10h18" />
                </svg>
                Agenda
              </Link>

              {usuario?.rol !== "recepcion" && (
                <>
                  <Link href="/historias-clinicas" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white text-sm font-medium transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10a2 2 0 0 1 2 2v14H7a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2h1Zm0 0v16" />
                      <path strokeLinecap="round" d="M8 9h7M8 13h7M8 17h4" />
                    </svg>
                    Historias clínicas
                  </Link>

                  <Link href="/odontograma" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white text-sm font-medium transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5c-3.1-2.1-7.5-.2-7.5 3.8 0 2.2.9 3.7 1.4 5.8.5 2 .8 5.5 2.4 7.1.7.7 1.6.4 2-.7l.8-2.4c.2-.7 1.1-.7 1.4 0l.8 2.4c.4 1.1 1.3 1.4 2 .7 1.6-1.6 1.9-5.1 2.4-7.1.5-2.1 1.4-3.6 1.4-5.8 0-4-4.4-5.9-7.5-3.8Z" />
                    </svg>
                    Odontograma
                  </Link>

                  <Link href="/tratamientos" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white text-sm font-medium transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 4h4M9 12h6M9 16h4" />
                    </svg>
                    Tratamientos
                  </Link>
                </>
              )}
            </div>

            <p className="px-3 mb-3 mt-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {usuario?.rol === "admin" ? "Administración" : "Gestión"}
            </p>

            <div className="space-y-1">
              <Link href="/pagos" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white text-sm font-medium transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path strokeLinecap="round" d="M3 10h18M7 15h3" />
                </svg>
                Pagos
              </Link>

              {usuario?.rol === "admin" && (
                <>
                  <Link href="/inventario" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white text-sm font-medium transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7M8 9v9M16 9v9" />
                    </svg>
                    Inventario
                  </Link>

                  <Link href="/reportes" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white text-sm font-medium transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5M4 19h16" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16v-4M12 16V8M16 16v-7" />
                    </svg>
                    Reportes
                  </Link>

                  <Link href="/configuracion" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white text-sm font-medium transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="3" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.04H6v-2.4h.84A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88L8 8.06l1.7-1.7.06.06A1.7 1.7 0 0 0 11.64 6h.2V4h.32v2h.2a1.7 1.7 0 0 0 1.88.42l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 15.6 10a1.7 1.7 0 0 0 1.56 1.04H18v2.4h-.84A1.7 1.7 0 0 0 15.6 15Z" />
                    </svg>
                    Configuración
                  </Link>

                  <Link href="/admin/usuarios" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white text-sm font-medium transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 20v-1.5a4.5 4.5 0 0 0-3-4.24M16 2.13a4 4 0 0 1 0 7.74" />
                    </svg>
                    Usuarios
                  </Link>

                  <Link href="/admin/auditoria" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white text-sm font-medium transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4h6M9 3h6v3H9zM7 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                      <path strokeLinecap="round" d="M7 11h10M7 15h7M7 19h4" />
                    </svg>
                    Auditoría
                  </Link>
                </>
              )}
            </div>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xs font-bold">
                {inicialesUsuario}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {nombreUsuario}
                </p>
                <p className="text-xs text-slate-400">
                  {rolUsuario}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={cerrarSesionUsuario}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-300 text-sm font-medium transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* CONTENIDO */}
        <section className="flex-1 min-w-0">

          <header className="h-[72px] bg-white border-b border-slate-200 px-5 lg:px-8 flex items-center justify-between sticky top-0 z-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Panel de control
              </p>
              <h2 className="text-xl font-bold text-slate-900">
                Buenos días, {nombreUsuario}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {usuario?.rol === "admin" && (
                <Link
                  href="/configuracion"
                  className="hidden sm:flex w-10 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 items-center justify-center text-slate-600"
                  title="Configuración"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06A1.7 1.7 0 0 0 16.1 18.4a1.7 1.7 0 0 0-1.04 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.04H6v-2.4h.84A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88L8 8.06l1.7-1.7.06.06A1.7 1.7 0 0 0 11.64 6h.2V4h.32v2h.2a1.7 1.7 0 0 0 1.88.42l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 15.6 10a1.7 1.7 0 0 0 1.56 1.04H18v2.4h-.84A1.7 1.7 0 0 0 15.6 15Z" />
                  </svg>
                </Link>
              )}

              <div className="lg:hidden w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                {inicialesUsuario}
              </div>
            </div>
          </header>

          <div className="p-5 lg:p-8">

            <div className="mb-7">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Resumen de la clínica
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Información actual basada en los registros del sistema.
              </p>
            </div>

            {/* MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

              <Link href="/agenda" className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Citas hoy</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{citasHoy.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path strokeLinecap="round" d="M16 3v4M8 3v4M3 10h18" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">{citas.length} citas registradas</p>
              </Link>

              <Link href="/pacientes" className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Pacientes</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{pacientes.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 20v-1.5a4.5 4.5 0 0 0-3-4.24M16 2.13a4 4 0 0 1 0 7.74" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">{pacientesActivos} activos</p>
              </Link>

              <Link href="/tratamientos" className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Tratamientos activos</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{tratamientosActivos}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 4h4M9 12h6M9 16h4" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">{tratamientosPendientes} pendientes</p>
              </Link>

              <Link href="/pagos" className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Ingresos del mes</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{dinero(ingresosMes)}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path strokeLinecap="round" d="M3 10h18M7 15h3" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">{pagosMes.length} pagos este mes</p>
              </Link>
            </div>

            {/* CITAS + ACCIONES */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">

              <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">Próximas citas</h3>
                    <p className="text-xs text-slate-500 mt-1">Citas reales registradas</p>
                  </div>
                  <Link href="/agenda" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
                    Ver agenda
                  </Link>
                </div>

                <div className="divide-y divide-slate-100">
                  {citasProximas.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="font-semibold text-slate-700">No hay próximas citas</p>
                      <p className="text-sm text-slate-500 mt-1">Las citas que registres aparecerán aquí.</p>
                    </div>
                  ) : (
                    citasProximas.map((cita) => (
                      <div key={cita.id} className="p-5 flex items-center gap-4">
                        <div className="w-20 shrink-0">
                          <p className="text-sm font-bold text-slate-900">{cita.hora || "--:--"}</p>
                          <p className="text-xs text-slate-400 mt-1">{cita.fecha || ""}</p>
                        </div>

                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="9" cy="8" r="3" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 20a5.5 5.5 0 0 1 11 0M16 11a3 3 0 0 1 2.5 5M18 8a2.5 2.5 0 1 0 0-5" />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{obtenerNombrePaciente(cita)}</p>
                          <p className="text-sm text-slate-500 truncate mt-0.5">{cita.tipo || "Consulta"}</p>
                        </div>

                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                          {cita.estado || "Programada"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900">Acciones rápidas</h3>
                  <p className="text-xs text-slate-500 mt-1">Funciones principales</p>
                </div>

                <div className="p-4 space-y-2">
                  <Link href="/nuevo-paciente" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="9" cy="8" r="3" />
                        <path strokeLinecap="round" d="M3.5 20a5.5 5.5 0 0 1 11 0M19 8v6M16 11h6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Nuevo paciente</p>
                      <p className="text-xs text-slate-500">Registrar paciente</p>
                    </div>
                  </Link>

                  <Link href="/agenda" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path strokeLinecap="round" d="M16 3v4M8 3v4M3 10h18" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Nueva cita</p>
                      <p className="text-xs text-slate-500">Agendar paciente</p>
                    </div>
                  </Link>

                  {usuario?.rol !== "recepcion" && (
                    <Link href="/historias-clinicas" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10a2 2 0 0 1 2 2v14H7a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2h1Zm0 0v16" />
                          <path strokeLinecap="round" d="M8 9h7M8 13h7M8 17h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Nueva consulta</p>
                        <p className="text-xs text-slate-500">Registrar atención</p>
                      </div>
                    </Link>
                  )}

                  <Link href="/pagos" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path strokeLinecap="round" d="M3 10h18M7 15h3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Registrar pago</p>
                      <p className="text-xs text-slate-500">Registrar un abono</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* ALERTAS */}
            <div className="mt-5 bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h3 className="font-bold text-slate-900">Alertas y seguimiento</h3>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3">

                <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-sm font-semibold text-amber-800">Tratamientos pendientes</p>
                  <p className="text-sm text-amber-700 mt-1">{tratamientosPendientes} tratamientos pendientes.</p>
                </div>

                <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-sm font-semibold text-red-800">Pagos pendientes</p>
                  <p className="text-sm text-red-700 mt-1">{pagosPendientes} pagos pendientes.</p>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm font-semibold text-blue-800">Citas próximas</p>
                  <p className="text-sm text-blue-700 mt-1">{citasProximas.length} próximas citas registradas.</p>
                </div>

              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}