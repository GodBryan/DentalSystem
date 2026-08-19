"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  obtenerAuditoria,
  type AccionAuditoria,
  type RegistroAuditoria,
} from "@/lib/auditoria";
import { obtenerSesion } from "@/lib/auth";

const nombresAccion: Record<AccionAuditoria, string> = {
  LOGIN: "Inicio de sesión",
  LOGOUT: "Cierre de sesión",
  CREAR_USUARIO: "Creación de usuario",
  EDITAR_USUARIO: "Edición de usuario",
  ACTIVAR_USUARIO: "Activación de usuario",
  DESACTIVAR_USUARIO: "Desactivación de usuario",
  ELIMINAR_USUARIO: "Eliminación de usuario",
  CREAR_PACIENTE: "Creación de paciente",
  EDITAR_PACIENTE: "Edición de paciente",
  CREAR_CITA: "Creación de cita",
  EDITAR_CITA: "Edición de cita",
  CANCELAR_CITA: "Cancelación de cita",
  CREAR_HISTORIA: "Nueva historia clínica",
  EDITAR_HISTORIA: "Edición de historia clínica",
  CREAR_TRATAMIENTO: "Creación de tratamiento",
  EDITAR_TRATAMIENTO: "Edición de tratamiento",
  REGISTRAR_PAGO: "Registro de pago",
  EDITAR_PAGO: "Edición de pago",
  ELIMINAR_PAGO: "Eliminación de pago",
  MODIFICAR_ODONTOGRAMA: "Modificación de odontograma",
  CREAR_MOVIMIENTO_INVENTARIO: "Movimiento de inventario",
  EDITAR_CONFIGURACION: "Cambio de configuración",
  OTRA: "Otra acción",
};

const nombresRol = {
  admin: "Administrador",
  doctor: "Doctor",
  recepcion: "Recepción",
};

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(fecha));
}

export default function AuditoriaPage() {
  const router = useRouter();
  const [registros, setRegistros] = useState<RegistroAuditoria[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [rol, setRol] = useState("todos");
  const [modulo, setModulo] = useState("todos");
  const [accion, setAccion] = useState("todos");

  useEffect(() => {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== "admin") {
      router.replace("/");
      return;
    }

    setRegistros(obtenerAuditoria());
  }, [router]);

  const modulos = useMemo(
    () =>
      Array.from(
        new Set(
          registros
            .map((registro) => registro.modulo)
            .filter(Boolean)
        )
      ).sort(),
    [registros]
  );

  const acciones = useMemo(
    () =>
      Array.from(
        new Set(registros.map((registro) => registro.accion))
      ),
    [registros]
  );

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return registros.filter((registro) => {
      const coincideBusqueda =
        !texto ||
        [
          registro.usuarioNombre,
          registro.usuarioRol,
          registro.modulo,
          registro.descripcion,
          registro.pacienteNombre || "",
          registro.pacienteId || "",
          nombresAccion[registro.accion],
        ]
          .join(" ")
          .toLowerCase()
          .includes(texto);

      const coincideRol =
        rol === "todos" || registro.usuarioRol === rol;

      const coincideModulo =
        modulo === "todos" || registro.modulo === modulo;

      const coincideAccion =
        accion === "todos" || registro.accion === accion;

      return (
        coincideBusqueda &&
        coincideRol &&
        coincideModulo &&
        coincideAccion
      );
    });
  }, [registros, busqueda, rol, modulo, accion]);

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-cyan-700 hover:text-cyan-900 font-medium mb-5"
        >
          ← Volver al inicio
        </button>

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <header className="p-7 border-b border-slate-200">
            <p className="text-sm font-semibold text-cyan-700 uppercase tracking-wide">
              Administración
            </p>

            <h1 className="text-3xl font-bold text-slate-900 mt-1">
              Auditoría del sistema
            </h1>

            <p className="text-slate-500 mt-2 max-w-3xl">
              Registro de las acciones realizadas por los usuarios
              dentro del sistema.
            </p>
          </header>

          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Buscar
                </label>
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Usuario, paciente, acción o descripción..."
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Rol
                </label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                >
                  <option value="todos">Todos</option>
                  <option value="admin">Administrador</option>
                  <option value="doctor">Doctor</option>
                  <option value="recepcion">Recepción</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Módulo
                </label>
                <select
                  value={modulo}
                  onChange={(e) => setModulo(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                >
                  <option value="todos">Todos</option>
                  {modulos.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 max-w-sm">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Acción
              </label>
              <select
                value={accion}
                onChange={(e) => setAccion(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
              >
                <option value="todos">Todas</option>
                {acciones.map((item) => (
                  <option key={item} value={item}>
                    {nombresAccion[item]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Registro de actividad
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {filtrados.length} registro
                  {filtrados.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {filtrados.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                <p className="font-semibold text-slate-700">
                  No hay registros de auditoría
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Las acciones empezarán a aparecer cuando los
                  módulos registren actividad.
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="hidden lg:grid grid-cols-[1.1fr_1fr_1.1fr_2fr_1.2fr] gap-4 px-5 py-4 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <span>Fecha</span>
                  <span>Usuario</span>
                  <span>Acción</span>
                  <span>Descripción</span>
                  <span>Paciente</span>
                </div>

                <div className="divide-y divide-slate-200">
                  {filtrados.map((registro) => (
                    <div
                      key={registro.id}
                      className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1.1fr_2fr_1.2fr] gap-3 lg:gap-4 px-5 py-5"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {formatearFecha(registro.fecha)}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {registro.usuarioNombre}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {nombresRol[registro.usuarioRol]}
                        </p>
                      </div>

                      <div>
                        <span className="inline-flex px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                          {nombresAccion[registro.accion]}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm text-slate-700">
                          {registro.descripcion}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Módulo: {registro.modulo}
                        </p>
                      </div>

                      <div>
                        {registro.pacienteNombre ? (
                          <>
                            <p className="text-sm font-semibold text-slate-800">
                              {registro.pacienteNombre}
                            </p>
                            {registro.pacienteId && (
                              <p className="text-xs text-slate-400 mt-1">
                                ID: {registro.pacienteId}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-slate-400">
                            No aplica
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
