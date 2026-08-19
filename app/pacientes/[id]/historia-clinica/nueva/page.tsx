"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Paciente = {
  id: string;
  tipoDocumento: string;
  documento: string;
  nombres: string;
  apellidos: string;
};

type Medicamento = {
  id: string;
  nombre: string;
  dosis: string;
  frecuencia: string;
  observaciones: string;
};

type Alergia = {
  id: string;
  sustancia: string;
  reaccion: string;
  observaciones: string;
};

type ConsultaClinica = {
  id: string;
  pacienteId: string;
  fecha: string;
  motivoConsulta: string;
  descripcionMotivo: string;

  diabetes: string;
  hipertension: string;
  enfermedadCardiaca: string;
  asma: string;
  problemasCoagulacion: string;
  enfermedadRenal: string;
  enfermedadHepatica: string;

  tieneAlergias: string;
  alergias: Alergia[];

  medicamentos: Medicamento[];

  ultimaVisitaOdontologo: string;
  frecuenciaVisitas: string;

  extracciones: string;
  dientesExtraidos: string;

  endodoncias: string;
  dientesEndodoncia: string;

  restauraciones: string;
  dientesRestauraciones: string;

  ortodoncia: string;
  detalleOrtodoncia: string;

  protesis: string;
  detalleProtesis: string;

  implantes: string;
  detalleImplantes: string;

  cirugiaOral: string;
  detalleCirugiaOral: string;

  experienciaNegativa: string;
  detalleExperienciaNegativa: string;

  reaccionAnestesia: string;
  detalleReaccionAnestesia: string;

  observacionesOdontologicas: string;

  otrosAntecedentes: string;
  observaciones: string;
};

