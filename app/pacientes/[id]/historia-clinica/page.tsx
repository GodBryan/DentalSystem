"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { registrarAuditoria } from "@/lib/auditoria";

type HistoriaClinica = {
  id: string;
  pacienteId: string;
  fechaCreacion: string;
  fechaActualizacion: string;

  motivoConsulta: string;
  enfermedadActual: string;

  hipertension: boolean;
  diabetes: boolean;
  cardiopatias: boolean;
  enfermedadesRenales: boolean;
  enfermedadesHepaticas: boolean;
  enfermedadesRespiratorias: boolean;
  enfermedadesInmunologicas: boolean;
  otrasEnfermedades: string;

  cirugias: string;
  hospitalizaciones: string;

  alergias: string;
  alergiaMedicamentos: boolean;
  alergiaLatex: boolean;
  alergiaAnestesia: boolean;
  medicamentos: string;

  antecedentesOdontologicos: string;
  ultimaConsultaOdontologica: string;
  tratamientosPrevios: string;
  experienciasOdontologicas: string;

  frecuenciaCepillado: string;
  usaHiloDental: string;
  usaEnjuague: string;
  higieneOral: string;

  fuma: string;
  alcohol: string;
  bruxismo: string;
  otrosHabitos: string;

  dolor: string;
  sensibilidad: string;
  sangrado: string;
  movilidadDental: string;

  mucosas: string;
  labios: string;
  lengua: string;
  paladar: string;
  pisoBoca: string;
  encias: string;

  higieneClinica: string;
  placaBacteriana: string;
  calculoDental: string;
  caries: string;

  atm: string;
  oclusion: string;

  examenClinico: string;
  diagnostico: string;
  planTratamiento: string;
  observaciones: string;

  consentimientoInformado: string;
};

const crearHistoriaVacia = (
  pacienteId: string
): HistoriaClinica => ({
  id: crypto.randomUUID(),
  pacienteId,
  fechaCreacion: new Date().toLocaleString("es-CO"),
  fechaActualizacion: "",

  motivoConsulta: "",
  enfermedadActual: "",

  hipertension: false,
  diabetes: false,
  cardiopatias: false,
  enfermedadesRenales: false,
  enfermedadesHepaticas: false,
  enfermedadesRespiratorias: false,
  enfermedadesInmunologicas: false,
  otrasEnfermedades: "",

  cirugias: "",
  hospitalizaciones: "",

  alergias: "",
  alergiaMedicamentos: false,
  alergiaLatex: false,
  alergiaAnestesia: false,
  medicamentos: "",

  antecedentesOdontologicos: "",
  ultimaConsultaOdontologica: "",
  tratamientosPrevios: "",
  experienciasOdontologicas: "",

  frecuenciaCepillado: "",
  usaHiloDental: "",
  usaEnjuague: "",
  higieneOral: "",

  fuma: "",
  alcohol: "",
  bruxismo: "",
  otrosHabitos: "",

  dolor: "",
  sensibilidad: "",
  sangrado: "",
  movilidadDental: "",

  mucosas: "",
  labios: "",
  lengua: "",
  paladar: "",
  pisoBoca: "",
  encias: "",

  higieneClinica: "",
  placaBacteriana: "",
  calculoDental: "",
  caries: "",

  atm: "",
  oclusion: "",

  examenClinico: "",
  diagnostico: "",
  planTratamiento: "",
  observaciones: "",

  consentimientoInformado: "",
});

