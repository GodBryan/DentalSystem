"use client";

import { useEffect, useState } from "react";

type Configuracion = {
  nombreClinica: string;
  telefono: string;
  correo: string;
  direccion: string;
  ciudad: string;
  nit: string;
  moneda: string;
  odontologo: string;
};

const configuracionInicial: Configuracion = {
  nombreClinica: "Dental System",
  telefono: "",
  correo: "",
  direccion: "",
  ciudad: "Cartagena",
  nit: "",
  moneda: "COP",
  odontologo: "",
};

export default function ConfiguracionPage() {
  const [configuracion, setConfiguracion] =
    useState<Configuracion>(configuracionInicial);

  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const datos = localStorage.getItem(
      "dentalSystemConfiguracion"
    );

    if (datos) {
      try {
        setConfiguracion(JSON.parse(datos));
      } catch {
        setConfiguracion(configuracionInicial);
      }
    }
  }, []);

  const cambiarCampo = (
    campo: keyof Configuracion,
    valor: string
  ) => {
    setConfiguracion((actual) => ({
      ...actual,
      [campo]: valor,
    }));

    setGuardado(false);
  };

  const guardarConfiguracion = () => {
    localStorage.setItem(
      "dentalSystemConfiguracion",
      JSON.stringify(configuracion)
    );

    setGuardado(true);
  };

  const restaurar = () => {
    const confirmar = window.confirm(
      "¿Deseas restaurar la configuración inicial?"
    );

    if (!confirmar) return;

    setConfiguracion(configuracionInicial);

    localStorage.setItem(
      "dentalSystemConfiguracion",
      JSON.stringify(configuracionInicial)
    );

    setGuardado(true);
  };

  return (
    <main className="min-h-screen bg-slate-100">

      <div className="p-8 max-w-5xl mx-auto">

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


        {/* ENCABEZADO */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">

          <h1 className="text-3xl font-bold text-slate-900">
            ⚙️ Configuración
          </h1>

          <p className="text-slate-500 mt-2">
            Configura la información general de tu clínica.
          </p>

        </div>


        {/* INFORMACIÓN DE LA CLÍNICA */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 p-7">

          <div className="mb-6">

            <h2 className="text-xl font-bold">
              🏥 Información de la clínica
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Estos datos pueden utilizarse posteriormente en documentos y reportes.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <Campo
              label="Nombre de la clínica"
              value={configuracion.nombreClinica}
              onChange={(valor) =>
                cambiarCampo(
                  "nombreClinica",
                  valor
                )
              }
              placeholder="Nombre de la clínica"
            />

            <Campo
              label="NIT"
              value={configuracion.nit}
              onChange={(valor) =>
                cambiarCampo("nit", valor)
              }
              placeholder="Ej. 900123456-1"
            />

            <Campo
              label="Teléfono"
              value={configuracion.telefono}
              onChange={(valor) =>
                cambiarCampo(
                  "telefono",
                  valor
                )
              }
              placeholder="Número telefónico"
            />

            <Campo
              label="Correo electrónico"
              value={configuracion.correo}
              onChange={(valor) =>
                cambiarCampo(
                  "correo",
                  valor
                )
              }
              placeholder="correo@clinica.com"
              type="email"
            />

            <Campo
              label="Dirección"
              value={configuracion.direccion}
              onChange={(valor) =>
                cambiarCampo(
                  "direccion",
                  valor
                )
              }
              placeholder="Dirección de la clínica"
            />

            <Campo
              label="Ciudad"
              value={configuracion.ciudad}
              onChange={(valor) =>
                cambiarCampo(
                  "ciudad",
                  valor
                )
              }
              placeholder="Ciudad"
            />

          </div>

        </section>


        {/* INFORMACIÓN PROFESIONAL */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 p-7">

          <div className="mb-6">

            <h2 className="text-xl font-bold">
              👨‍⚕️ Información profesional
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Profesional principal de la clínica.
            </p>

          </div>


          <Campo
            label="Odontólogo principal"
            value={configuracion.odontologo}
            onChange={(valor) =>
              cambiarCampo(
                "odontologo",
                valor
              )
            }
            placeholder="Nombre completo del odontólogo"
          />

        </section>


        {/* PREFERENCIAS */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 p-7">

          <div className="mb-6">

            <h2 className="text-xl font-bold">
              💵 Preferencias
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Configuración utilizada para valores económicos.
            </p>

          </div>


          <div className="max-w-md">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Moneda
            </label>

            <select
              value={configuracion.moneda}
              onChange={(e) =>
                cambiarCampo(
                  "moneda",
                  e.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
            >

              <option value="COP">
                Peso colombiano (COP)
              </option>

              <option value="USD">
                Dólar estadounidense (USD)
              </option>

              <option value="EUR">
                Euro (EUR)
              </option>

            </select>

          </div>

        </section>


        {/* GUARDAR */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 p-7 mb-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              {guardado ? (

                <p className="text-sm text-green-600 font-medium">
                  ✓ Configuración guardada correctamente.
                </p>

              ) : (

                <p className="text-sm text-slate-500">
                  Guarda los cambios para conservarlos.
                </p>

              )}

            </div>


            <div className="flex gap-3">

              <button
                type="button"
                onClick={restaurar}
                className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
              >
                Restaurar
              </button>

              <button
                type="button"
                onClick={guardarConfiguracion}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
              >
                💾 Guardar cambios
              </button>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}


function Campo({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (valor: string) => void;
  placeholder?: string;
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
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />

    </div>
  );
}