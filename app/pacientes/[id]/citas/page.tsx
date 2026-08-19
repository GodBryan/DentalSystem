"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Cita = {
  id: number;
  pacienteId: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
  profesional: string;
  notas: string;
};

const estados = [
  "Programada",
  "Confirmada",
  "Atendida",
  "Cancelada",
  "No asistió",
];

export default function CitasPage() {
  const params = useParams();
  const pacienteId = String(params.id);

  const [citas, setCitas] = useState<Cita[]>([]);
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [estado, setEstado] =
    useState("Programada");
  const [profesional, setProfesional] =
    useState("");
  const [notas, setNotas] = useState("");

  const [busqueda, setBusqueda] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  /* =====================================================
     CARGAR CITAS
  ===================================================== */

  useEffect(() => {
    cargarCitas();
  }, [pacienteId]);

  const cargarCitas = () => {
    try {
      const guardado =
        localStorage.getItem("citas-bryan");

      if (!guardado) {
        setCitas([]);
        return;
      }

      const todas = JSON.parse(guardado);

      if (!Array.isArray(todas)) {
        setCitas([]);
        return;
      }

      /*
       * Solo mostramos las citas pertenecientes
       * al paciente actual.
       */

      const citasPaciente = todas.filter(
        (cita: Cita) =>
          String(cita.pacienteId) ===
          pacienteId
      );

      setCitas(citasPaciente);
    } catch (error) {
      console.error(
        "Error cargando citas:",
        error
      );

      setCitas([]);
    }
  };


  /* =====================================================
     ABRIR NUEVA CITA
  ===================================================== */

  const nuevaCita = () => {
    setEditandoId(null);

    setFecha("");
    setHora("");
    setMotivo("");
    setEstado("Programada");
    setProfesional("");
    setNotas("");

    setMensaje("");

    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =====================================================
     EDITAR CITA
  ===================================================== */

  const editarCita = (cita: Cita) => {
    setEditandoId(cita.id);

    setFecha(cita.fecha);
    setHora(cita.hora);
    setMotivo(cita.motivo);
    setEstado(cita.estado);
    setProfesional(cita.profesional);
    setNotas(cita.notas);

    setMensaje("");

    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =====================================================
     GUARDAR CITA
  ===================================================== */

  const guardarCita = () => {
    if (!fecha || !hora || !motivo) {
      alert(
        "Completa fecha, hora y motivo."
      );
      return;
    }

    let todasLasCitas: Cita[] = [];

    try {
      const guardado =
        localStorage.getItem(
          "citas-bryan"
        );

      todasLasCitas = guardado
        ? JSON.parse(guardado)
        : [];

      if (!Array.isArray(todasLasCitas)) {
        todasLasCitas = [];
      }
    } catch {
      todasLasCitas = [];
    }


    /* =================================================
       EDITAR
    ================================================= */

    if (editandoId !== null) {
      const actualizadas =
        todasLasCitas.map((cita) => {

          if (
            cita.id === editandoId &&
            String(cita.pacienteId) ===
              pacienteId
          ) {
            return {
              ...cita,
              pacienteId,
              fecha,
              hora,
              motivo,
              estado,
              profesional,
              notas,
            };
          }

          return cita;
        });

      localStorage.setItem(
        "citas-bryan",
        JSON.stringify(
          actualizadas
        )
      );

      const delPaciente =
        actualizadas.filter(
          (cita) =>
            String(cita.pacienteId) ===
            pacienteId
        );

      setCitas(delPaciente);

      setMensaje(
        "✓ Cita actualizada correctamente."
      );

    } else {

      /* ===============================================
         NUEVA CITA
      =============================================== */

      const nueva: Cita = {
        id: Date.now(),
        pacienteId,
        fecha,
        hora,
        motivo,
        estado,
        profesional,
        notas,
      };

      const nuevasCitas = [
        ...todasLasCitas,
        nueva,
      ];

      localStorage.setItem(
        "citas-bryan",
        JSON.stringify(
          nuevasCitas
        )
      );

      const delPaciente =
        nuevasCitas.filter(
          (cita) =>
            String(cita.pacienteId) ===
            pacienteId
        );

      setCitas(delPaciente);

      setMensaje(
        "✓ Nueva cita creada correctamente."
      );
    }


    limpiarFormulario();

    setTimeout(() => {
      setMensaje("");
    }, 4000);
  };


  /* =====================================================
     LIMPIAR FORMULARIO
  ===================================================== */

  const limpiarFormulario = () => {
    setFecha("");
    setHora("");
    setMotivo("");
    setEstado("Programada");
    setProfesional("");
    setNotas("");

    setEditandoId(null);

    setMostrarFormulario(false);
  };


  /* =====================================================
     CAMBIAR ESTADO
  ===================================================== */

  const cambiarEstado = (
    id: number,
    nuevoEstado: string
  ) => {
    try {
      const guardado =
        localStorage.getItem(
          "citas-bryan"
        );

      const todas: Cita[] = guardado
        ? JSON.parse(guardado)
        : [];

      const actualizadas =
        todas.map((cita) => {

          if (
            cita.id === id &&
            String(cita.pacienteId) ===
              pacienteId
          ) {
            return {
              ...cita,
              estado: nuevoEstado,
            };
          }

          return cita;
        });

      localStorage.setItem(
        "citas-bryan",
        JSON.stringify(
          actualizadas
        )
      );

      setCitas(
        actualizadas.filter(
          (cita) =>
            String(cita.pacienteId) ===
            pacienteId
        )
      );
    } catch (error) {
      console.error(
        "Error cambiando estado:",
        error
      );
    }
  };


  /* =====================================================
     ELIMINAR CITA
  ===================================================== */

  const eliminarCita = (
    id: number
  ) => {
    const confirmar =
      window.confirm(
        "¿Seguro que deseas eliminar esta cita?"
      );

    if (!confirmar) {
      return;
    }

    try {
      const guardado =
        localStorage.getItem(
          "citas-bryan"
        );

      const todas: Cita[] = guardado
        ? JSON.parse(guardado)
        : [];

      const nuevas =
        todas.filter(
          (cita) =>
            cita.id !== id
        );

      localStorage.setItem(
        "citas-bryan",
        JSON.stringify(nuevas)
      );

      setCitas(
        nuevas.filter(
          (cita) =>
            String(cita.pacienteId) ===
            pacienteId
        )
      );

      setMensaje(
        "✓ Cita eliminada correctamente."
      );

      setTimeout(() => {
        setMensaje("");
      }, 3000);
    } catch (error) {
      console.error(
        "Error eliminando cita:",
        error
      );
    }
  };


  /* =====================================================
     VOLVER
  ===================================================== */

  const volverPaciente = () => {
    window.location.href =
      `/pacientes/${pacienteId}`;
  };


  /* =====================================================
     FILTRAR
  ===================================================== */

  const citasFiltradas =
    citas.filter((cita) => {

      const texto =
        `${cita.motivo} ${cita.profesional} ${cita.notas} ${cita.estado}`
          .toLowerCase();

      return texto.includes(
        busqueda.toLowerCase()
      );
    });


  /* =====================================================
     ORDENAR
  ===================================================== */

  const citasOrdenadas =
    [...citasFiltradas].sort(
      (a, b) =>
        `${a.fecha} ${a.hora}`.localeCompare(
          `${b.fecha} ${b.hora}`
        )
    );


  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-7xl mx-auto">

        {/* VOLVER */}

        <button
          type="button"
          onClick={volverPaciente}
          className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
        >
          ← Volver al paciente
        </button>


        {/* CONTENEDOR */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mt-5">


          {/* =================================================
              ENCABEZADO
          ================================================= */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                📅 Citas
              </h1>

              <p className="text-slate-500 mt-2">
                Agenda y administra las citas de este paciente.
              </p>

            </div>


            <button
              type="button"
              onClick={
                mostrarFormulario
                  ? limpiarFormulario
                  : nuevaCita
              }
              className="px-5 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition"
            >
              {mostrarFormulario
                ? "Cerrar formulario"
                : "+ Nueva cita"}
            </button>

          </div>


          {/* MENSAJE */}

          {mensaje && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 font-medium">
              {mensaje}
            </div>
          )}


          {/* =================================================
              FORMULARIO
          ================================================= */}

          {mostrarFormulario && (

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {editandoId !== null
                      ? "Editar cita"
                      : "Nueva cita"}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Los campos marcados con * son obligatorios.
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                {/* FECHA */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Fecha *
                  </label>

                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) =>
                      setFecha(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>


                {/* HORA */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hora *
                  </label>

                  <input
                    type="time"
                    value={hora}
                    onChange={(e) =>
                      setHora(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>


                {/* MOTIVO */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Motivo *
                  </label>

                  <input
                    value={motivo}
                    onChange={(e) =>
                      setMotivo(
                        e.target.value
                      )
                    }
                    placeholder="Ej. Control odontológico"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>


                {/* PROFESIONAL */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Profesional
                  </label>

                  <input
                    value={
                      profesional
                    }
                    onChange={(e) =>
                      setProfesional(
                        e.target.value
                      )
                    }
                    placeholder="Nombre del odontólogo"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>


                {/* ESTADO */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Estado
                  </label>

                  <select
                    value={estado}
                    onChange={(e) =>
                      setEstado(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >

                    {estados.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                </div>


                {/* NOTAS */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Notas
                  </label>

                  <textarea
                    value={notas}
                    onChange={(e) =>
                      setNotas(
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Información adicional de la cita..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>

              </div>


              {/* BOTONES */}

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={
                    limpiarFormulario
                  }
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={
                    guardarCita
                  }
                  className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600"
                >
                  {editandoId !== null
                    ? "Guardar cambios"
                    : "Guardar cita"}
                </button>

              </div>

            </div>

          )}


          {/* =================================================
              BUSCADOR
          ================================================= */}

          {citas.length > 0 && (

            <div className="mb-6">

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Buscar en las citas
              </label>

              <input
                type="text"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
                placeholder="Motivo, profesional, estado o notas..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />

            </div>

          )}


          {/* =================================================
              LISTADO
          ================================================= */}

          <div>

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Historial de citas
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Todas las citas pertenecientes a este paciente.
                </p>

              </div>


              <span className="text-sm font-semibold text-cyan-700 bg-cyan-50 px-4 py-2 rounded-full">
                {citas.length}{" "}
                {citas.length === 1
                  ? "cita"
                  : "citas"}
              </span>

            </div>


            {citasOrdenadas.length ===
            0 ? (

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">

                <div className="text-5xl mb-4">
                  📅
                </div>

                <p className="font-semibold text-slate-700 text-lg">
                  {citas.length === 0
                    ? "No hay citas registradas"
                    : "No encontramos citas"}
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  {citas.length === 0
                    ? "Crea una nueva cita para comenzar."
                    : "Prueba con otro término de búsqueda."}
                </p>

                {citas.length ===
                  0 && (

                  <button
                    type="button"
                    onClick={nuevaCita}
                    className="mt-5 px-5 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600"
                  >
                    + Crear primera cita
                  </button>

                )}

              </div>

            ) : (

              <div className="space-y-4">

                {citasOrdenadas.map(
                  (cita) => (

                    <div
                      key={cita.id}
                      className="border border-slate-200 rounded-2xl p-5 hover:border-cyan-300 hover:shadow-sm transition"
                    >

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">


                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-3">

                            <h3 className="text-lg font-bold text-slate-900">
                              {cita.motivo}
                            </h3>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                cita.estado ===
                                "Atendida"
                                  ? "bg-green-50 text-green-700"
                                  : cita.estado ===
                                    "Cancelada"
                                  ? "bg-red-50 text-red-700"
                                  : cita.estado ===
                                    "Confirmada"
                                  ? "bg-blue-50 text-blue-700"
                                  : cita.estado ===
                                    "No asistió"
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-cyan-50 text-cyan-700"
                              }`}
                            >
                              {cita.estado}
                            </span>

                          </div>


                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">

                            <span>
                              📅{" "}
                              {cita.fecha}
                            </span>

                            <span>
                              🕐{" "}
                              {cita.hora}
                            </span>

                            {cita.profesional && (
                              <span>
                                👨‍⚕️{" "}
                                {
                                  cita.profesional
                                }
                              </span>
                            )}

                          </div>


                          {cita.notas && (

                            <div className="mt-4 bg-slate-50 rounded-xl p-4">

                              <p className="text-xs font-semibold text-slate-400 mb-1">
                                NOTAS
                              </p>

                              <p className="text-sm text-slate-600">
                                {cita.notas}
                              </p>

                            </div>

                          )}

                        </div>


                        {/* ACCIONES */}

                        <div className="flex flex-wrap gap-2 shrink-0">

                          <select
                            value={
                              cita.estado
                            }
                            onChange={(e) =>
                              cambiarEstado(
                                cita.id,
                                e.target.value
                              )
                            }
                            className="border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white text-slate-900"
                          >

                            {estados.map(
                              (item) => (
                                <option
                                  key={item}
                                  value={item}
                                >
                                  {item}
                                </option>
                              )
                            )}

                          </select>


                          <button
                            type="button"
                            onClick={() =>
                              editarCita(
                                cita
                              )
                            }
                            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                          >
                            ✏️ Editar
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              eliminarCita(
                                cita.id
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100"
                          >
                            🗑️ Eliminar
                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </main>
  );
}