export default function HistoriaClinicaPage() {
  const params = useParams();
  const pacienteId = String(params.id);

  const [historias, setHistorias] = useState<
    HistoriaClinica[]
  >([]);

  const [historiaActual, setHistoriaActual] =
    useState<HistoriaClinica | null>(null);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarHistorias();
  }, [pacienteId]);

  const cargarHistorias = () => {
    try {
      const guardado = localStorage.getItem(
        "historias-clinicas-bryan"
      );

      if (guardado) {
        const datos = JSON.parse(guardado);

        if (Array.isArray(datos)) {
          const delPaciente = datos.filter(
            (item) =>
              String(item.pacienteId) === pacienteId
          );

          setHistorias(delPaciente);
        }
      }
    } catch (error) {
      console.error(
        "Error cargando historias:",
        error
      );
    }
  };

  const nuevaConsulta = () => {
    setHistoriaActual(
      crearHistoriaVacia(pacienteId)
    );

    setMensaje("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const abrirHistoria = (
    historia: HistoriaClinica
  ) => {
    setHistoriaActual({
      ...historia,
    });

    setMostrarFormulario(true);

    setMensaje("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cambiarCampo = <
    K extends keyof HistoriaClinica
  >(
    campo: K,
    valor: HistoriaClinica[K]
  ) => {
    if (!historiaActual) return;

    setHistoriaActual({
      ...historiaActual,
      [campo]: valor,
    });

    setMensaje("");
  };

  const guardarHistoria = () => {
    if (!historiaActual) return;

    const actualizada: HistoriaClinica = {
      ...historiaActual,
      pacienteId,
      fechaActualizacion:
        new Date().toLocaleString("es-CO"),
    };

    let todas: HistoriaClinica[] = [];

    try {
      const guardado = localStorage.getItem(
        "historias-clinicas-bryan"
      );

      todas = guardado
        ? JSON.parse(guardado)
        : [];

      if (!Array.isArray(todas)) {
        todas = [];
      }
    } catch {
      todas = [];
    }

    const existe = todas.some(
      (item) => item.id === actualizada.id
    );

    let nuevasHistorias: HistoriaClinica[];

    if (existe) {
      nuevasHistorias = todas.map((item) =>
        item.id === actualizada.id
          ? actualizada
          : item
      );
    } else {
      nuevasHistorias = [
        ...todas,
        actualizada,
      ];
    }

    localStorage.setItem(
      "historias-clinicas-bryan",
      JSON.stringify(nuevasHistorias)
    );

    /*
      Compatibilidad con el sistema anterior.
      Guardamos también el último registro.
    */

    localStorage.setItem(
      "historia-clinica-bryan",
      JSON.stringify(actualizada)
    );

    const nombrePaciente = (() => {
      try {
        const pacientesRaw = localStorage.getItem("dentalSystemPacientes");
        if (!pacientesRaw) return undefined;

        const pacientes = JSON.parse(pacientesRaw);

        if (!Array.isArray(pacientes)) return undefined;

        const paciente = pacientes.find(
          (item) => String(item.id) === pacienteId
        );

        return paciente
          ? `${paciente.nombres || ""} ${paciente.apellidos || ""}`.trim()
          : undefined;
      } catch {
        return undefined;
      }
    })();

    registrarAuditoria({
      accion: existe ? "EDITAR_HISTORIA" : "CREAR_HISTORIA",
      modulo: "Historia clínica",
      descripcion: existe
        ? "Actualizó una consulta de la historia clínica."
        : "Creó una nueva consulta en la historia clínica.",
      pacienteId,
      pacienteNombre: nombrePaciente,
      referenciaId: actualizada.id,
    });

    const delPaciente =
      nuevasHistorias.filter(
        (item) =>
          String(item.pacienteId) ===
          pacienteId
      );

    setHistorias(delPaciente);
    setHistoriaActual(actualizada);

    setMensaje(
      existe
        ? "✓ Consulta actualizada correctamente."
        : "✓ Nueva consulta guardada correctamente."
    );

    setMostrarFormulario(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const imprimirHistoria = (
    historia?: HistoriaClinica
  ) => {
    if (historia) {
      setHistoriaActual({
        ...historia,
      });

      setTimeout(() => {
        window.print();
      }, 100);
    } else {
      window.print();
    }
  };

  const volver = () => {
    window.location.href =
      `/pacientes/${pacienteId}`;
  };

  return (
    <>
      <main className="min-h-screen bg-slate-50 p-6">

        <div className="max-w-7xl mx-auto">

          <button
            type="button"
            onClick={volver}
            className="text-cyan-600 hover:text-cyan-800 text-sm font-medium no-print"
          >
            ← Volver al paciente
          </button>


          {/* =================================================
              ENCABEZADO
          ================================================= */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mt-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl bg-cyan-50 flex items-center justify-center text-3xl">
                  📋
                </div>

                <div>

                  <h1 className="text-3xl font-bold text-slate-900">
                    Historia clínica
                  </h1>

                  <p className="text-slate-500 mt-1">
                    Historial de consultas y evoluciones del paciente.
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={nuevaConsulta}
                className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition no-print"
              >
                + Nueva consulta
              </button>

            </div>

          </div>


          {/* =================================================
              HISTORIAL
          ================================================= */}

          {!mostrarFormulario && (

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mt-5">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Historial clínico
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Cada atención queda almacenada como un registro independiente.
                  </p>

                </div>

                <span className="px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-semibold">
                  {historias.length} consulta
                  {historias.length !== 1
                    ? "s"
                    : ""}
                </span>

              </div>


              {historias.length === 0 ? (

                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">

                  <div className="text-5xl mb-4">
                    📋
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg">
                    No hay consultas registradas
                  </h3>

                  <p className="text-slate-500 text-sm mt-2">
                    Crea la primera consulta del paciente.
                  </p>

                  <button
                    type="button"
                    onClick={nuevaConsulta}
                    className="mt-5 px-5 py-3 rounded-xl bg-cyan-500 text-white font-semibold no-print"
                  >
                    + Crear primera consulta
                  </button>

                </div>

              ) : (

                <div className="space-y-4">

                  {[...historias]
                    .reverse()
                    .map((historia, index) => (

                      <div
                        key={historia.id}
                        className="border border-slate-200 rounded-2xl p-5 hover:border-cyan-300 hover:shadow-sm transition"
                      >

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                          <div>

                            <div className="flex items-center gap-3">

                              <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center text-xl">
                                📋
                              </div>

                              <div>

                                <h3 className="font-bold text-slate-900">
                                  Consulta #
                                  {historias.length -
                                    index}
                                </h3>

                                <p className="text-sm text-slate-500">
                                  {historia.fechaCreacion}
                                </p>

                              </div>

                            </div>


                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">

                              <InfoMini
                                titulo="Motivo"
                                valor={
                                  historia.motivoConsulta ||
                                  "No registrado"
                                }
                              />

                              <InfoMini
                                titulo="Diagnóstico"
                                valor={
                                  historia.diagnostico ||
                                  "No registrado"
                                }
                              />

                              <InfoMini
                                titulo="Estado"
                                valor={
                                  historia.fechaActualizacion
                                    ? "Guardada"
                                    : "Sin actualizar"
                                }
                              />

                            </div>

                          </div>


                          <div className="flex flex-wrap gap-2 no-print">

                            <button
                              type="button"
                              onClick={() =>
                                abrirHistoria(
                                  historia
                                )
                              }
                              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50"
                            >
                              Ver consulta
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                imprimirHistoria(
                                  historia
                                )
                              }
                              className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900"
                            >
                              🖨️ Imprimir
                            </button>

                          </div>

                        </div>

                      </div>

                    ))}

                </div>

              )}

            </div>

          )}


          {/* =================================================
              FORMULARIO
          ================================================= */}

          {mostrarFormulario &&
            historiaActual && (

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mt-5 print-container">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 no-print">

                  <div>

                    <h2 className="text-2xl font-bold text-slate-900">
                      {historias.some(
                        (item) =>
                          item.id ===
                          historiaActual.id
                      )
                        ? "Consulta clínica"
                        : "Nueva consulta"}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Fecha:{" "}
                      {historiaActual.fechaCreacion}
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormulario(
                        false
                      );
                      setHistoriaActual(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    ← Volver al historial
                  </button>

                </div>


                {/* MOTIVO */}

                <section className="mb-10">

                  <SectionTitle
                    icon="🩺"
                    title="Motivo de consulta"
                  />

                  <Textarea
                    label="Motivo principal"
                    value={
                      historiaActual.motivoConsulta
                    }
                    onChange={(value) =>
                      cambiarCampo(
                        "motivoConsulta",
                        value
                      )
                    }
                    placeholder="¿Por qué consulta el paciente?"
                    rows={4}
                  />

                </section>


                {/* ENFERMEDAD ACTUAL */}

                <section className="mb-10">

                  <SectionTitle
                    icon="📝"
                    title="Enfermedad actual"
                  />

                  <Textarea
                    label="Descripción"
                    value={
                      historiaActual.enfermedadActual
                    }
                    onChange={(value) =>
                      cambiarCampo(
                        "enfermedadActual",
                        value
                      )
                    }
                    placeholder="Describe evolución, duración, síntomas e información relevante."
                    rows={5}
                  />

                </section>


                {/* ANTECEDENTES */}

                <section className="mb-10">

                  <SectionTitle
                    icon="🧬"
                    title="Antecedentes médicos"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

                    <CheckBox
                      label="Hipertensión"
                      checked={
                        historiaActual.hipertension
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "hipertension",
                          value
                        )
                      }
                    />

                    <CheckBox
                      label="Diabetes"
                      checked={
                        historiaActual.diabetes
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "diabetes",
                          value
                        )
                      }
                    />

                    <CheckBox
                      label="Cardiopatías"
                      checked={
                        historiaActual.cardiopatias
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "cardiopatias",
                          value
                        )
                      }
                    />

                    <CheckBox
                      label="Enfermedades renales"
                      checked={
                        historiaActual.enfermedadesRenales
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "enfermedadesRenales",
                          value
                        )
                      }
                    />

                    <CheckBox
                      label="Enfermedades hepáticas"
                      checked={
                        historiaActual.enfermedadesHepaticas
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "enfermedadesHepaticas",
                          value
                        )
                      }
                    />

                    <CheckBox
                      label="Enfermedades respiratorias"
                      checked={
                        historiaActual.enfermedadesRespiratorias
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "enfermedadesRespiratorias",
                          value
                        )
                      }
                    />

                    <CheckBox
                      label="Enfermedades inmunológicas"
                      checked={
                        historiaActual.enfermedadesInmunologicas
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "enfermedadesInmunologicas",
                          value
                        )
                      }
                    />

                  </div>


                  <div className="mt-5">

                    <Textarea
                      label="Otras enfermedades o antecedentes"
                      value={
                        historiaActual.otrasEnfermedades
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "otrasEnfermedades",
                          value
                        )
                      }
                      rows={4}
                    />

                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                    <Textarea
                      label="Cirugías"
                      value={
                        historiaActual.cirugias
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "cirugias",
                          value
                        )
                      }
                      rows={4}
                    />

                    <Textarea
                      label="Hospitalizaciones"
                      value={
                        historiaActual.hospitalizaciones
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "hospitalizaciones",
                          value
                        )
                      }
                      rows={4}
                    />

                  </div>

                </section>


                {/* ALERGIAS */}

                <section className="mb-10">

                  <SectionTitle
                    icon="⚠️"
                    title="Alergias y medicamentos"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">

                    <CheckBox
                      label="Alergia a medicamentos"
                      checked={
                        historiaActual.alergiaMedicamentos
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "alergiaMedicamentos",
                          value
                        )
                      }
                    />

                    <CheckBox
                      label="Alergia al látex"
                      checked={
                        historiaActual.alergiaLatex
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "alergiaLatex",
                          value
                        )
                      }
                    />

                    <CheckBox
                      label="Alergia a anestésicos"
                      checked={
                        historiaActual.alergiaAnestesia
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "alergiaAnestesia",
                          value
                        )
                      }
                    />

                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Textarea
                      label="Alergias conocidas"
                      value={
                        historiaActual.alergias
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "alergias",
                          value
                        )
                      }
                      rows={5}
                    />

                    <Textarea
                      label="Medicamentos actuales"
                      value={
                        historiaActual.medicamentos
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "medicamentos",
                          value
                        )
                      }
                      rows={5}
                    />

                  </div>

                </section>


                {/* ANTECEDENTES ODONTOLÓGICOS */}

                <section className="mb-10">

                  <SectionTitle
                    icon="🦷"
                    title="Antecedentes odontológicos"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Textarea
                      label="Antecedentes"
                      value={
                        historiaActual.antecedentesOdontologicos
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "antecedentesOdontologicos",
                          value
                        )
                      }
                      rows={5}
                    />

                    <Textarea
                      label="Tratamientos previos"
                      value={
                        historiaActual.tratamientosPrevios
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "tratamientosPrevios",
                          value
                        )
                      }
                      rows={5}
                    />

                    <Field
                      label="Última consulta odontológica"
                      value={
                        historiaActual.ultimaConsultaOdontologica
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "ultimaConsultaOdontologica",
                          value
                        )
                      }
                      type="date"
                    />

                    <Textarea
                      label="Experiencias odontológicas"
                      value={
                        historiaActual.experienciasOdontologicas
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "experienciasOdontologicas",
                          value
                        )
                      }
                      rows={4}
                    />

                  </div>

                </section>


                {/* HÁBITOS */}

                <section className="mb-10">

                  <SectionTitle
                    icon="🪥"
                    title="Hábitos e higiene oral"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                    <SelectField
                      label="Cepillado"
                      value={
                        historiaActual.frecuenciaCepillado
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "frecuenciaCepillado",
                          value
                        )
                      }
                      options={[
                        "No registra",
                        "1 vez al día",
                        "2 veces al día",
                        "3 o más veces al día",
                      ]}
                    />

                    <SelectField
                      label="Uso de hilo dental"
                      value={
                        historiaActual.usaHiloDental
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "usaHiloDental",
                          value
                        )
                      }
                      options={[
                        "No registra",
                        "Nunca",
                        "Ocasionalmente",
                        "Diariamente",
                      ]}
                    />

                    <SelectField
                      label="Enjuague bucal"
                      value={
                        historiaActual.usaEnjuague
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "usaEnjuague",
                          value
                        )
                      }
                      options={[
                        "No registra",
                        "Nunca",
                        "Ocasionalmente",
                        "Diariamente",
                      ]}
                    />

                    <SelectField
                      label="Higiene oral"
                      value={
                        historiaActual.higieneOral
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "higieneOral",
                          value
                        )
                      }
                      options={[
                        "No evaluada",
                        "Buena",
                        "Regular",
                        "Deficiente",
                      ]}
                    />

                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">

                    <SelectField
                      label="Tabaquismo"
                      value={
                        historiaActual.fuma
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "fuma",
                          value
                        )
                      }
                      options={[
                        "No registra",
                        "No fuma",
                        "Exfumador",
                        "Fumador ocasional",
                        "Fumador frecuente",
                      ]}
                    />

                    <SelectField
                      label="Consumo de alcohol"
                      value={
                        historiaActual.alcohol
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "alcohol",
                          value
                        )
                      }
                      options={[
                        "No registra",
                        "No consume",
                        "Ocasional",
                        "Frecuente",
                      ]}
                    />

                    <SelectField
                      label="Bruxismo"
                      value={
                        historiaActual.bruxismo
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "bruxismo",
                          value
                        )
                      }
                      options={[
                        "No evaluado",
                        "No",
                        "Sí",
                        "Sospecha",
                      ]}
                    />

                  </div>


                  <div className="mt-5">

                    <Textarea
                      label="Otros hábitos"
                      value={
                        historiaActual.otrosHabitos
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "otrosHabitos",
                          value
                        )
                      }
                      rows={4}
                    />

                  </div>

                </section>


                {/* SÍNTOMAS */}

                <section className="mb-10">

                  <SectionTitle
                    icon="🔎"
                    title="Síntomas y signos"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                    <SelectField
                      label="Dolor"
                      value={
                        historiaActual.dolor
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "dolor",
                          value
                        )
                      }
                      options={[
                        "No refiere",
                        "Leve",
                        "Moderado",
                        "Severo",
                        "Intermitente",
                        "Constante",
                      ]}
                    />

                    <SelectField
                      label="Sensibilidad"
                      value={
                        historiaActual.sensibilidad
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "sensibilidad",
                          value
                        )
                      }
                      options={[
                        "No refiere",
                        "No",
                        "Sí",
                        "Al frío",
                        "Al calor",
                        "A la masticación",
                      ]}
                    />

                    <SelectField
                      label="Sangrado gingival"
                      value={
                        historiaActual.sangrado
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "sangrado",
                          value
                        )
                      }
                      options={[
                        "No refiere",
                        "No",
                        "Ocasional",
                        "Frecuente",
                      ]}
                    />

                    <SelectField
                      label="Movilidad dental"
                      value={
                        historiaActual.movilidadDental
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "movilidadDental",
                          value
                        )
                      }
                      options={[
                        "No evaluada",
                        "No",
                        "Sí",
                      ]}
                    />

                  </div>

                </section>


                {/* EXAMEN */}

                <section className="mb-10">

                  <SectionTitle
                    icon="🔍"
                    title="Examen clínico"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    <SelectField
                      label="Labios"
                      value={
                        historiaActual.labios
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "labios",
                          value
                        )
                      }
                      options={[
                        "No evaluado",
                        "Normal",
                        "Alterado",
                      ]}
                    />

                    <SelectField
                      label="Mucosas"
                      value={
                        historiaActual.mucosas
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "mucosas",
                          value
                        )
                      }
                      options={[
                        "No evaluadas",
                        "Normales",
                        "Alteradas",
                      ]}
                    />

                    <SelectField
                      label="Lengua"
                      value={
                        historiaActual.lengua
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "lengua",
                          value
                        )
                      }
                      options={[
                        "No evaluada",
                        "Normal",
                        "Alterada",
                      ]}
                    />

                    <SelectField
                      label="Paladar"
                      value={
                        historiaActual.paladar
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "paladar",
                          value
                        )
                      }
                      options={[
                        "No evaluado",
                        "Normal",
                        "Alterado",
                      ]}
                    />

                    <SelectField
                      label="Piso de boca"
                      value={
                        historiaActual.pisoBoca
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "pisoBoca",
                          value
                        )
                      }
                      options={[
                        "No evaluado",
                        "Normal",
                        "Alterado",
                      ]}
                    />

                    <SelectField
                      label="Encías"
                      value={
                        historiaActual.encias
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "encias",
                          value
                        )
                      }
                      options={[
                        "No evaluadas",
                        "Normales",
                        "Inflamadas",
                        "Sangrado",
                        "Retracción",
                      ]}
                    />

                    <SelectField
                      label="Higiene clínica"
                      value={
                        historiaActual.higieneClinica
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "higieneClinica",
                          value
                        )
                      }
                      options={[
                        "No evaluada",
                        "Buena",
                        "Regular",
                        "Deficiente",
                      ]}
                    />

                    <SelectField
                      label="Placa bacteriana"
                      value={
                        historiaActual.placaBacteriana
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "placaBacteriana",
                          value
                        )
                      }
                      options={[
                        "No evaluada",
                        "Ausente",
                        "Leve",
                        "Moderada",
                        "Abundante",
                      ]}
                    />

                    <SelectField
                      label="Cálculo dental"
                      value={
                        historiaActual.calculoDental
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "calculoDental",
                          value
                        )
                      }
                      options={[
                        "No evaluado",
                        "Ausente",
                        "Leve",
                        "Moderado",
                        "Abundante",
                      ]}
                    />

                    <SelectField
                      label="Caries"
                      value={
                        historiaActual.caries
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "caries",
                          value
                        )
                      }
                      options={[
                        "No evaluada",
                        "Sin evidencia",
                        "Leve",
                        "Moderada",
                        "Múltiples lesiones",
                      ]}
                    />

                    <SelectField
                      label="ATM"
                      value={
                        historiaActual.atm
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "atm",
                          value
                        )
                      }
                      options={[
                        "No evaluada",
                        "Normal",
                        "Dolor",
                        "Chasquido",
                        "Limitación",
                      ]}
                    />

                    <SelectField
                      label="Oclusión"
                      value={
                        historiaActual.oclusion
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "oclusion",
                          value
                        )
                      }
                      options={[
                        "No evaluada",
                        "Normal",
                        "Alterada",
                        "Maloclusión",
                      ]}
                    />

                  </div>


                  <div className="mt-5">

                    <Textarea
                      label="Hallazgos clínicos adicionales"
                      value={
                        historiaActual.examenClinico
                      }
                      onChange={(value) =>
                        cambiarCampo(
                          "examenClinico",
                          value
                        )
                      }
                      rows={6}
                    />

                  </div>

                </section>


                {/* DIAGNÓSTICO */}

                <section className="mb-10">

                  <SectionTitle
                    icon="🧠"
                    title="Diagnóstico"
                  />

                  <Textarea
                    label="Diagnóstico clínico"
                    value={
                      historiaActual.diagnostico
                    }
                    onChange={(value) =>
                      cambiarCampo(
                        "diagnostico",
                        value
                      )
                    }
                    rows={5}
                  />

                </section>


                {/* PLAN */}

                <section className="mb-10">

                  <SectionTitle
                    icon="📋"
                    title="Plan de tratamiento"
                  />

                  <Textarea
                    label="Plan"
                    value={
                      historiaActual.planTratamiento
                    }
                    onChange={(value) =>
                      cambiarCampo(
                        "planTratamiento",
                        value
                      )
                    }
                    rows={7}
                  />

                </section>


                {/* CONSENTIMIENTO */}

                <section className="mb-10">

                  <SectionTitle
                    icon="✍️"
                    title="Consentimiento informado"
                  />

                  <SelectField
                    label="Estado"
                    value={
                      historiaActual.consentimientoInformado
                    }
                    onChange={(value) =>
                      cambiarCampo(
                        "consentimientoInformado",
                        value
                      )
                    }
                    options={[
                      "No registrado",
                      "Pendiente",
                      "Informado",
                      "Aceptado",
                      "Rechazado",
                    ]}
                  />

                </section>


                {/* OBSERVACIONES */}

                <section className="mb-8">

                  <SectionTitle
                    icon="📌"
                    title="Observaciones"
                  />

                  <Textarea
                    label="Observaciones adicionales"
                    value={
                      historiaActual.observaciones
                    }
                    onChange={(value) =>
                      cambiarCampo(
                        "observaciones",
                        value
                      )
                    }
                    rows={6}
                  />

                </section>


                {/* BOTONES */}

                <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 no-print">

                  <div>

                    {historiaActual.fechaActualizacion && (
                      <p className="text-sm text-slate-500">
                        Última actualización:{" "}
                        {
                          historiaActual.fechaActualizacion
                        }
                      </p>
                    )}

                    {mensaje && (
                      <p className="text-sm text-green-600 font-semibold mt-2">
                        {mensaje}
                      </p>
                    )}

                  </div>


                  <div className="flex flex-wrap gap-3">

                    <button
                      type="button"
                      onClick={() => {
                        setMostrarFormulario(
                          false
                        );
                        setHistoriaActual(null);
                      }}
                      className="px-5 py-3 rounded-xl border border-slate-200 bg-white font-semibold hover:bg-slate-50"
                    >
                      Cancelar
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        imprimirHistoria()
                      }
                      className="px-5 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900"
                    >
                      🖨️ Imprimir
                    </button>


                    <button
                      type="button"
                      onClick={
                        guardarHistoria
                      }
                      className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600"
                    >
                      💾 Guardar consulta
                    </button>

                  </div>

                </div>

              </div>

            )}

        </div>

      </main>


      {/* =================================================
          IMPRESIÓN
      ================================================= */}

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: white !important;
            margin: 0 !important;
          }

          .no-print {
            display: none !important;
          }

          .print-container {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: none !important;
          }

          input,
          textarea,
          select {
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            background: transparent !important;
            color: black !important;
          }

          textarea {
            resize: none !important;
            overflow: visible !important;
          }

          select {
            appearance: none !important;
          }

          section {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          button {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}


/* =====================================================
   COMPONENTES
===================================================== */

function SectionTitle({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">

      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-xl">
        {icon}
      </div>

      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>

    </div>
  );
}


function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />

    </div>
  );
}


function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        rows={rows}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-y"
      />

    </div>
  );
}


function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >

        <option value="">
          Seleccionar...
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}


function CheckBox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
        className="w-5 h-5 accent-cyan-500"
      />

      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>

    </label>
  );
}


function InfoMini({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">

      <p className="text-xs text-slate-400 font-semibold">
        {titulo}
      </p>

      <p className="text-sm text-slate-700 mt-1 line-clamp-2">
        {valor}
      </p>

    </div>
  );
}