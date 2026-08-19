"use client";

import { useEffect, useState } from "react";

type Documento = {
  id: number;
  nombre: string;
  tipo: string;
  fecha: string;
  descripcion: string;
};

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Historia clínica");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    const guardado = localStorage.getItem("documentos-bryan");

    if (guardado) {
      try {
        setDocumentos(JSON.parse(guardado));
      } catch {
        setDocumentos([]);
      }
    }
  }, []);

  const guardarDocumento = () => {
    if (!nombre || !fecha) {
      alert("Completa el nombre y la fecha.");
      return;
    }

    const nuevoDocumento: Documento = {
      id: Date.now(),
      nombre,
      tipo,
      fecha,
      descripcion,
    };

    const nuevosDocumentos = [
      ...documentos,
      nuevoDocumento,
    ];

    setDocumentos(nuevosDocumentos);

    localStorage.setItem(
      "documentos-bryan",
      JSON.stringify(nuevosDocumentos)
    );

    setNombre("");
    setTipo("Historia clínica");
    setFecha("");
    setDescripcion("");
    setMostrarFormulario(false);
  };

  const eliminarDocumento = (id: number) => {
    const nuevosDocumentos = documentos.filter(
      (documento) => documento.id !== id
    );

    setDocumentos(nuevosDocumentos);

    localStorage.setItem(
      "documentos-bryan",
      JSON.stringify(nuevosDocumentos)
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-7xl mx-auto">

        <a
          href=".."
          className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
        >
          ← Volver al paciente
        </a>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mt-5">

          {/* ENCABEZADO */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                📄 Documentos
              </h1>

              <p className="text-slate-500 mt-2">
                Gestiona los documentos asociados al paciente.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setMostrarFormulario(!mostrarFormulario)
              }
              className="px-5 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition"
            >
              {mostrarFormulario
                ? "Cerrar formulario"
                : "+ Nuevo documento"}
            </button>

          </div>


          {/* FORMULARIO */}

          {mostrarFormulario && (

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">

              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Nuevo documento
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre del documento *
                  </label>

                  <input
                    value={nombre}
                    onChange={(e) =>
                      setNombre(e.target.value)
                    }
                    placeholder="Ej. Radiografía panorámica"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tipo
                  </label>

                  <select
                    value={tipo}
                    onChange={(e) =>
                      setTipo(e.target.value)
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  >

                    <option>Historia clínica</option>
                    <option>Radiografía</option>
                    <option>Fotografía</option>
                    <option>Consentimiento</option>
                    <option>Orden médica</option>
                    <option>Resultado de laboratorio</option>
                    <option>Presupuesto</option>
                    <option>Factura</option>
                    <option>Otro</option>

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
                    Descripción
                  </label>

                  <input
                    value={descripcion}
                    onChange={(e) =>
                      setDescripcion(e.target.value)
                    }
                    placeholder="Descripción del documento"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  />

                </div>

              </div>


              <div className="flex justify-end mt-6">

                <button
                  type="button"
                  onClick={guardarDocumento}
                  className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600"
                >
                  Guardar documento
                </button>

              </div>

            </div>

          )}


          {/* LISTADO */}

          <div>

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-xl font-bold text-slate-900">
                Documentos registrados
              </h2>

              <span className="text-sm text-slate-500">
                {documentos.length} documento
                {documentos.length !== 1 ? "s" : ""}
              </span>

            </div>


            {documentos.length === 0 ? (

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">

                <div className="text-4xl mb-3">
                  📄
                </div>

                <p className="font-semibold text-slate-700">
                  No hay documentos registrados
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Agrega un documento para comenzar.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {[...documentos]
                  .sort((a, b) =>
                    b.fecha.localeCompare(a.fecha)
                  )
                  .map((documento) => (

                    <div
                      key={documento.id}
                      className="border border-slate-200 rounded-2xl p-5"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                          <h3 className="text-lg font-bold text-slate-900">
                            {documento.nombre}
                          </h3>

                          <div className="flex flex-wrap gap-2 mt-2">

                            <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold">
                              {documento.tipo}
                            </span>

                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                              📅 {documento.fecha}
                            </span>

                          </div>

                          {documento.descripcion && (

                            <p className="text-sm text-slate-500 mt-3">
                              {documento.descripcion}
                            </p>

                          )}

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            eliminarDocumento(documento.id)
                          }
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>

                      </div>

                    </div>

                  ))}

              </div>

            )}

          </div>

        </div>

      </div>

    </main>
  );
}