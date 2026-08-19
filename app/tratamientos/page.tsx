"use client";

import { useEffect, useState } from "react";

type Paciente = {
  id: string;
  nombres: string;
  apellidos: string;
  documento: string;
  estado?: string;
};

export default function TratamientosGeneral() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const guardado = localStorage.getItem(
      "dentalSystemPacientes"
    );

    if (guardado) {
      try {
        setPacientes(JSON.parse(guardado));
      } catch {
        setPacientes([]);
      }
    }
  }, []);

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto =
      `${paciente.nombres} ${paciente.apellidos} ${paciente.documento}`.toLowerCase();

    return texto.includes(busqueda.toLowerCase());
  });

  const abrirTratamientos = (id: string) => {
    window.location.href = `/pacientes/${id}/tratamientos`;
  };

  return (
    <main className="min-h-screen bg-slate-100">

      <div className="p-8 max-w-7xl mx-auto">

        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          className="text-cyan-600 hover:text-cyan-800 font-medium mb-5"
        >
          ← Volver al inicio
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* ENCABEZADO */}

          <div className="p-7 border-b border-slate-200">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <h1 className="text-3xl font-bold text-slate-900">
                  💊 Tratamientos
                </h1>

                <p className="text-slate-500 mt-2">
                  Selecciona un paciente para consultar y gestionar sus tratamientos.
                </p>

              </div>

              <div className="bg-cyan-50 text-cyan-700 px-4 py-3 rounded-xl font-semibold">
                {pacientes.length} pacientes
              </div>

            </div>

          </div>


          {/* BUSCADOR */}

          <div className="p-6 border-b border-slate-100">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Buscar paciente
            </label>

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre, apellido o documento..."
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

          </div>


          {/* LISTA */}

          <div className="p-6">

            <h2 className="text-xl font-bold text-slate-900 mb-5">
              Seleccionar paciente
            </h2>

            {pacientesFiltrados.length === 0 ? (

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">

                <div className="text-4xl mb-3">
                  🔍
                </div>

                <p className="font-semibold text-slate-700">
                  No encontramos pacientes
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Intenta con otro nombre o documento.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {pacientesFiltrados.map((paciente) => (

                  <button
                    key={paciente.id}
                    type="button"
                    onClick={() =>
                      abrirTratamientos(paciente.id)
                    }
                    className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-cyan-400 hover:shadow-md transition"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-2xl">
                        💊
                      </div>

                      <div className="min-w-0">

                        <h3 className="font-bold text-slate-900 truncate">
                          {paciente.nombres}{" "}
                          {paciente.apellidos}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          CC {paciente.documento}
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          paciente.estado === "Inactivo"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {paciente.estado || "Activo"}
                      </span>

                      <span className="text-sm text-cyan-600 font-semibold">
                        Abrir →
                      </span>

                    </div>

                  </button>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

    </main>
  );
}