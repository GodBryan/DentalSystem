"use client";

import { useEffect, useMemo, useState } from "react";

type Paciente = {
  id: string;
  nombres?: string;
  apellidos?: string;
  estado?: string;
};

type Cita = {
  id: number;
  paciente?: string;
  fecha?: string;
  hora?: string;
  tipo?: string;
  estado?: string;
};

type Pago = {
  id: number;
  paciente?: string;
  monto?: number;
  estado?: string;
  fecha?: string;
};

type Tratamiento = {
  id: number;
  paciente?: string;
  nombre?: string;
  estado?: string;
  costo?: number;
};

export default function ReportesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);

  useEffect(() => {
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
        "Error cargando reportes:",
        error
      );
    }
  }, []);

  const hoy = new Date();

  const mesActual = hoy.getMonth();
  const anioActual = hoy.getFullYear();

  const citasMes = useMemo(() => {
    return citas.filter((cita) => {
      if (!cita.fecha) return false;

      const fecha = new Date(cita.fecha);

      return (
        fecha.getMonth() === mesActual &&
        fecha.getFullYear() === anioActual
      );
    });
  }, [citas, mesActual, anioActual]);

  const pagosMes = useMemo(() => {
    return pagos.filter((pago) => {
      if (!pago.fecha) return false;

      const fecha = new Date(pago.fecha);

      return (
        fecha.getMonth() === mesActual &&
        fecha.getFullYear() === anioActual
      );
    });
  }, [pagos, mesActual, anioActual]);

  const totalPagado = pagos
    .filter((pago) => pago.estado === "Pagado")
    .reduce(
      (total, pago) =>
        total + Number(pago.monto || 0),
      0
    );

  const totalPagadoMes = pagosMes
    .filter((pago) => pago.estado === "Pagado")
    .reduce(
      (total, pago) =>
        total + Number(pago.monto || 0),
      0
    );

  const pacientesActivos = pacientes.filter(
    (paciente) =>
      paciente.estado !== "Inactivo"
  ).length;

  const tratamientosActivos =
    tratamientos.filter(
      (tratamiento) =>
        tratamiento.estado === "Pendiente" ||
        tratamiento.estado === "En proceso" ||
        tratamiento.estado === "Activo"
    ).length;

  const citasConfirmadas =
    citas.filter(
      (cita) =>
        cita.estado === "Confirmada"
    ).length;

  const citasAtendidas =
    citas.filter(
      (cita) =>
        cita.estado === "Atendida"
    ).length;

  const citasCanceladas =
    citas.filter(
      (cita) =>
        cita.estado === "Cancelada"
    ).length;

  const volver = () => {
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-slate-100">

      <div className="p-8 max-w-7xl mx-auto">

        {/* VOLVER */}

        <button
          type="button"
          onClick={volver}
          className="text-cyan-600 hover:text-cyan-800 font-medium mb-5"
        >
          ← Volver al inicio
        </button>


        {/* ENCABEZADO */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                📊 Reportes
              </h1>

              <p className="text-slate-500 mt-2">
                Resumen general de la actividad de la clínica.
              </p>

            </div>

            <div className="bg-cyan-50 text-cyan-700 px-4 py-3 rounded-xl font-semibold">
              {hoy.toLocaleDateString(
                "es-CO",
                {
                  month: "long",
                  year: "numeric",
                }
              )}
            </div>

          </div>

        </div>


        {/* INDICADORES */}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Pacientes activos
            </p>

            <p className="text-3xl font-bold text-cyan-600 mt-2">
              {pacientesActivos}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              {pacientes.length} registrados
            </p>

          </div>


          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Citas del mes
            </p>

            <p className="text-3xl font-bold text-purple-600 mt-2">
              {citasMes.length}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              {citasConfirmadas} confirmadas
            </p>

          </div>


          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Tratamientos activos
            </p>

            <p className="text-3xl font-bold text-orange-500 mt-2">
              {tratamientosActivos}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              En seguimiento
            </p>

          </div>


          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Ingresos totales
            </p>

            <p className="text-2xl font-bold text-green-600 mt-2">
              $
              {totalPagado.toLocaleString(
                "es-CO"
              )}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              $
              {totalPagadoMes.toLocaleString(
                "es-CO"
              )}{" "}
              este mes
            </p>

          </div>

        </section>


        {/* ACTIVIDAD DE CITAS */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-xl font-bold">
              📅 Estado de las citas
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Distribución de las citas registradas.
            </p>


            <div className="space-y-4 mt-6">

              <Barra
                nombre="Confirmadas"
                cantidad={citasConfirmadas}
                total={Math.max(citas.length, 1)}
                clase="bg-green-500"
              />

              <Barra
                nombre="Atendidas"
                cantidad={citasAtendidas}
                total={Math.max(citas.length, 1)}
                clase="bg-cyan-500"
              />

              <Barra
                nombre="Canceladas"
                cantidad={citasCanceladas}
                total={Math.max(citas.length, 1)}
                clase="bg-red-500"
              />

              <Barra
                nombre="Programadas"
                cantidad={
                  citas.filter(
                    (cita) =>
                      cita.estado ===
                      "Programada"
                  ).length
                }
                total={Math.max(citas.length, 1)}
                clase="bg-orange-400"
              />

            </div>

          </div>


          {/* RESUMEN FINANCIERO */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-xl font-bold">
              💰 Resumen financiero
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Información de pagos registrados.
            </p>


            <div className="space-y-5 mt-6">

              <div className="flex items-center justify-between">

                <span className="text-slate-500">
                  Pagos registrados
                </span>

                <span className="font-bold">
                  {pagos.length}
                </span>

              </div>


              <div className="flex items-center justify-between">

                <span className="text-slate-500">
                  Pagos realizados
                </span>

                <span className="font-bold text-green-600">
                  {
                    pagos.filter(
                      (pago) =>
                        pago.estado ===
                        "Pagado"
                    ).length
                  }
                </span>

              </div>


              <div className="border-t border-slate-100 pt-5">

                <p className="text-sm text-slate-500">
                  Total recaudado
                </p>

                <p className="text-3xl font-bold text-green-600 mt-1">
                  $
                  {totalPagado.toLocaleString(
                    "es-CO"
                  )}
                </p>

              </div>


              <div>

                <p className="text-sm text-slate-500">
                  Recaudado este mes
                </p>

                <p className="text-2xl font-bold text-cyan-600 mt-1">
                  $
                  {totalPagadoMes.toLocaleString(
                    "es-CO"
                  )}
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* TRATAMIENTOS */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h2 className="text-xl font-bold">
                🩺 Tratamientos
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Estado general de los tratamientos.
              </p>

            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/tratamientos";
              }}
              className="px-4 py-2 rounded-xl bg-cyan-50 text-cyan-700 font-semibold hover:bg-cyan-100"
            >
              Ver tratamientos →
            </button>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

            <div className="bg-orange-50 rounded-xl p-5">

              <p className="text-sm text-orange-700">
                Pendientes
              </p>

              <p className="text-3xl font-bold text-orange-600 mt-2">
                {
                  tratamientos.filter(
                    (t) =>
                      t.estado ===
                      "Pendiente"
                  ).length
                }
              </p>

            </div>


            <div className="bg-blue-50 rounded-xl p-5">

              <p className="text-sm text-blue-700">
                En proceso
              </p>

              <p className="text-3xl font-bold text-blue-600 mt-2">
                {
                  tratamientos.filter(
                    (t) =>
                      t.estado ===
                      "En proceso"
                  ).length
                }
              </p>

            </div>


            <div className="bg-green-50 rounded-xl p-5">

              <p className="text-sm text-green-700">
                Completados
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {
                  tratamientos.filter(
                    (t) =>
                      t.estado ===
                      "Completado"
                  ).length
                }
              </p>

            </div>

          </div>

        </section>


        {/* ACCIONES */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-10">

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/pacientes";
            }}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:shadow-md transition"
          >

            <div className="text-3xl mb-3">
              👥
            </div>

            <p className="font-bold">
              Pacientes
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Consultar pacientes registrados.
            </p>

          </button>


          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/agenda";
            }}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:shadow-md transition"
          >

            <div className="text-3xl mb-3">
              📅
            </div>

            <p className="font-bold">
              Agenda
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Revisar citas y agenda.
            </p>

          </button>


          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/pagos";
            }}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:shadow-md transition"
          >

            <div className="text-3xl mb-3">
              💰
            </div>

            <p className="font-bold">
              Pagos
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Consultar pagos de pacientes.
            </p>

          </button>

        </section>

      </div>

    </main>
  );
}


function Barra({
  nombre,
  cantidad,
  total,
  clase,
}: {
  nombre: string;
  cantidad: number;
  total: number;
  clase: string;
}) {
  const porcentaje = Math.min(
    100,
    Math.round((cantidad / total) * 100)
  );

  return (
    <div>

      <div className="flex justify-between mb-2">

        <span className="text-sm font-medium text-slate-700">
          {nombre}
        </span>

        <span className="text-sm text-slate-500">
          {cantidad}
        </span>

      </div>

      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

        <div
          className={`h-full rounded-full ${clase}`}
          style={{
            width: `${porcentaje}%`,
          }}
        />

      </div>

    </div>
  );
}
