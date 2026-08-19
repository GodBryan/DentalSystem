"use client";

import { useEffect, useMemo, useState } from "react";

type Paciente = {
  id: string;
  nombres: string;
  apellidos: string;
  documento: string;
  estado?: string;
};

type Cita = {
  id: number;
  pacienteId?: string;
  paciente?: string;
  fecha: string;
  hora: string;
  tipo: string;
  estado: string;
  profesional?: string;
  observaciones?: string;
};

export default function AgendaPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [pacienteId, setPacienteId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [tipo, setTipo] = useState("Consulta general");
  const [estado, setEstado] = useState("Programada");
  const [profesional, setProfesional] = useState("");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    const pacientesGuardados = localStorage.getItem(
      "dentalSystemPacientes"
    );

    if (pacientesGuardados) {
      try {
        setPacientes(JSON.parse(pacientesGuardados));
      } catch {
        setPacientes([]);
      }
    }

    const citasGuardadas =
      localStorage.getItem("citas-bryan");

    if (citasGuardadas) {
      try {
        setCitas(JSON.parse(citasGuardadas));
      } catch {
        setCitas([]);
      }
    }
  }, []);

  const guardarCitas = (nuevasCitas: Cita[]) => {
    setCitas(nuevasCitas);

    localStorage.setItem(
      "citas-bryan",
      JSON.stringify(nuevasCitas)
    );
  };

  const crearCita = () => {
    if (!pacienteId || !fecha || !hora) {
      alert("Selecciona paciente, fecha y hora.");
      return;
    }

    const paciente = pacientes.find(
      (p) => String(p.id) === String(pacienteId)
    );

    const nuevaCita: Cita = {
      id: Date.now(),
      pacienteId,
      paciente: paciente
        ? `${paciente.nombres} ${paciente.apellidos}`
        : "Paciente",
      fecha,
      hora,
      tipo,
      estado,
      profesional,
      observaciones,
    };

    guardarCitas([...citas, nuevaCita]);

    setPacienteId("");
    setFecha("");
    setHora("");
    setTipo("Consulta general");
    setEstado("Programada");
    setProfesional("");
    setObservaciones("");
    setMostrarFormulario(false);
  };

  const cambiarEstado = (
    id: number,
    nuevoEstado: string
  ) => {
    const nuevasCitas = citas.map((cita) =>
      cita.id === id
        ? {
            ...cita,
            estado: nuevoEstado,
          }
        : cita
    );

    guardarCitas(nuevasCitas);
  };

  const eliminarCita = (id: number) => {
    const confirmar = window.confirm(
      "¿Deseas eliminar esta cita?"
    );

    if (!confirmar) return;

    guardarCitas(
      citas.filter((cita) => cita.id !== id)
    );
  };

  const citasOrdenadas = useMemo(() => {
    return [...citas].sort((a, b) => {
      const fechaA = `${a.fecha} ${a.hora}`;
      const fechaB = `${b.fecha} ${b.hora}`;

      return fechaA.localeCompare(fechaB);
    });
  }, [citas]);

  const hoy = new Date()
    .toISOString()
    .split("T")[0];

  const citasHoy = citas.filter(
    (cita) => cita.fecha === hoy
  ).length;

  const citasPendientes = citas.filter(
    (cita) =>
      cita.estado === "Programada" ||
      cita.estado === "Confirmada"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100">

      <div className="p-8 max-w-7xl mx-auto">

        {/* VOLVER */}

        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          className="text-cyan-600 hover:text-cyan-800 font-medium mb-5"
        >
          ← Volver al inicio
        </button>


        {/* CABECERA */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-7">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>

                <h1 className="text-3xl font-bold text-slate-900">
                  📅 Agenda
                </h1>

                <p className="text-slate-500 mt-2">
                  Administra las citas de la clínica.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setMostrarFormulario(
                    !mostrarFormulario
                  )
                }
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
              >
                {mostrarFormulario
                  ? "Cerrar"
                  : "+ Nueva cita"}
              </button>

            </div>

          </div>


          {/* RESUMEN */}

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-slate-100">

            <div className="p-5">

              <p className="text-sm text-slate-500">
                Citas registradas
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {citas.length}
              </p>

            </div>

            <div className="p-5 border-t md:border-t-0 md:border-l border-slate-100">

              <p className="text-sm text-slate-500">
                Citas de hoy
              </p>

              <p className="text-3xl font-bold text-cyan-600 mt-1">
                {citasHoy}
              </p>

            </div>

            <div className="p-5 border-t md:border-t-0 md:border-l border-slate-100">

              <p className="text-sm text-slate-500">
                Pendientes
              </p>

              <p className="text-3xl font-bold text-orange-500 mt-1">
                {citasPendientes}
              </p>

            </div>

          </div>

        </div>


        {/* FORMULARIO */}

        {mostrarFormulario && (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 p-7">

            <h2 className="text-xl font-bold mb-6">
              Nueva cita
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Paciente *
                </label>

                <select
                  value={pacienteId}
                  onChange={(e) =>
                    setPacienteId(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                >

                  <option value="">
                    Seleccionar paciente
                  </option>

                  {pacientes.map((paciente) => (

                    <option
                      key={paciente.id}
                      value={paciente.id}
                    >
                      {paciente.nombres}{" "}
                      {paciente.apellidos} —{" "}
                      {paciente.documento}
                    </option>

                  ))}

                </select>

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tipo de cita
                </label>

                <select
                  value={tipo}
                  onChange={(e) =>
                    setTipo(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                >

                  <option>
                    Consulta general
                  </option>

                  <option>
                    Limpieza dental
                  </option>

                  <option>
                    Restauración
                  </option>

                  <option>
                    Ortodoncia
                  </option>

                  <option>
                    Endodoncia
                  </option>

                  <option>
                    Cirugía
                  </option>

                  <option>
                    Control
                  </option>

                  <option>
                    Valoración
                  </option>

                </select>

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Fecha *
                </label>

                <input
                  type="date"
                  value={fecha}
                  onChange={(e) =>
                    setFecha(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                />

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Hora *
                </label>

                <input
                  type="time"
                  value={hora}
                  onChange={(e) =>
                    setHora(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                />

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Estado
                </label>

                <select
                  value={estado}
                  onChange={(e) =>
                    setEstado(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                >

                  <option>
                    Programada
                  </option>

                  <option>
                    Confirmada
                  </option>

                  <option>
                    Atendida
                  </option>

                  <option>
                    Cancelada
                  </option>

                  <option>
                    No asistió
                  </option>

                </select>

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Profesional
                </label>

                <input
                  value={profesional}
                  onChange={(e) =>
                    setProfesional(e.target.value)
                  }
                  placeholder="Nombre del odontólogo"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                />

              </div>


              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Observaciones
                </label>

                <textarea
                  value={observaciones}
                  onChange={(e) =>
                    setObservaciones(e.target.value)
                  }
                  rows={3}
                  placeholder="Notas de la cita..."
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                />

              </div>

            </div>


            <div className="flex justify-end mt-6">

              <button
                type="button"
                onClick={crearCita}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
              >
                Guardar cita
              </button>

            </div>

          </div>

        )}


        {/* LISTADO */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 overflow-hidden">

          <div className="p-6 border-b border-slate-100">

            <h2 className="text-xl font-bold">
              Citas programadas
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Gestiona las citas registradas.
            </p>

          </div>


          {citasOrdenadas.length === 0 ? (

            <div className="p-12 text-center">

              <div className="text-5xl mb-4">
                📅
              </div>

              <p className="font-semibold text-slate-700">
                No hay citas registradas
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Crea la primera cita usando el botón
                "Nueva cita".
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {citasOrdenadas.map((cita) => (

                <div
                  key={cita.id}
                  className="p-6 hover:bg-slate-50 transition"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                    {/* FECHA */}

                    <div className="lg:w-32">

                      <p className="text-sm font-bold text-cyan-600">
                        {cita.fecha}
                      </p>

                      <p className="text-2xl font-bold text-slate-900 mt-1">
                        {cita.hora}
                      </p>

                    </div>


                    {/* PACIENTE */}

                    <div className="flex-1">

                      <h3 className="font-bold text-slate-900">
                        {cita.paciente ||
                          "Paciente"}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {cita.tipo}
                      </p>

                      {cita.profesional && (

                        <p className="text-sm text-slate-500 mt-1">
                          👨‍⚕️ {cita.profesional}
                        </p>

                      )}

                      {cita.observaciones && (

                        <p className="text-sm text-slate-400 mt-2">
                          {cita.observaciones}
                        </p>

                      )}

                    </div>


                    {/* ESTADO */}

                    <div className="flex flex-wrap gap-2">

                      <select
                        value={cita.estado}
                        onChange={(e) =>
                          cambiarEstado(
                            cita.id,
                            e.target.value
                          )
                        }
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                      >

                        <option>
                          Programada
                        </option>

                        <option>
                          Confirmada
                        </option>

                        <option>
                          Atendida
                        </option>

                        <option>
                          Cancelada
                        </option>

                        <option>
                          No asistió
                        </option>

                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarCita(cita.id)
                        }
                        className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
                      >
                        Eliminar
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}