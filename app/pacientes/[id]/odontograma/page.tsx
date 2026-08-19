"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const dientesSuperiores = [
  18, 17, 16, 15, 14, 13, 12, 11,
  21, 22, 23, 24, 25, 26, 27, 28,
];

const dientesInferiores = [
  48, 47, 46, 45, 44, 43, 42, 41,
  31, 32, 33, 34, 35, 36, 37, 38,
];

const superficies = [
  "Oclusal",
  "Mesial",
  "Distal",
  "Vestibular",
  "Lingual / Palatina",
];

type InformacionDiente = {
  estado: string;
  procedimiento: string;
  superficies: string[];
  observacion: string;
};

type Odontograma = Record<number, InformacionDiente>;

const informacionInicial: InformacionDiente = {
  estado: "Sano",
  procedimiento: "",
  superficies: [],
  observacion: "",
};

export default function OdontogramaPage() {
  const params = useParams();
  const pacienteId = String(params.id);

  const [dienteSeleccionado, setDienteSeleccionado] =
    useState<number | null>(null);

  const [odontograma, setOdontograma] =
    useState<Odontograma>({});

  const [estadoDiente, setEstadoDiente] =
    useState("Sano");

  const [procedimientoDiente, setProcedimientoDiente] =
    useState("");

  const [superficiesDiente, setSuperficiesDiente] =
    useState<string[]>([]);

  const [observacionDiente, setObservacionDiente] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");


  /* =====================================================
     CARGAR ODONTOGRAMA DEL PACIENTE
  ===================================================== */

  useEffect(() => {
    const clavePaciente =
      `odontograma-bryan-${pacienteId}`;

    const guardado =
      localStorage.getItem(clavePaciente);

    if (guardado) {
      try {
        const datos = JSON.parse(guardado);

        if (
          datos &&
          typeof datos === "object"
        ) {
          setOdontograma(datos);
        }
      } catch {
        setOdontograma({});
      }
    } else {
      setOdontograma({});
    }
  }, [pacienteId]);


  /* =====================================================
     SELECCIONAR DIENTE
  ===================================================== */

  const seleccionarDiente = (
    diente: number
  ) => {
    setDienteSeleccionado(diente);
    setMensaje("");

    const informacion =
      odontograma[diente] ||
      informacionInicial;

    setEstadoDiente(
      informacion.estado
    );

    setProcedimientoDiente(
      informacion.procedimiento
    );

    setSuperficiesDiente(
      informacion.superficies || []
    );

    setObservacionDiente(
      informacion.observacion
    );
  };


  /* =====================================================
     CAMBIAR SUPERFICIE
  ===================================================== */

  const cambiarSuperficie = (
    superficie: string
  ) => {
    setSuperficiesDiente((actuales) => {
      if (
        actuales.includes(superficie)
      ) {
        return actuales.filter(
          (item) =>
            item !== superficie
        );
      }

      return [
        ...actuales,
        superficie,
      ];
    });
  };


  /* =====================================================
     GUARDAR INFORMACIÓN
  ===================================================== */

  const guardarInformacion = () => {
    if (
      dienteSeleccionado === null
    ) {
      return;
    }

    const nuevaInformacion: InformacionDiente =
      {
        estado: estadoDiente,
        procedimiento:
          procedimientoDiente,
        superficies:
          superficiesDiente,
        observacion:
          observacionDiente,
      };

    const nuevoOdontograma = {
      ...odontograma,
      [dienteSeleccionado]:
        nuevaInformacion,
    };

    setOdontograma(
      nuevoOdontograma
    );

    /*
      IMPORTANTE:
      Cada paciente tiene su propia
      clave de almacenamiento.
    */

    const clavePaciente =
      `odontograma-bryan-${pacienteId}`;

    localStorage.setItem(
      clavePaciente,
      JSON.stringify(
        nuevoOdontograma
      )
    );

    setMensaje(
      `Información del diente ${dienteSeleccionado} guardada correctamente.`
    );
  };


  /* =====================================================
     OBTENER CLASE DEL DIENTE
  ===================================================== */

  const obtenerClaseDiente = (
    diente: number
  ) => {
    if (
      dienteSeleccionado === diente
    ) {
      return "border-cyan-600 bg-cyan-100 text-cyan-800 scale-105 shadow-md";
    }

    if (
      odontograma[diente]
    ) {
      const estado =
        odontograma[diente].estado;

      if (
        estado === "Caries"
      ) {
        return "border-red-500 bg-red-100 text-red-800";
      }

      if (
        estado === "Restaurado"
      ) {
        return "border-blue-500 bg-blue-100 text-blue-800";
      }

      if (
        estado === "Fracturado"
      ) {
        return "border-orange-500 bg-orange-100 text-orange-800";
      }

      if (
        estado === "Ausente"
      ) {
        return "border-slate-600 bg-slate-300 text-slate-800";
      }

      if (
        estado === "Endodoncia"
      ) {
        return "border-purple-500 bg-purple-100 text-purple-800";
      }

      if (
        estado === "Corona"
      ) {
        return "border-yellow-500 bg-yellow-100 text-yellow-900";
      }

      if (
        estado === "Implante"
      ) {
        return "border-green-500 bg-green-100 text-green-800";
      }
    }

    return "border-slate-300 bg-white text-slate-700 hover:border-cyan-400 hover:bg-cyan-50";
  };


  /* =====================================================
     VOLVER
  ===================================================== */

  const volverPaciente = () => {
    window.location.href =
      `/pacientes/${pacienteId}`;
  };


  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-7xl mx-auto">

        <button
          type="button"
          onClick={volverPaciente}
          className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
        >
          ← Volver al paciente
        </button>


        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mt-5">


          {/* =================================================
              ENCABEZADO
          ================================================= */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-slate-900">
              🦷 Odontograma
            </h1>

            <p className="text-slate-500 mt-2">
              Selecciona una pieza dental para registrar
              su estado, procedimiento, superficies y observaciones.
            </p>

          </div>


          {/* =================================================
              ARCADA SUPERIOR
          ================================================= */}

          <div className="text-center mb-4">

            <p className="text-sm font-semibold text-slate-700">
              Arcada superior
            </p>

            <p className="text-xs text-slate-400">
              Maxilar
            </p>

          </div>


          <div className="overflow-x-auto">

            <div className="min-w-[850px]">

              <div className="flex justify-center gap-2">

                {dientesSuperiores.map(
                  (diente) => (

                    <button
                      key={diente}
                      type="button"
                      onClick={() =>
                        seleccionarDiente(
                          diente
                        )
                      }
                      className={`
                        relative
                        w-12
                        h-14
                        rounded-xl
                        border-2
                        font-bold
                        text-sm
                        transition-all
                        ${obtenerClaseDiente(
                          diente
                        )}
                      `}
                    >

                      {diente}

                      {odontograma[
                        diente
                      ] && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-500" />
                      )}

                    </button>

                  )
                )}

              </div>


              <div className="flex items-center gap-4 my-10">

                <div className="flex-1 border-t border-slate-200" />

                <span className="text-xs text-slate-400">
                  Línea media
                </span>

                <div className="flex-1 border-t border-slate-200" />

              </div>


              {/* =================================================
                  ARCADA INFERIOR
              ================================================= */}

              <div className="text-center mb-4">

                <p className="text-sm font-semibold text-slate-700">
                  Arcada inferior
                </p>

                <p className="text-xs text-slate-400">
                  Mandíbula
                </p>

              </div>


              <div className="flex justify-center gap-2">

                {dientesInferiores.map(
                  (diente) => (

                    <button
                      key={diente}
                      type="button"
                      onClick={() =>
                        seleccionarDiente(
                          diente
                        )
                      }
                      className={`
                        relative
                        w-12
                        h-14
                        rounded-xl
                        border-2
                        font-bold
                        text-sm
                        transition-all
                        ${obtenerClaseDiente(
                          diente
                        )}
                      `}
                    >

                      {diente}

                      {odontograma[
                        diente
                      ] && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-500" />
                      )}

                    </button>

                  )
                )}

              </div>

            </div>

          </div>


          {/* =================================================
              LEYENDA
          ================================================= */}

          <div className="mt-8 border-t border-slate-200 pt-6">

            <h3 className="text-sm font-bold text-slate-800 mb-4">
              Leyenda
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              {[
                [
                  "Sano",
                  "border-slate-300 bg-white",
                ],
                [
                  "Caries",
                  "border-red-500 bg-red-100",
                ],
                [
                  "Restaurado",
                  "border-blue-500 bg-blue-100",
                ],
                [
                  "Fracturado",
                  "border-orange-500 bg-orange-100",
                ],
                [
                  "Endodoncia",
                  "border-purple-500 bg-purple-100",
                ],
                [
                  "Corona",
                  "border-yellow-500 bg-yellow-100",
                ],
                [
                  "Implante",
                  "border-green-500 bg-green-100",
                ],
                [
                  "Ausente",
                  "border-slate-600 bg-slate-300",
                ],
              ].map(
                ([nombre, clase]) => (

                  <div
                    key={nombre}
                    className="flex items-center gap-2 bg-slate-50 rounded-xl p-3"
                  >

                    <span
                      className={`w-5 h-5 rounded-md border-2 ${clase}`}
                    />

                    <span className="text-sm text-slate-700">
                      {nombre}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>


          {/* =================================================
              PANEL DEL DIENTE
          ================================================= */}

          {dienteSeleccionado ? (

            <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Diente seleccionado
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                🦷 Pieza{" "}
                {dienteSeleccionado}
              </h2>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">


                {/* ESTADO */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Estado del diente
                  </label>

                  <select
                    value={estadoDiente}
                    onChange={(e) =>
                      setEstadoDiente(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  >

                    <option>
                      Sano
                    </option>

                    <option>
                      Caries
                    </option>

                    <option>
                      Restaurado
                    </option>

                    <option>
                      Fracturado
                    </option>

                    <option>
                      Ausente
                    </option>

                    <option>
                      Endodoncia
                    </option>

                    <option>
                      Corona
                    </option>

                    <option>
                      Implante
                    </option>

                  </select>

                </div>


                {/* PROCEDIMIENTO */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Procedimiento
                  </label>

                  <select
                    value={
                      procedimientoDiente
                    }
                    onChange={(e) =>
                      setProcedimientoDiente(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  >

                    <option value="">
                      Seleccionar procedimiento
                    </option>

                    <option>
                      Valoración
                    </option>

                    <option>
                      Limpieza
                    </option>

                    <option>
                      Restauración
                    </option>

                    <option>
                      Endodoncia
                    </option>

                    <option>
                      Extracción
                    </option>

                    <option>
                      Corona
                    </option>

                    <option>
                      Implante
                    </option>

                    <option>
                      Blanqueamiento
                    </option>

                  </select>

                </div>


                {/* SUPERFICIES */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Superficies afectadas
                  </label>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

                    {superficies.map(
                      (superficie) => {

                        const seleccionada =
                          superficiesDiente.includes(
                            superficie
                          );

                        return (

                          <button
                            key={superficie}
                            type="button"
                            onClick={() =>
                              cambiarSuperficie(
                                superficie
                              )
                            }
                            className={`
                              px-4
                              py-3
                              rounded-xl
                              border-2
                              text-sm
                              font-semibold
                              transition
                              ${
                                seleccionada
                                  ? "border-cyan-500 bg-cyan-100 text-cyan-800"
                                  : "border-slate-300 bg-white text-slate-700 hover:border-cyan-400"
                              }
                            `}
                          >
                            {superficie}
                          </button>

                        );
                      }
                    )}

                  </div>

                </div>


                {/* OBSERVACIÓN */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Observación
                  </label>

                  <textarea
                    value={
                      observacionDiente
                    }
                    onChange={(e) =>
                      setObservacionDiente(
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Describe el hallazgo..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400"
                  />

                </div>

              </div>


              {/* RESUMEN */}

              <div className="mt-6 bg-slate-50 rounded-xl p-4">

                <p className="text-xs text-slate-500">
                  Resumen
                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1">

                  Pieza{" "}
                  {dienteSeleccionado}

                  {" · "}

                  {estadoDiente}

                  {procedimientoDiente && (
                    <>
                      {" · "}
                      {procedimientoDiente}
                    </>
                  )}

                  {superficiesDiente.length >
                    0 && (
                    <>
                      {" · "}
                      {superficiesDiente.join(
                        ", "
                      )}
                    </>
                  )}

                </p>

              </div>


              {/* GUARDAR */}

              <div className="mt-6 flex justify-end">

                <button
                  type="button"
                  onClick={
                    guardarInformacion
                  }
                  className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition"
                >
                  💾 Guardar información
                </button>

              </div>


              {mensaje && (

                <div className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">
                  {mensaje}
                </div>

              )}

            </div>

          ) : (

            <div className="mt-10 bg-slate-50 rounded-xl p-5">

              <p className="text-sm text-slate-500 text-center">
                Selecciona cualquier pieza dental para comenzar.
              </p>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}