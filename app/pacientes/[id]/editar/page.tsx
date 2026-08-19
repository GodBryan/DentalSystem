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

export default function EditarPaciente() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [formulario, setFormulario] = useState<Paciente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const datosGuardados = localStorage.getItem(
      "dentalSystemPacientes"
    );

    if (datosGuardados) {
      try {
        const pacientes: Paciente[] =
          JSON.parse(datosGuardados);

        const pacienteEncontrado = pacientes.find(
          (paciente) => paciente.id === id
        );

        if (pacienteEncontrado) {
          setFormulario(pacienteEncontrado);
        }
      } catch {
        setFormulario(null);
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

    setFormulario((anterior) => {
      if (!anterior) {
        return anterior;
      }

      return {
        ...anterior,
        [name]: value,
      };
    });
  }

  function guardarCambios() {
    if (!formulario) {
      return;
    }

    if (
      !formulario.documento ||
      !formulario.nombres ||
      !formulario.apellidos ||
      !formulario.telefono
    ) {
      setMensaje(
        "Completa documento, nombres, apellidos y teléfono."
      );
      return;
    }

    const datosGuardados = localStorage.getItem(
      "dentalSystemPacientes"
    );

    const pacientes: Paciente[] = datosGuardados
      ? JSON.parse(datosGuardados)
      : [];

    const pacientesActualizados = pacientes.map(
      (paciente) =>
        paciente.id === formulario.id
          ? formulario
          : paciente
    );

    localStorage.setItem(
      "dentalSystemPacientes",
      JSON.stringify(pacientesActualizados)
    );

    router.push(`/pacientes/${formulario.id}`);
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

  if (!formulario) {
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
            No encontramos el paciente que quieres editar.
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
            href={`/pacientes/${formulario.id}`}
            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
          >
            ← Volver a ficha del paciente
          </Link>

          <div className="mt-4">

            <h1 className="text-3xl font-bold">
              Editar paciente
            </h1>

            <p className="text-slate-500 mt-1">
              Modifica la información de{" "}
              <span className="font-medium text-slate-700">
                {formulario.nombres} {formulario.apellidos}
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

              {/* TIPO DOCUMENTO */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Tipo de documento
                </label>

                <select
                  name="tipoDocumento"
                  value={formulario.tipoDocumento}
                  onChange={manejarCambio}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >

                  <option value="">
                    Selecciona una opción
                  </option>

                  <option value="CC">
                    Cédula de ciudadanía
                  </option>

                  <option value="CE">
                    Cédula de extranjería
                  </option>

                  <option value="TI">
                    Tarjeta de identidad
                  </option>

                  <option value="PAS">
                    Pasaporte
                  </option>

                </select>

              </div>


              {/* DOCUMENTO */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Número de documento *
                </label>

                <input
                  name="documento"
                  value={formulario.documento}
                  onChange={manejarCambio}
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />

              </div>


              {/* NOMBRES */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Nombres *
                </label>

                <input
                  name="nombres"
                  value={formulario.nombres}
                  onChange={manejarCambio}
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />

              </div>


              {/* APELLIDOS */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Apellidos *
                </label>

                <input
                  name="apellidos"
                  value={formulario.apellidos}
                  onChange={manejarCambio}
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 de-cyan-100"
                />

              </div>


              {/* FECHA */}

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


              {/* SEXO */}

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

                  <option value="">
                    Selecciona una opción
                  </option>

                  <option value="Femenino">
                    Femenino
                  </option>

                  <option value="Masculino">
                    Masculino
                  </option>

                  <option value="Otro">
                    Otro
                  </option>

                  <option value="No especificado">
                    Prefiero no especificar
                  </option>

                </select>

              </div>


              {/* TELEFONO */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Teléfono / celular *
                </label>

                <input
                  name="telefono"
                  value={formulario.telefono}
                  onChange={manejarCambio}
                  type="tel"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />

              </div>


              {/* CORREO */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Correo electrónico
                </label>

                <input
                  name="correo"
                  value={formulario.correo}
                  onChange={manejarCambio}
                  type="email"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />

              </div>


              {/* DIRECCION */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Dirección
                </label>

                <input
                  name="direccion"
                  value={formulario.direccion}
                  onChange={manejarCambio}
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />

              </div>


              {/* CIUDAD */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Ciudad
                </label>

                <input
                  name="ciudad"
                  value={formulario.ciudad}
                  onChange={manejarCambio}
                  type="text"
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
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />

              </div>

            </div>

          </section>


          {/* BOTONES */}

          <div className="flex items-center justify-end gap-3 pb-10">

            <Link
              href={`/pacientes/${formulario.id}`}
              className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50"
            >
              Cancelar
            </Link>

            <button
              type="button"
              onClick={guardarCambios}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold shadow-sm"
            >
              Guardar cambios
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}