export default function NuevaConsultaClinica() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const [formulario, setFormulario] = useState({
    fecha: new Date().toISOString().split("T")[0],
    motivoConsulta: "",
    descripcionMotivo: "",
    cepillado: "",
hiloDental: "",
enjuagueBucal: "",

tabaco: "",
cigarrillosPorDia: "",

alcohol: "",

morderUnas: "",
bruxismo: "",
morderObjetos: "",
respiracionBucal: "",
consumoAzucar: "",

cafe: "",
gaseosas: "",
bebidasEnergeticas: "",
dulces: "",
labios: "",
mejillas: "",
lengua: "",
paladar: "",
encias: "",
mucosaOral: "",

cariesVisibles: "",
fracturas: "",
desgasteDental: "",
movilidadDental: "",
restauracionesExistentes: "",
ausenciaDientes: "",
sensibilidadDental: "",

sangradoGingival: "",
inflamacionGingival: "",
retraccionGingival: "",
placaBacteriana: "",
calculoDental: "",

observacionesExamen: "",

    diabetes: "",
    hipertension: "",
    enfermedadCardiaca: "",
    asma: "",
    problemasCoagulacion: "",
    enfermedadRenal: "",
    enfermedadHepatica: "",

    tieneAlergias: "",

    ultimaVisitaOdontologo: "",
    frecuenciaVisitas: "",

    extracciones: "",
    dientesExtraidos: "",

    endodoncias: "",
    dientesEndodoncia: "",

    restauraciones: "",
    dientesRestauraciones: "",

    ortodoncia: "",
    detalleOrtodoncia: "",

    protesis: "",
    detalleProtesis: "",

    implantes: "",
    detalleImplantes: "",

    cirugiaOral: "",
    detalleCirugiaOral: "",

    experienciaNegativa: "",
    detalleExperienciaNegativa: "",

    reaccionAnestesia: "",
    detalleReaccionAnestesia: "",

    observacionesOdontologicas: "",

    otrosAntecedentes: "",
    observaciones: "",
  });

  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [alergias, setAlergias] = useState<Alergia[]>([]);

  const [nuevoMedicamento, setNuevoMedicamento] =
    useState({
      nombre: "",
      dosis: "",
      frecuencia: "",
      observaciones: "",
    });

  const [nuevaAlergia, setNuevaAlergia] =
    useState({
      sustancia: "",
      reaccion: "",
      observaciones: "",
    });

  useEffect(() => {
    const datosGuardados = localStorage.getItem(
      "dentalSystemPacientes"
    );

    if (datosGuardados) {
      try {
        const pacientes: Paciente[] =
          JSON.parse(datosGuardados);

        const pacienteEncontrado = pacientes.find(
          (item) => item.id === id
        );

        setPaciente(pacienteEncontrado || null);
      } catch {
        setPaciente(null);
      }
    }

    setCargando(false);
  }, [id]);

  function manejarCambio(
    evento: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function agregarMedicamento() {
    if (!nuevoMedicamento.nombre.trim()) {
      setMensaje(
        "Escribe el nombre del medicamento antes de agregarlo."
      );
      return;
    }

    const medicamento: Medicamento = {
      id: crypto.randomUUID(),
      nombre: nuevoMedicamento.nombre.trim(),
      dosis: nuevoMedicamento.dosis.trim(),
      frecuencia: nuevoMedicamento.frecuencia.trim(),
      observaciones:
        nuevoMedicamento.observaciones.trim(),
    };

    setMedicamentos((anteriores) => [
      ...anteriores,
      medicamento,
    ]);

    setNuevoMedicamento({
      nombre: "",
      dosis: "",
      frecuencia: "",
      observaciones: "",
    });

    setMensaje("");
  }

  function eliminarMedicamento(idMedicamento: string) {
    setMedicamentos((anteriores) =>
      anteriores.filter(
        (medicamento) =>
          medicamento.id !== idMedicamento
      )
    );
  }

  function agregarAlergia() {
    if (!nuevaAlergia.sustancia.trim()) {
      setMensaje(
        "Escribe la sustancia o medicamento al que el paciente es alérgico."
      );
      return;
    }

    const alergia: Alergia = {
      id: crypto.randomUUID(),
      sustancia: nuevaAlergia.sustancia.trim(),
      reaccion: nuevaAlergia.reaccion.trim(),
      observaciones:
        nuevaAlergia.observaciones.trim(),
    };

    setAlergias((anteriores) => [
      ...anteriores,
      alergia,
    ]);

    setNuevaAlergia({
      sustancia: "",
      reaccion: "",
      observaciones: "",
    });

    setMensaje("");
  }

  function eliminarAlergia(idAlergia: string) {
    setAlergias((anteriores) =>
      anteriores.filter(
        (alergia) => alergia.id !== idAlergia
      )
    );
  }

  function guardarConsulta() {
    if (
      !formulario.fecha ||
      !formulario.motivoConsulta
    ) {
      setMensaje(
        "La fecha y el motivo de consulta son obligatorios."
      );
      return;
    }

    if (
      formulario.tieneAlergias === "Si" &&
      alergias.length === 0
    ) {
      setMensaje(
        "Indicaste que el paciente tiene alergias. Agrega al menos una alergia."
      );
      return;
    }

    const consultasGuardadas = localStorage.getItem(
      "dentalSystemHistoriasClinicas"
    );

    const consultas: ConsultaClinica[] =
      consultasGuardadas
        ? JSON.parse(consultasGuardadas)
        : [];

    const nuevaConsulta: ConsultaClinica = {
      id: crypto.randomUUID(),
      pacienteId: id,

      fecha: formulario.fecha,
      motivoConsulta: formulario.motivoConsulta,
      descripcionMotivo:
        formulario.descripcionMotivo,

      diabetes: formulario.diabetes,
      hipertension: formulario.hipertension,
      enfermedadCardiaca:
        formulario.enfermedadCardiaca,
      asma: formulario.asma,
      problemasCoagulacion:
        formulario.problemasCoagulacion,
      enfermedadRenal:
        formulario.enfermedadRenal,
      enfermedadHepatica:
        formulario.enfermedadHepatica,

      tieneAlergias:
        formulario.tieneAlergias,

      alergias,
      medicamentos,

      ultimaVisitaOdontologo:
        formulario.ultimaVisitaOdontologo,

      frecuenciaVisitas:
        formulario.frecuenciaVisitas,

      extracciones:
        formulario.extracciones,

      dientesExtraidos:
        formulario.dientesExtraidos,

      endodoncias:
        formulario.endodoncias,

      dientesEndodoncia:
        formulario.dientesEndodoncia,

      restauraciones:
        formulario.restauraciones,

      dientesRestauraciones:
        formulario.dientesRestauraciones,

      ortodoncia:
        formulario.ortodoncia,

      detalleOrtodoncia:
        formulario.detalleOrtodoncia,

      protesis:
        formulario.protesis,

      detalleProtesis:
        formulario.detalleProtesis,

      implantes:
        formulario.implantes,

      detalleImplantes:
        formulario.detalleImplantes,

      cirugiaOral:
        formulario.cirugiaOral,

      detalleCirugiaOral:
        formulario.detalleCirugiaOral,

      experienciaNegativa:
        formulario.experienciaNegativa,

      detalleExperienciaNegativa:
        formulario.detalleExperienciaNegativa,

      reaccionAnestesia:
        formulario.reaccionAnestesia,

      detalleReaccionAnestesia:
        formulario.detalleReaccionAnestesia,

      observacionesOdontologicas:
        formulario.observacionesOdontologicas,
        labios: formulario.labios,
mejillas: formulario.mejillas,
lengua: formulario.lengua,
paladar: formulario.paladar,
encias: formulario.encias,
mucosaOral: formulario.mucosaOral,

cariesVisibles: formulario.cariesVisibles,
fracturas: formulario.fracturas,
desgasteDental: formulario.desgasteDental,
movilidadDental: formulario.movilidadDental,
restauracionesExistentes:
  formulario.restauracionesExistentes,
ausenciaDientes: formulario.ausenciaDientes,
sensibilidadDental:
  formulario.sensibilidadDental,

sangradoGingival:
  formulario.sangradoGingival,
inflamacionGingival:
  formulario.inflamacionGingival,
retraccionGingival:
  formulario.retraccionGingival,
placaBacteriana:
  formulario.placaBacteriana,
calculoDental:
  formulario.calculoDental,

observacionesExamen:
  formulario.observacionesExamen,

      otrosAntecedentes:
        formulario.otrosAntecedentes,

      observaciones:
        formulario.observaciones,
    };

    localStorage.setItem(
      "dentalSystemHistoriasClinicas",
      JSON.stringify([
        ...consultas,
        nuevaConsulta,
      ])
    );

    router.push(
      `/pacientes/${id}/historia-clinica`
    );
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">

        <div className="text-center">

          <div className="text-4xl mb-3">
            🦷
          </div>

          <p className="text-slate-500">
            Cargando información...
          </p>

        </div>

      </main>
    );
  }

  if (!paciente) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-8">

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center max-w-md">

          <div className="text-5xl mb-4">
            🔍
          </div>

          <h1 className="text-2xl font-bold">
            Paciente no encontrado
          </h1>

          <p className="text-slate-500 mt-2">
            No encontramos el paciente asociado a esta consulta.
          </p>

          <Link
            href="/pacientes"
            className="inline-block mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-3 rounded-xl"
          >
            ← Volver a pacientes
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">

      <div className="p-8">

        {/* ENCABEZADO */}

        <div className="mb-8">

          <Link
            href={`/pacientes/${id}/historia-clinica`}
            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
          >
            ← Volver a historia clínica
          </Link>

          <div className="mt-4">

            <h1 className="text-3xl font-bold">
              Nueva consulta clínica
            </h1>

            <p className="text-slate-500 mt-1">
              Registra una nueva atención para{" "}
              <span className="font-medium text-slate-700">
                {paciente.nombres} {paciente.apellidos}
              </span>
            </p>

          </div>

        </div>


        {/* MENSAJE */}

        {mensaje && (
          <div className="max-w-5xl mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {mensaje}
          </div>
        )}


        <div className="max-w-5xl">

          {/* DATOS DE CONSULTA */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <div className="mb-6">

              <h2 className="text-xl font-bold">
                Datos de la consulta
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Información básica de esta atención.
              </p>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Fecha de consulta *
                </label>

                <input
                  type="date"
                  name="fecha"
                  value={formulario.fecha}
                  onChange={manejarCambio}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />

              </div>


              <div>

                <label className="block text-sm font-medium mb-2">
                  Motivo de consulta *
                </label>

                <select
                  name="motivoConsulta"
                  value={formulario.motivoConsulta}
                  onChange={manejarCambio}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >

                  <option value="">
                    Selecciona el motivo
                  </option>

                  <option value="Dolor dental">
                    Dolor dental
                  </option>

                  <option value="Limpieza">
                    Limpieza
                  </option>

                  <option value="Revisión general">
                    Revisión general
                  </option>

                  <option value="Caries">
                    Caries
                  </option>

                  <option value="Fractura dental">
                    Fractura dental
                  </option>

                  <option value="Ortodoncia">
                    Ortodoncia
                  </option>

                  <option value="Estética dental">
                    Estética dental
                  </option>

                  <option value="Implantes">
                    Implantes
                  </option>

                  <option value="Prótesis">
                    Prótesis
                  </option>

                  <option value="Otro">
                    Otro
                  </option>

                </select>

              </div>

            </div>


            <div className="mt-5">

              <label className="block text-sm font-medium mb-2">
                Descripción del motivo
              </label>

              <textarea
                name="descripcionMotivo"
                value={formulario.descripcionMotivo}
                onChange={manejarCambio}
                rows={4}
                placeholder="Describe con mayor detalle el motivo de consulta..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />

            </div>

          </section>


          {/* ANTECEDENTES MÉDICOS */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <div className="mb-6">

              <h2 className="text-xl font-bold">
                Antecedentes médicos
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Información relevante para la atención odontológica.
              </p>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {[
                ["diabetes", "Diabetes"],
                ["hipertension", "Hipertensión"],
                [
                  "enfermedadCardiaca",
                  "Enfermedad cardíaca",
                ],
                ["asma", "Asma"],
                [
                  "problemasCoagulacion",
                  "Problemas de coagulación",
                ],
                ["enfermedadRenal", "Enfermedad renal"],
                [
                  "enfermedadHepatica",
                  "Enfermedad hepática",
                ],
              ].map(([nombre, etiqueta]) => (

                <div key={nombre}>

                  <label className="block text-sm font-medium mb-2">
                    {etiqueta}
                  </label>

                  <select
                    name={nombre}
                    value={
                      formulario[
                        nombre as keyof typeof formulario
                      ]
                    }
                    onChange={manejarCambio}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  >

                    <option value="">
                      No especificado
                    </option>

                    <option value="Si">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                    <option value="No sabe">
                      No sabe
                    </option>

                  </select>

                </div>

              ))}

            </div>


            <div className="mt-6">

              <label className="block text-sm font-medium mb-2">
                Otros antecedentes médicos
              </label>

              <textarea
                name="otrosAntecedentes"
                value={formulario.otrosAntecedentes}
                onChange={manejarCambio}
                rows={4}
                placeholder="Describe otros antecedentes médicos relevantes..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />

            </div>

          </section>


          {/* ALERGIAS */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <div className="mb-6">

              <h2 className="text-xl font-bold">
                🚨 Alergias
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Registra las alergias conocidas del paciente.
              </p>

            </div>


            <div className="max-w-md">

              <label className="block text-sm font-medium mb-2">
                ¿Tiene alergias conocidas?
              </label>

              <select
                name="tieneAlergias"
                value={formulario.tieneAlergias}
                onChange={manejarCambio}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              >

                <option value="">
                  No especificado
                </option>

                <option value="Si">
                  Sí
                </option>

                <option value="No">
                  No
                </option>

                <option value="No sabe">
                  No sabe
                </option>

              </select>

            </div>


            {formulario.tieneAlergias === "Si" && (

              <div className="mt-6">

                {alergias.length > 0 && (

                  <div className="space-y-3 mb-6">

                    {alergias.map((alergia) => (

                      <div
                        key={alergia.id}
                        className="border border-red-200 bg-red-50 rounded-xl p-5"
                      >

                        <div className="flex justify-between gap-4">

                          <div>

                            <p className="font-bold text-red-800">
                              {alergia.sustancia}
                            </p>

                            {alergia.reaccion && (
                              <p className="text-sm mt-1">
                                <strong>
                                  Reacción:
                                </strong>{" "}
                                {alergia.reaccion}
                              </p>
                            )}

                            {alergia.observaciones && (
                              <p className="text-sm mt-1">
                                <strong>
                                  Observaciones:
                                </strong>{" "}
                                {alergia.observaciones}
                              </p>
                            )}

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              eliminarAlergia(
                                alergia.id
                              )
                            }
                            className="text-red-600 hover:text-red-800 text-sm font-semibold"
                          >
                            Eliminar
                          </button>

                        </div>

                      </div>

                    ))}

                  </div>

                )}


                <div className="border border-slate-200 rounded-xl p-5">

                  <h3 className="font-semibold mb-4">
                    Agregar alergia
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                      type="text"
                      placeholder="Sustancia o medicamento *"
                      value={nuevaAlergia.sustancia}
                      onChange={(e) =>
                        setNuevaAlergia({
                          ...nuevaAlergia,
                          sustancia: e.target.value,
                        })
                      }
                      className="border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                    />

                    <input
                      type="text"
                      placeholder="Reacción"
                      value={nuevaAlergia.reaccion}
                      onChange={(e) =>
                        setNuevaAlergia({
                          ...nuevaAlergia,
                          reaccion: e.target.value,
                        })
                      }
                      className="border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                    />

                  </div>

                  <textarea
                    placeholder="Observaciones sobre la alergia..."
                    value={nuevaAlergia.observaciones}
                    onChange={(e) =>
                      setNuevaAlergia({
                        ...nuevaAlergia,
                        observaciones: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full mt-4 border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-500"
                  />

                  <button
                    type="button"
                    onClick={agregarAlergia}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-xl"
                  >
                    + Agregar alergia
                  </button>

                </div>

              </div>

            )}

          </section>


          {/* MEDICAMENTOS */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <div className="mb-6">

              <h2 className="text-xl font-bold">
                💊 Medicamentos actuales
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Registra los medicamentos que utiliza actualmente el paciente.
              </p>

            </div>


            {medicamentos.length > 0 && (

              <div className="space-y-3 mb-6">

                {medicamentos.map((medicamento) => (

                  <div
                    key={medicamento.id}
                    className="border border-blue-200 bg-blue-50 rounded-xl p-5"
                  >

                    <div className="flex justify-between gap-4">

                      <div>

                        <p className="font-bold text-blue-800">
                          {medicamento.nombre}
                        </p>

                        <div className="text-sm text-slate-700 mt-2 space-y-1">

                          {medicamento.dosis && (
                            <p>
                              <strong>Dosis:</strong>{" "}
                              {medicamento.dosis}
                            </p>
                          )}

                          {medicamento.frecuencia && (
                            <p>
                              <strong>Frecuencia:</strong>{" "}
                              {medicamento.frecuencia}
                            </p>
                          )}

                          {medicamento.observaciones && (
                            <p>
                              <strong>Observaciones:</strong>{" "}
                              {medicamento.observaciones}
                            </p>
                          )}

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarMedicamento(
                            medicamento.id
                          )
                        }
                        className="text-red-600 hover:text-red-800 text-sm font-semibold"
                      >
                        Eliminar
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}


            <div className="border border-slate-200 rounded-xl p-5">

              <h3 className="font-semibold mb-4">
                Agregar medicamento
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  type="text"
                  placeholder="Nombre del medicamento *"
                  value={nuevoMedicamento.nombre}
                  onChange={(e) =>
                    setNuevoMedicamento({
                      ...nuevoMedicamento,
                      nombre: e.target.value,
                    })
                  }
                  className="border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                />

                <input
                  type="text"
                  placeholder="Dosis. Ej: 500 mg"
                  value={nuevoMedicamento.dosis}
                  onChange={(e) =>
                    setNuevoMedicamento({
                      ...nuevoMedicamento,
                      dosis: e.target.value,
                    })
                  }
                  className="border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                />

                <input
                  type="text"
                  placeholder="Frecuencia. Ej: Cada 8 horas"
                  value={nuevoMedicamento.frecuencia}
                  onChange={(e) =>
                    setNuevoMedicamento({
                      ...nuevoMedicamento,
                      frecuencia: e.target.value,
                    })
                  }
                  className="border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                />

              </div>

              <textarea
                placeholder="Observaciones sobre el medicamento..."
                value={nuevoMedicamento.observaciones}
                onChange={(e) =>
                  setNuevoMedicamento({
                    ...nuevoMedicamento,
                    observaciones: e.target.value,
                  })
                }
                rows={3}
                className="w-full mt-4 border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-500"
              />

              <button
                type="button"
                onClick={agregarMedicamento}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl"
              >
                + Agregar medicamento
              </button>

            </div>

          </section>
{/* ================================= */}
{/* HÁBITOS DEL PACIENTE */}
{/* ================================= */}

<section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

  <div className="mb-7">

    <h2 className="text-xl font-bold">
      🪥 Hábitos del paciente
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      Registra hábitos que pueden influir en la salud oral del paciente.
    </p>

  </div>


  {/* HIGIENE ORAL */}

  <div>

    <h3 className="font-semibold text-lg mb-4">
      🪥 Higiene oral
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

      <div>

        <label className="block text-sm font-medium mb-2">
          Frecuencia de cepillado
        </label>

        <select
          name="cepillado"
          value={formulario.cepillado}
          onChange={manejarCambio}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
        >

          <option value="">
            Selecciona
          </option>

          <option value="1 vez al día">
            1 vez al día
          </option>

          <option value="2 veces al día">
            2 veces al día
          </option>

          <option value="3 o más veces al día">
            3 o más veces al día
          </option>

          <option value="Irregular">
            Irregular
          </option>

        </select>

      </div>


      <div>

        <label className="block text-sm font-medium mb-2">
          ¿Usa hilo dental?
        </label>

        <select
          name="hiloDental"
          value={formulario.hiloDental}
          onChange={manejarCambio}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
        >

          <option value="">
            Selecciona
          </option>

          <option value="Sí">
            Sí
          </option>

          <option value="No">
            No
          </option>

          <option value="Ocasionalmente">
            Ocasionalmente
          </option>

        </select>

      </div>


      <div>

        <label className="block text-sm font-medium mb-2">
          ¿Usa enjuague bucal?
        </label>

        <select
          name="enjuagueBucal"
          value={formulario.enjuagueBucal}
          onChange={manejarCambio}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
        >

          <option value="">
            Selecciona
          </option>

          <option value="Sí">
            Sí
          </option>

          <option value="No">
            No
          </option>

          <option value="Ocasionalmente">
            Ocasionalmente
          </option>

        </select>

      </div>

    </div>

  </div>


  {/* TABACO Y ALCOHOL */}

  <div className="border-t border-slate-100 pt-6 mt-7">

    <h3 className="font-semibold text-lg mb-4">
      🚬 Consumo de tabaco y alcohol
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      <div>

        <label className="block text-sm font-medium mb-2">
          Consumo de tabaco
        </label>

        <select
          name="tabaco"
          value={formulario.tabaco}
          onChange={manejarCambio}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
        >

          <option value="">
            Selecciona
          </option>

          <option value="No fuma">
            No fuma
          </option>

          <option value="Fumador ocasional">
            Fumador ocasional
          </option>

          <option value="Fumador habitual">
            Fumador habitual
          </option>

          <option value="Exfumador">
            Exfumador
          </option>

        </select>

      </div>


      <div>

        <label className="block text-sm font-medium mb-2">
          Consumo de alcohol
        </label>

        <select
          name="alcohol"
          value={formulario.alcohol}
          onChange={manejarCambio}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
        >

          <option value="">
            Selecciona
          </option>

          <option value="No consume">
            No consume
          </option>

          <option value="Ocasional">
            Ocasional
          </option>

          <option value="Frecuente">
            Frecuente
          </option>

        </select>

      </div>

    </div>


    {(
      formulario.tabaco === "Fumador ocasional" ||
      formulario.tabaco === "Fumador habitual"
    ) && (

      <div className="mt-5 max-w-md">

        <label className="block text-sm font-medium mb-2">
          Cigarrillos por día
        </label>

        <input
          type="number"
          min="0"
          name="cigarrillosPorDia"
          value={formulario.cigarrillosPorDia}
          onChange={manejarCambio}
          placeholder="Ej: 5"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
        />

      </div>

    )}

  </div>


  {/* HÁBITOS ORALES */}

  <div className="border-t border-slate-100 pt-6 mt-7">

    <h3 className="font-semibold text-lg mb-4">
      🦷 Hábitos orales
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {[
        ["morderUnas", "¿Se muerde las uñas?"],
        ["bruxismo", "¿Aprieta o rechina los dientes?"],
        ["morderObjetos", "¿Muerde objetos?"],
        ["respiracionBucal", "¿Duerme con la boca abierta?"],
        ["consumoAzucar", "¿Consume frecuentemente azúcar?"],
      ].map(([nombre, etiqueta]) => (

        <div key={nombre}>

          <label className="block text-sm font-medium mb-2">
            {etiqueta}
          </label>

          <select
            name={nombre}
            value={
              formulario[
                nombre as keyof typeof formulario
              ]
            }
            onChange={manejarCambio}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
          >

            <option value="">
              No especificado
            </option>

            <option value="Sí">
              Sí
            </option>

            <option value="No">
              No
            </option>

            <option value="No sabe">
              No sabe
            </option>

          </select>

        </div>

      ))}

    </div>

  </div>


  {/* CONSUMO DE ALIMENTOS Y BEBIDAS */}

  <div className="border-t border-slate-100 pt-6 mt-7">

    <h3 className="font-semibold text-lg mb-4">
      ☕ Consumo de alimentos y bebidas
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {[
        ["cafe", "Café"],
        ["gaseosas", "Gaseosas"],
        ["bebidasEnergeticas", "Bebidas energéticas"],
        ["dulces", "Dulces"],
      ].map(([nombre, etiqueta]) => (

        <div key={nombre}>

          <label className="block text-sm font-medium mb-2">
            {etiqueta}
          </label>

          <select
            name={nombre}
            value={
              formulario[
                nombre as keyof typeof formulario
              ]
            }
            onChange={manejarCambio}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
          >

            <option value="">
              Selecciona
            </option>

            <option value="Nunca">
              Nunca
            </option>

            <option value="Ocasional">
              Ocasional
            </option>

            <option value="Frecuente">
              Frecuente
            </option>

            <option value="Diario">
              Diario
            </option>

          </select>

        </div>

      ))}

    </div>

  </div>

</section>
{/* ================================= */}
{/* EXAMEN CLÍNICO */}
{/* ================================= */}

<section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

  <div className="mb-7">

    <h2 className="text-xl font-bold">
      🩺 Examen clínico
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      Registra los hallazgos encontrados durante la evaluación clínica.
    </p>

  </div>


  {/* TEJIDOS Y ESTRUCTURAS ORALES */}

  <div>

    <h3 className="font-semibold text-lg mb-4">
      👄 Tejidos y estructuras orales
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {[
        ["labios", "Labios"],
        ["mejillas", "Mejillas"],
        ["lengua", "Lengua"],
        ["paladar", "Paladar"],
        ["encias", "Encías"],
        ["mucosaOral", "Mucosa oral"],
      ].map(([nombre, etiqueta]) => (

        <div key={nombre}>

          <label className="block text-sm font-medium mb-2">
            {etiqueta}
          </label>

          <select
            name={nombre}
            value={
              formulario[
                nombre as keyof typeof formulario
              ]
            }
            onChange={manejarCambio}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
          >

            <option value="">
              No especificado
            </option>

            <option value="Normal">
              Normal
            </option>

            <option value="Alterado">
              Alterado
            </option>

          </select>

        </div>

      ))}

    </div>

  </div>


  {/* HALLAZGOS DENTALES */}

  <div className="border-t border-slate-100 pt-6 mt-7">

    <h3 className="font-semibold text-lg mb-4">
      🦷 Hallazgos dentales
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {[
        ["cariesVisibles", "Caries visibles"],
        ["fracturas", "Fracturas dentales"],
        ["desgasteDental", "Desgaste dental"],
        ["movilidadDental", "Movilidad dental"],
        ["restauracionesExistentes", "Restauraciones existentes"],
        ["ausenciaDientes", "Ausencia de dientes"],
        ["sensibilidadDental", "Sensibilidad dental"],
      ].map(([nombre, etiqueta]) => (

        <div key={nombre}>

          <label className="block text-sm font-medium mb-2">
            {etiqueta}
          </label>

          <select
            name={nombre}
            value={
              formulario[
                nombre as keyof typeof formulario
              ]
            }
            onChange={manejarCambio}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
          >

            <option value="">
              No especificado
            </option>

            <option value="Sí">
              Sí
            </option>

            <option value="No">
              No
            </option>

            <option value="No sabe">
              No sabe
            </option>

          </select>

        </div>

      ))}

    </div>

  </div>


  {/* ENCÍAS Y PERIODONTO */}

  <div className="border-t border-slate-100 pt-6 mt-7">

    <h3 className="font-semibold text-lg mb-4">
      🩸 Encías y periodonto
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {[
        ["sangradoGingival", "Sangrado gingival"],
        ["inflamacionGingival", "Inflamación gingival"],
        ["retraccionGingival", "Retracción gingival"],
        ["placaBacteriana", "Placa bacteriana"],
        ["calculoDental", "Cálculo dental"],
      ].map(([nombre, etiqueta]) => (

        <div key={nombre}>

          <label className="block text-sm font-medium mb-2">
            {etiqueta}
          </label>

          <select
            name={nombre}
            value={
              formulario[
                nombre as keyof typeof formulario
              ]
            }
            onChange={manejarCambio}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
          >

            <option value="">
              No especificado
            </option>

            <option value="Sí">
              Sí
            </option>

            <option value="No">
              No
            </option>

            <option value="No sabe">
              No sabe
            </option>

          </select>

        </div>

      ))}

    </div>

  </div>


  {/* OBSERVACIONES */}

  <div className="border-t border-slate-100 pt-6 mt-7">

    <label className="block text-sm font-medium mb-2">
      Observaciones del examen clínico
    </label>

    <textarea
      name="observacionesExamen"
      value={formulario.observacionesExamen}
      onChange={manejarCambio}
      rows={5}
      placeholder="Describe los hallazgos clínicos relevantes..."
      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
    />

  </div>
{/* ================================= */}
{/* ODONTOGRAMA */}
{/* ================================= */}

<section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

  <div className="mb-7">

    <h2 className="text-xl font-bold">
      🦷 Odontograma
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      Selecciona un diente para consultar y registrar información.
    </p>

  </div>


  <div className="overflow-x-auto">

    {/* SUPERIOR */}

    <div className="min-w-[700px]">

      <p className="text-xs text-slate-500 text-center mb-3">
        Arcada superior
      </p>

      <div className="flex justify-center gap-2">

        {[
          18, 17, 16, 15, 14, 13, 12, 11,
          21, 22, 23, 24, 25, 26, 27, 28
        ].map((diente) => (

          <button
            key={diente}
            type="button"
            onClick={() =>
              alert(`Seleccionaste el diente ${diente}`)
            }
            className="w-10 h-12 border-2 border-slate-300 rounded-lg bg-white hover:border-cyan-500 hover:bg-cyan-50 transition font-semibold text-sm"
          >
            {diente}
          </button>

        ))}

      </div>


      <div className="border-t border-slate-200 my-8" />


      {/* INFERIOR */}

      <p className="text-xs text-slate-500 text-center mb-3">
        Arcada inferior
      </p>

      <div className="flex justify-center gap-2">

        {[
          48, 47, 46, 45, 44, 43, 42, 41,
          31, 32, 33, 34, 35, 36, 37, 38
        ].map((diente) => (

          <button
            key={diente}
            type="button"
            onClick={() =>
              alert(`Seleccionaste el diente ${diente}`)
            }
            className="w-10 h-12 border-2 border-slate-300 rounded-lg bg-white hover:border-cyan-500 hover:bg-cyan-50 transition font-semibold text-sm"
          >
            {diente}
          </button>

        ))}

      </div>

    </div>

  </div>


  <div className="mt-6 bg-slate-50 rounded-xl p-4">

    <p className="text-sm text-slate-500 text-center">
      Haz clic sobre un diente para seleccionarlo.
    </p>

  </div>

</section>
</section>
          {/* ================================= */}
          {/* ANTECEDENTES ODONTOLÓGICOS */}
          {/* ================================= */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <div className="mb-7">

              <h2 className="text-xl font-bold">
                🦷 Antecedentes odontológicos
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Registra tratamientos y experiencias odontológicas anteriores.
              </p>

            </div>


            {/* VISITAS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Última visita al odontólogo
                </label>

                <input
                  type="date"
                  name="ultimaVisitaOdontologo"
                  value={formulario.ultimaVisitaOdontologo}
                  onChange={manejarCambio}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />

              </div>


              <div>

                <label className="block text-sm font-medium mb-2">
                  Frecuencia de visitas
                </label>

                <select
                  name="frecuenciaVisitas"
                  value={formulario.frecuenciaVisitas}
                  onChange={manejarCambio}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >

                  <option value="">
                    Selecciona una opción
                  </option>

                  <option value="Cada 6 meses">
                    Cada 6 meses
                  </option>

                  <option value="Una vez al año">
                    Una vez al año
                  </option>

                  <option value="Solo cuando tengo molestias">
                    Solo cuando tengo molestias
                  </option>

                  <option value="Casi nunca">
                    Casi nunca
                  </option>

                  <option value="Otra">
                    Otra
                  </option>

                </select>

              </div>

            </div>


            {/* EXTRACCIONES */}

            <div className="border-t border-slate-100 pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    ¿Ha tenido extracciones dentales?
                  </label>

                  <select
                    name="extracciones"
                    value={formulario.extracciones}
                    onChange={manejarCambio}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                  >

                    <option value="">
                      No especificado
                    </option>

                    <option value="Si">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                    <option value="No sabe">
                      No sabe
                    </option>

                  </select>

                </div>


                {formulario.extracciones === "Si" && (

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      ¿Cuáles dientes?
                    </label>

                    <input
                      type="text"
                      name="dientesExtraidos"
                      value={formulario.dientesExtraidos}
                      onChange={manejarCambio}
                      placeholder="Ej: 18, 28, 38"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                    />

                  </div>

                )}

              </div>

            </div>


            {/* ENDODONCIAS */}

            <div className="border-t border-slate-100 pt-6 mt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    ¿Ha tenido tratamientos de conducto?
                  </label>

                  <select
                    name="endodoncias"
                    value={formulario.endodoncias}
                    onChange={manejarCambio}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                  >

                    <option value="">
                      No especificado
                    </option>

                    <option value="Si">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                    <option value="No sabe">
                      No sabe
                    </option>

                  </select>

                </div>


                {formulario.endodoncias === "Si" && (

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      ¿Cuáles dientes?
                    </label>

                    <input
                      type="text"
                      name="dientesEndodoncia"
                      value={formulario.dientesEndodoncia}
                      onChange={manejarCambio}
                      placeholder="Ej: 16, 26"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                    />

                  </div>

                )}

              </div>

            </div>


            {/* RESTAURACIONES */}

            <div className="border-t border-slate-100 pt-6 mt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    ¿Ha tenido restauraciones o empastes?
                  </label>

                  <select
                    name="restauraciones"
                    value={formulario.restauraciones}
                    onChange={manejarCambio}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                  >

                    <option value="">
                      No especificado
                    </option>

                    <option value="Si">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                    <option value="No sabe">
                      No sabe
                    </option>

                  </select>

                </div>


                {formulario.restauraciones === "Si" && (

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      ¿Cuáles dientes?
                    </label>

                    <input
                      type="text"
                      name="dientesRestauraciones"
                      value={formulario.dientesRestauraciones}
                      onChange={manejarCambio}
                      placeholder="Ej: 14, 15, 24"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                    />

                  </div>

                )}

              </div>

            </div>


            {/* ORTODONCIA */}

            <div className="border-t border-slate-100 pt-6 mt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    ¿Ha utilizado ortodoncia?
                  </label>

                  <select
                    name="ortodoncia"
                    value={formulario.ortodoncia}
                    onChange={manejarCambio}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                  >

                    <option value="">
                      No especificado
                    </option>

                    <option value="Si">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                    <option value="No sabe">
                      No sabe
                    </option>

                  </select>

                </div>


                {formulario.ortodoncia === "Si" && (

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Detalles de ortodoncia
                    </label>

                    <input
                      type="text"
                      name="detalleOrtodoncia"
                      value={formulario.detalleOrtodoncia}
                      onChange={manejarCambio}
                      placeholder="Ej: Brackets durante 2 años"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                    />

                  </div>

                )}

              </div>

            </div>


            {/* PRÓTESIS */}

            <div className="border-t border-slate-100 pt-6 mt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    ¿Tiene o ha tenido prótesis?
                  </label>

                  <select
                    name="protesis"
                    value={formulario.protesis}
                    onChange={manejarCambio}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                  >

                    <option value="">
                      No especificado
                    </option>

                    <option value="Si">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                    <option value="No sabe">
                      No sabe
                    </option>

                  </select>

                </div>


                {formulario.protesis === "Si" && (

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Detalles de la prótesis
                    </label>

                    <input
                      type="text"
                      name="detalleProtesis"
                      value={formulario.detalleProtesis}
                      onChange={manejarCambio}
                      placeholder="Ej: Prótesis parcial superior"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                    />

                  </div>

                )}

              </div>

            </div>


            {/* IMPLANTES */}

            <div className="border-t border-slate-100 pt-6 mt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    ¿Tiene implantes dentales?
                  </label>

                  <select
                    name="implantes"
                    value={formulario.implantes}
                    onChange={manejarCambio}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                  >

                    <option value="">
                      No especificado
                    </option>

                    <option value="Si">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                    <option value="No sabe">
                      No sabe
                    </option>

                  </select>

                </div>


                {formulario.implantes === "Si" && (

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Detalles de implantes
                    </label>

                    <input
                      type="text"
                      name="detalleImplantes"
                      value={formulario.detalleImplantes}
                      onChange={manejarCambio}
                      placeholder="Ej: Implante en diente 36"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                    />

                  </div>

                )}

              </div>

            </div>


            {/* CIRUGÍA ORAL */}

            <div className="border-t border-slate-100 pt-6 mt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    ¿Ha tenido cirugía oral?
                  </label>

                  <select
                    name="cirugiaOral"
                    value={formulario.cirugiaOral}
                    onChange={manejarCambio}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                  >

                    <option value="">
                      No especificado
                    </option>

                    <option value="Si">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                    <option value="No sabe">
                      No sabe
                    </option>

                  </select>

                </div>


                {formulario.cirugiaOral === "Si" && (

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Detalles de la cirugía
                    </label>

                    <input
                      type="text"
                      name="detalleCirugiaOral"
                      value={formulario.detalleCirugiaOral}
                      onChange={manejarCambio}
                      placeholder="Describe la cirugía realizada"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                    />

                  </div>

                )}

              </div>

            </div>


            {/* EXPERIENCIA NEGATIVA */}

            <div className="border-t border-slate-100 pt-6 mt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    ¿Ha tenido alguna experiencia negativa con el odontólogo?
                  </label>

                  <select
                    name="experienciaNegativa"
                    value={formulario.experienciaNegativa}
                    onChange={manejarCambio}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                  >

                    <option value="">
                      No especificado
                    </option>

                    <option value="Si">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                    <option value="No sabe">
                      No sabe
                    </option>

                  </select>

                </div>


                {formulario.experienciaNegativa === "Si" && (

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Describe la experiencia
                    </label>

                    <input
                      type="text"
                      name="detalleExperienciaNegativa"
                      value={formulario.detalleExperienciaNegativa}
                      onChange={manejarCambio}
                      placeholder="Describe brevemente la experiencia"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                    />

                  </div>

                )}

              </div>

            </div>


            {/* ANESTESIA */}

            <div className="border-t border-slate-100 pt-6 mt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    ¿Ha tenido alguna reacción a la anestesia dental?
                  </label>

                  <select
                    name="reaccionAnestesia"
                    value={formulario.reaccionAnestesia}
                    onChange={manejarCambio}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                  >

                    <option value="">
                      No especificado
                    </option>

                    <option value="Si">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                    <option value="No sabe">
                      No sabe
                    </option>

                  </select>

                </div>


                {formulario.reaccionAnestesia === "Si" && (

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Describe la reacción
                    </label>

                    <input
                      type="text"
                      name="detalleReaccionAnestesia"
                      value={formulario.detalleReaccionAnestesia}
                      onChange={manejarCambio}
                      placeholder="Describe la reacción presentada"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                    />

                  </div>

                )}

              </div>

            </div>


            {/* OBSERVACIONES ODONTOLÓGICAS */}

            <div className="border-t border-slate-100 pt-6 mt-6">

              <label className="block text-sm font-medium mb-2">
                Observaciones odontológicas
              </label>

              <textarea
                name="observacionesOdontologicas"
                value={formulario.observacionesOdontologicas}
                onChange={manejarCambio}
                rows={4}
                placeholder="Escribe cualquier información odontológica adicional..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />

            </div>

          </section>


          {/* OBSERVACIONES */}

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <h2 className="text-xl font-bold">
              Observaciones de la consulta
            </h2>

            <p className="text-sm text-slate-500 mt-1 mb-5">
              Información adicional relacionada con esta atención.
            </p>

            <textarea
              name="observaciones"
              value={formulario.observaciones}
              onChange={manejarCambio}
              rows={5}
              placeholder="Escribe aquí las observaciones de la consulta..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />

          </section>


          {/* BOTONES */}

          <div className="flex justify-end gap-3 pb-10">

            <Link
              href={`/pacientes/${id}/historia-clinica`}
              className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50"
            >
              Cancelar
            </Link>

            <button
              type="button"
              onClick={guardarConsulta}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold shadow-sm"
            >
              Guardar consulta
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}