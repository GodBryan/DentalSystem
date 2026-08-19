"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoPaciente() {
  const router = useRouter();

  const [formulario, setFormulario] = useState({
    tipoDocumento: "",
    documento: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    sexo: "",
    telefono: "",
    correo: "",
    direccion: "",
    ciudad: "",
    contactoEmergencia: "",
    telefonoEmergencia: "",
    eps: "",
    ocupacion: "",
    alergias: "",
    medicamentos: "",
    antecedentes: "",
    observaciones: "",
  });

  const [mensaje, setMensaje] = useState("");

  function manejarCambio(
    evento: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function guardarPaciente() {
    if (
      !formulario.documento ||
      !formulario.nombres ||
      !formulario.apellidos ||
      !formulario.telefono
    ) {
      setMensaje(
        "Por favor completa documento, nombres, apellidos y teléfono."
      );
      return;
    }

    const pacientesGuardados = JSON.parse(
      localStorage.getItem("dentalSystemPacientes") || "[]"
    );

    const pacienteExistente = pacientesGuardados.find(
      (paciente: { documento: string }) =>
        paciente.documento === formulario.documento
    );

    if (pacienteExistente) {
      setMensaje("Ya existe un paciente con ese número de documento.");
      return;
    }

    const nuevoPaciente = {
      id: crypto.randomUUID(),
      ...formulario,
      fechaRegistro: new Date().toISOString(),
      estado: "Activo",
    };

    localStorage.setItem(
      "dentalSystemPacientes",
      JSON.stringify([...pacientesGuardados, nuevoPaciente])
    );

    router.push("/pacientes");
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="p-8">

        {/* ENCABEZADO */}
        <div className="mb-8">
          <Link
            href="/pacientes"
            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
          >
            ← Volver a pacientes
          </Link>

          <div className="mt-4">
            <h1 className="text-3xl font-bold">
              Nuevo paciente
            </h1>

            <p className="text-slate-500 mt-1">
              Registra la información básica del paciente.
            </p>
          </div>
        </div>

        {/* MENSAJE DE ERROR */}
        {mensaje && (
          <div className="max-w-5xl mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {mensaje}
          </div>
        )}

        <div className="max-w-5xl">

          {/* INFORMACIÓN PERSONAL */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <div className="mb-6">
              <h2 className="text-xl font-bold">
                Información personal
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Datos principales del paciente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de documento *
                </label>

                <select
                  name="tipoDocumento"
                  value={formulario.tipoDocumento}
                  onChange={manejarCambio}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="CC">Cédula de ciudadanía</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="TI">Tarjeta de identidad</option>
                  <option value="PAS">Pasaporte</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Número de documento *
                </label>

                <input
                  name="documento"
                  value={formulario.documento}
                  onChange={manejarCambio}
                  type="text"
                  placeholder="Ej. 1234567890"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombres *
                </label>

                <input
                  name="nombres"
                  value={formulario.nombres}
                  onChange={manejarCambio}
                  type="text"
                  placeholder="Ej. Juan Carlos"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Apellidos *
                </label>

                <input
                  name="apellidos"
                  value={formulario.apellidos}
                  onChange={manejarCambio}
                  type="text"
                  placeholder="Ej. Pérez Rodríguez"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha de nacimiento
                </label>

                <input
                  name="fechaNacimiento"
                  value={formulario.fechaNacimiento}
                  onChange={manejarCambio}
                  type="date"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Sexo
                </label>

                <select
                  name="sexo"
                  value={formulario.sexo}
                  onChange={manejarCambio}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                  <option value="No especificado">
                    Prefiero no especificar
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Teléfono / celular *
                </label>

                <input
                  name="telefono"
                  value={formulario.telefono}
                  onChange={manejarCambio}
                  type="tel"
                  placeholder="Ej. 300 123 4567"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Correo electrónico
                </label>

                <input
                  name="correo"
                  value={formulario.correo}
                  onChange={manejarCambio}
                  type="email"
                  placeholder="Ej. paciente@email.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Dirección
                </label>

                <input
                  name="direccion"
                  value={formulario.direccion}
                  onChange={manejarCambio}
                  type="text"
                  placeholder="Ej. Calle 30 # 10-20"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ciudad
                </label>

                <input
                  name="ciudad"
                  value={formulario.ciudad}
                  onChange={manejarCambio}
                  type="text"
                  placeholder="Ej. Cartagena"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

            </div>
          </section>

          {/* INFORMACIÓN ADICIONAL */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <div className="mb-6">
              <h2 className="text-xl font-bold">
                Información adicional
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Información de contacto y afiliación.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contacto de emergencia
                </label>

                <input
                  name="contactoEmergencia"
                  value={formulario.contactoEmergencia}
                  onChange={manejarCambio}
                  type="text"
                  placeholder="Nombre del contacto"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Teléfono de emergencia
                </label>

                <input
                  name="telefonoEmergencia"
                  value={formulario.telefonoEmergencia}
                  onChange={manejarCambio}
                  type="tel"
                  placeholder="Ej. 300 123 4567"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  EPS / Aseguradora
                </label>

                <input
                  name="eps"
                  value={formulario.eps}
                  onChange={manejarCambio}
                  type="text"
                  placeholder="Ej. Nueva EPS"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ocupación
                </label>

                <input
                  name="ocupacion"
                  value={formulario.ocupacion}
                  onChange={manejarCambio}
                  type="text"
                  placeholder="Ej. Ingeniero"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

            </div>
          </section>

          {/* INFORMACIÓN CLÍNICA */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <div className="mb-6">
              <h2 className="text-xl font-bold">
                Información clínica inicial
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Información relevante para la atención odontológica.
              </p>
            </div>

            <div className="space-y-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Alergias
                </label>

                <textarea
                  name="alergias"
                  value={formulario.alergias}
                  onChange={manejarCambio}
                  rows={3}
                  placeholder="Describe las alergias conocidas..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Medicamentos actuales
                </label>

                <textarea
                  name="medicamentos"
                  value={formulario.medicamentos}
                  onChange={manejarCambio}
                  rows={3}
                  placeholder="Medicamentos que utiliza actualmente..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Antecedentes relevantes
                </label>

                <textarea
                  name="antecedentes"
                  value={formulario.antecedentes}
                  onChange={manejarCambio}
                  rows={4}
                  placeholder="Antecedentes médicos u odontológicos relevantes..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Observaciones
                </label>

                <textarea
                  name="observaciones"
                  value={formulario.observaciones}
                  onChange={manejarCambio}
                  rows={4}
                  placeholder="Información adicional..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

            </div>
          </section>

          {/* BOTONES */}
          <div className="flex items-center justify-end gap-3 pb-10">

            <Link
              href="/pacientes"
              className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50"
            >
              Cancelar
            </Link>

            <button
              type="button"
              onClick={guardarPaciente}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold shadow-sm"
            >
              Guardar paciente
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}