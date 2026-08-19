"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Paciente = {
  id: string;
  tipoDocumento: string;
  documento: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: string;
  telefono: string;
  correo: string;
  direccion: string;
  ciudad: string;
  contactoEmergencia: string;
  telefonoEmergencia: string;
  eps: string;
  ocupacion: string;
  alergias: string;
  medicamentos: string;
  antecedentes: string;
  observaciones: string;
  fechaRegistro: string;
  estado: string;
};

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const datosGuardados = localStorage.getItem(
      "dentalSystemPacientes"
    );

    if (datosGuardados) {
      try {
        const datos = JSON.parse(datosGuardados);
        setPacientes(datos);
      } catch {
        setPacientes([]);
      }
    }
  }, []);

  const textoBusqueda = busqueda.trim().toLocaleLowerCase();

  const pacientesFiltrados = pacientes.filter((paciente) => {
    if (textoBusqueda === "") {
      return true;
    }

    const nombreCompleto =
      `${paciente.nombres} ${paciente.apellidos}`
        .toLocaleLowerCase();

    const documento =
      paciente.documento.toLocaleLowerCase();

    const telefono =
      paciente.telefono.toLocaleLowerCase();

    return (
      nombreCompleto.includes(textoBusqueda) ||
      documento.includes(textoBusqueda) ||
      telefono.includes(textoBusqueda)
    );
  });

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">

      <div className="p-8">

        {/* ENCABEZADO */}

        <div className="flex items-center justify-between mb-8">

          <div>

            <Link
              href="/"
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
            >
              ← Volver al inicio
            </Link>

            <h1 className="text-3xl font-bold mt-3">
              Pacientes
            </h1>

            <p className="text-slate-500 mt-1">
              Administra y consulta los pacientes de la clínica.
            </p>

          </div>

          <Link
            href="/nuevo-paciente"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-3 rounded-xl shadow-sm"
          >
            + Nuevo paciente
          </Link>

        </div>


        {/* BUSCADOR */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, cédula o teléfono..."
              className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />

          </div>

          {busqueda.trim() !== "" && (
            <div className="mt-3">

              {pacientesFiltrados.length > 0 ? (

                <p className="text-sm text-slate-500">
                  {pacientesFiltrados.length}{" "}
                  {pacientesFiltrados.length === 1
                    ? "paciente encontrado"
                    : "pacientes encontrados"}
                </p>

              ) : (

                <p className="text-sm text-red-500">
                  No encontramos pacientes con esa búsqueda.
                </p>

              )}

            </div>
          )}

        </div>


        {/* TABLA */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100">

            <h2 className="text-lg font-bold">
              Todos los pacientes
            </h2>

            <p className="text-sm text-slate-500 mt-1">

              {busqueda.trim() === ""
                ? `${pacientes.length} ${
                    pacientes.length === 1
                      ? "paciente registrado"
                      : "pacientes registrados"
                  }`
                : `${pacientesFiltrados.length} ${
                    pacientesFiltrados.length === 1
                      ? "resultado"
                      : "resultados"
                  }`}

            </p>

          </div>


          {/* NO HAY PACIENTES */}

          {pacientes.length === 0 ? (

            <div className="p-12 text-center">

              <div className="text-5xl mb-4">
                👤
              </div>

              <h3 className="text-lg font-semibold">
                Todavía no hay pacientes
              </h3>

              <p className="text-slate-500 mt-2 mb-6">
                Registra tu primer paciente para comenzar.
              </p>

              <Link
                href="/nuevo-paciente"
                className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-3 rounded-xl"
              >
                + Registrar paciente
              </Link>

            </div>

          ) : pacientesFiltrados.length === 0 ? (

            /* NO HAY RESULTADOS */

            <div className="p-12 text-center">

              <div className="text-5xl mb-4">
                🔍
              </div>

              <h3 className="text-lg font-semibold">
                No encontramos pacientes
              </h3>

              <p className="text-slate-500 mt-2">
                No existe ningún paciente que coincida con:
              </p>

              <p className="font-semibold text-slate-700 mt-2">
                "{busqueda}"
              </p>

              <button
                onClick={() => setBusqueda("")}
                className="mt-5 text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Limpiar búsqueda
              </button>

            </div>

          ) : (

            /* TABLA */

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr className="text-left text-sm text-slate-500">

                    <th className="px-6 py-4 font-medium">
                      Paciente
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Documento
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Teléfono
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Fecha de registro
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Estado
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Acción
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {pacientesFiltrados.map((paciente) => (

                    <tr
                      key={paciente.id}
                      className="hover:bg-slate-50 transition"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center">
                            👤
                          </div>

                          <div>

                            <p className="font-semibold">
                              {paciente.nombres}{" "}
                              {paciente.apellidos}
                            </p>

                            <p className="text-xs text-slate-400">
                              Paciente
                            </p>

                          </div>

                        </div>

                      </td>


                      <td className="px-6 py-5 text-sm">
                        {paciente.documento}
                      </td>


                      <td className="px-6 py-5 text-sm text-slate-600">
                        {paciente.telefono}
                      </td>


                      <td className="px-6 py-5 text-sm text-slate-600">

                        {new Date(
                          paciente.fechaRegistro
                        ).toLocaleDateString("es-CO")}

                      </td>


                      <td className="px-6 py-5">

                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                          {paciente.estado}
                        </span>

                      </td>


                      <td className="px-6 py-5">

                        <Link
                          href={`/pacientes/${paciente.id}`}
                          className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                        >
                          Ver paciente →
                        </Link>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}