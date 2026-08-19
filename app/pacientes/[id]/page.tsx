"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Paciente = {
  id: string;
  tipoDocumento?: string;
  documento?: string;
  nombres?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  sexo?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  ciudad?: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
  eps?: string;
  ocupacion?: string;
  alergias?: string;
  medicamentos?: string;
  antecedentes?: string;
  observaciones?: string;
  estado?: string;
};

export default function FichaPaciente() {
  const params = useParams();
  const id = String(params.id);

  const [paciente, setPaciente] =
    useState<Paciente | null>(null);

  const [cargando, setCargando] =
    useState(true);

  const [tratamientos, setTratamientos] =
    useState<any[]>([]);

  const [citas, setCitas] =
    useState<any[]>([]);

  const [pagos, setPagos] =
    useState<any[]>([]);

  const [documentos, setDocumentos] =
    useState<any[]>([]);

  const [odontograma, setOdontograma] =
    useState<any>({});

  const [historia, setHistoria] =
    useState<any>(null);


  useEffect(() => {
    try {
      /* =========================================
         PACIENTE
      ========================================= */

      const guardado = localStorage.getItem(
        "dentalSystemPacientes"
      );

      if (guardado) {
        const pacientes: Paciente[] =
          JSON.parse(guardado);

        const encontrado = pacientes.find(
          (p) => String(p.id) === id
        );

        setPaciente(encontrado || null);
      }


      /* =========================================
         TRATAMIENTOS
      ========================================= */

      const tratamientosGuardados =
        localStorage.getItem(
          "tratamientos-bryan"
        );

      if (tratamientosGuardados) {
        const datos = JSON.parse(
          tratamientosGuardados
        );

        if (Array.isArray(datos)) {
          setTratamientos(
            datos.filter(
              (item) =>
                !item.pacienteId ||
                String(item.pacienteId) === id
            )
          );
        }
      }


      /* =========================================
         CITAS
      ========================================= */

      const citasGuardadas =
        localStorage.getItem(
          "citas-bryan"
        );

      if (citasGuardadas) {
        const datos = JSON.parse(
          citasGuardadas
        );

        if (Array.isArray(datos)) {
          setCitas(
            datos.filter(
              (item) =>
                !item.pacienteId ||
                String(item.pacienteId) === id
            )
          );
        }
      }


      /* =========================================
         PAGOS
      ========================================= */

      const pagosGuardados =
        localStorage.getItem(
          "pagos-bryan"
        );

      if (pagosGuardados) {
        const datos = JSON.parse(
          pagosGuardados
        );

        if (Array.isArray(datos)) {
          setPagos(
            datos.filter(
              (item) =>
                !item.pacienteId ||
                String(item.pacienteId) === id
            )
          );
        }
      }


      /* =========================================
         DOCUMENTOS
      ========================================= */

      const documentosGuardados =
        localStorage.getItem(
          "documentos-bryan"
        );

      if (documentosGuardados) {
        const datos = JSON.parse(
          documentosGuardados
        );

        if (Array.isArray(datos)) {
          setDocumentos(
            datos.filter(
              (item) =>
                !item.pacienteId ||
                String(item.pacienteId) === id
            )
          );
        }
      }


      /* =========================================
         ODONTOGRAMA
      ========================================= */

      const odontogramaGuardado =
        localStorage.getItem(
          "odontograma-bryan"
        );

      if (odontogramaGuardado) {
        const datos = JSON.parse(
          odontogramaGuardado
        );

        if (
          datos &&
          datos.pacienteId &&
          String(datos.pacienteId) !== id
        ) {
          setOdontograma({});
        } else {
          setOdontograma(datos || {});
        }
      }


      /* =========================================
         HISTORIA CLÍNICA
      ========================================= */

      const historiaGuardada =
        localStorage.getItem(
          "historia-clinica-bryan"
        );

      if (historiaGuardada) {
        const datos = JSON.parse(
          historiaGuardada
        );

        if (
          datos &&
          datos.pacienteId &&
          String(datos.pacienteId) !== id
        ) {
          setHistoria(null);
        } else {
          setHistoria(datos);
        }
      }

    } catch (error) {
      console.error(
        "Error cargando paciente:",
        error
      );
    }

    setCargando(false);
  }, [id]);


  /* =========================================
     NAVEGACIÓN
  ========================================= */

  const navegar = (ruta: string) => {
    window.location.href = ruta;
  };


  /* =========================================
     DESACTIVAR
  ========================================= */

  const desactivarPaciente = () => {
    if (!paciente) return;

    const confirmar = window.confirm(
      `¿Deseas desactivar a ${paciente.nombres} ${paciente.apellidos}?`
    );

    if (!confirmar) return;

    const guardado =
      localStorage.getItem(
        "dentalSystemPacientes"
      );

    const pacientes: Paciente[] =
      guardado
        ? JSON.parse(guardado)
        : [];

    const actualizados =
      pacientes.map((p) =>
        String(p.id) ===
        String(paciente.id)
          ? {
              ...p,
              estado: "Inactivo",
            }
          : p
      );

    localStorage.setItem(
      "dentalSystemPacientes",
      JSON.stringify(actualizados)
    );

    setPaciente({
      ...paciente,
      estado: "Inactivo",
    });
  };


  /* =========================================
     ACTIVAR
  ========================================= */

  const activarPaciente = () => {
    if (!paciente) return;

    const guardado =
      localStorage.getItem(
        "dentalSystemPacientes"
      );

    const pacientes: Paciente[] =
      guardado
        ? JSON.parse(guardado)
        : [];

    const actualizados =
      pacientes.map((p) =>
        String(p.id) ===
        String(paciente.id)
          ? {
              ...p,
              estado: "Activo",
            }
          : p
      );

    localStorage.setItem(
      "dentalSystemPacientes",
      JSON.stringify(actualizados)
    );

    setPaciente({
      ...paciente,
      estado: "Activo",
    });
  };


  /* =========================================
     CARGANDO
  ========================================= */

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">

        <div className="text-center">

          <div className="text-4xl">
            🦷
          </div>

          <p className="mt-3 text-slate-500">
            Cargando paciente...
          </p>

        </div>

      </main>
    );
  }


  /* =========================================
     PACIENTE NO ENCONTRADO
  ========================================= */

  if (!paciente) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">

        <div className="bg-white p-10 rounded-2xl shadow text-center">

          <div className="text-5xl">
            🔍
          </div>

          <h1 className="text-2xl font-bold mt-4">
            Paciente no encontrado
          </h1>

          <button
            type="button"
            onClick={() =>
              navegar("/pacientes")
            }
            className="mt-6 px-5 py-3 bg-cyan-500 text-white rounded-xl font-semibold"
          >
            ← Volver a pacientes
          </button>

        </div>

      </main>
    );
  }


  const rutaBase =
    `/pacientes/${paciente.id}`;


  /* =========================================
     ESTADÍSTICAS
  ========================================= */

  const dientesRegistrados =
    Object.keys(odontograma).filter(
      (key) => key !== "pacienteId"
    ).length;


  const tratamientosPendientes =
    tratamientos.filter(
      (t) =>
        t.estado === "Pendiente" ||
        t.estado === "En proceso"
    ).length;


  const citasPendientes =
    citas.filter(
      (c) =>
        c.estado === "Programada" ||
        c.estado === "Confirmada"
    ).length;


  const totalPagado =
    pagos
      .filter(
        (p) =>
          p.estado === "Pagado"
      )
      .reduce(
        (total, p) =>
          total + Number(p.monto || 0),
        0
      );


  const activo =
    paciente.estado !== "Inactivo";


  return (
    <main className="min-h-screen bg-slate-100">

      <div className="p-8">


        {/* =====================================
            VOLVER
        ===================================== */}

        <button
          type="button"
          onClick={() =>
            navegar("/pacientes")
          }
          className="text-cyan-600 hover:text-cyan-800 font-medium"
        >
          ← Volver a pacientes
        </button>


        {/* =====================================
            CABECERA
        ===================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-4 overflow-hidden">

          <div className="p-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">


              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-2xl bg-cyan-50 flex items-center justify-center text-4xl">
                  👤
                </div>


                <div>

                  <div className="flex items-center gap-3 flex-wrap">

                    <h1 className="text-3xl font-bold text-slate-900">

                      {paciente.nombres}{" "}
                      {paciente.apellidos}

                    </h1>


                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        activo
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {paciente.estado ||
                        "Activo"}
                    </span>

                  </div>


                  <p className="text-slate-500 mt-2">

                    {paciente.tipoDocumento ||
                      "CC"}{" "}

                    {paciente.documento ||
                      ""}

                    {" · "}

                    {paciente.telefono ||
                      "Sin teléfono"}

                  </p>

                </div>

              </div>


              <div className="flex gap-3 flex-wrap">

                <button
                  type="button"
                  onClick={() =>
                    navegar(
                      `${rutaBase}/editar`
                    )
                  }
                  className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-medium"
                >
                  ✏️ Editar paciente
                </button>


                {activo ? (

                  <button
                    type="button"
                    onClick={
                      desactivarPaciente
                    }
                    className="px-5 py-3 rounded-xl bg-red-50 text-red-700 border border-red-200 font-medium"
                  >
                    Desactivar
                  </button>

                ) : (

                  <button
                    type="button"
                    onClick={
                      activarPaciente
                    }
                    className="px-5 py-3 rounded-xl bg-green-50 text-green-700 border border-green-200 font-medium"
                  >
                    Activar
                  </button>

                )}

              </div>

            </div>

          </div>


          {/* =====================================
              PESTAÑAS
          ===================================== */}

          <div className="border-t border-slate-100 px-6">

            <div className="flex gap-8 overflow-x-auto">

              <button
                type="button"
                onClick={() =>
                  navegar(rutaBase)
                }
                className="py-4 border-b-2 border-cyan-500 text-cyan-600 font-semibold whitespace-nowrap"
              >
                Información
              </button>


              <button
                type="button"
                onClick={() =>
                  navegar(
                    `${rutaBase}/historia-clinica`
                  )
                }
                className="py-4 text-slate-500 hover:text-slate-900 whitespace-nowrap"
              >
                Historia clínica
              </button>


              <button
                type="button"
                onClick={() =>
                  navegar(
                    `${rutaBase}/odontograma`
                  )
                }
                className="py-4 text-slate-500 hover:text-slate-900 whitespace-nowrap"
              >
                Odontograma
              </button>


              <button
                type="button"
                onClick={() =>
                  navegar(
                    `${rutaBase}/tratamientos`
                  )
                }
                className="py-4 text-slate-500 hover:text-slate-900 whitespace-nowrap"
              >
                Tratamientos
              </button>


              <button
                type="button"
                onClick={() =>
                  navegar(
                    `${rutaBase}/citas`
                  )
                }
                className="py-4 text-slate-500 hover:text-slate-900 whitespace-nowrap"
              >
                Citas
              </button>


              <button
                type="button"
                onClick={() =>
                  navegar(
                    `${rutaBase}/pagos`
                  )
                }
                className="py-4 text-slate-500 hover:text-slate-900 whitespace-nowrap"
              >
                Pagos
              </button>


              <button
                type="button"
                onClick={() =>
                  navegar(
                    `${rutaBase}/documentos`
                  )
                }
                className="py-4 text-slate-500 hover:text-slate-900 whitespace-nowrap"
              >
                Documentos
              </button>

            </div>

          </div>

        </div>


        {/* =====================================
            DASHBOARD DEL PACIENTE
        ===================================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">


          <DashboardCard
            titulo="Dientes registrados"
            valor={String(
              dientesRegistrados
            )}
            icono="🦷"
            color="text-cyan-600"
            onClick={() =>
              navegar(
                `${rutaBase}/odontograma`
              )
            }
          />


          <DashboardCard
            titulo="Tratamientos pendientes"
            valor={String(
              tratamientosPendientes
            )}
            icono="🩺"
            color="text-orange-500"
            onClick={() =>
              navegar(
                `${rutaBase}/tratamientos`
              )
            }
          />


          <DashboardCard
            titulo="Citas pendientes"
            valor={String(
              citasPendientes
            )}
            icono="📅"
            color="text-purple-500"
            onClick={() =>
              navegar(
                `${rutaBase}/citas`
              )
            }
          />


          <DashboardCard
            titulo="Total pagado"
            valor={`$${totalPagado.toLocaleString(
              "es-CO"
            )}`}
            icono="💰"
            color="text-green-600"
            onClick={() =>
              navegar(
                `${rutaBase}/pagos`
              )
            }
          />


          <DashboardCard
            titulo="Documentos"
            valor={String(
              documentos.length
            )}
            icono="📄"
            color="text-blue-500"
            onClick={() =>
              navegar(
                `${rutaBase}/documentos`
              )
            }
          />

        </section>


        {/* =====================================
            ACCESOS RÁPIDOS
        ===================================== */}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">


          <QuickCard
            icono="📋"
            titulo="Historia clínica"
            descripcion={
              historia
                ? "Historia registrada"
                : "Sin información registrada"
            }
            onClick={() =>
              navegar(
                `${rutaBase}/historia-clinica`
              )
            }
          />


          <QuickCard
            icono="🦷"
            titulo="Odontograma"
            descripcion={`${dientesRegistrados} piezas registradas`}
            onClick={() =>
              navegar(
                `${rutaBase}/odontograma`
              )
            }
          />


          <QuickCard
            icono="🩺"
            titulo="Tratamientos"
            descripcion={`${tratamientos.length} registrados`}
            onClick={() =>
              navegar(
                `${rutaBase}/tratamientos`
              )
            }
          />


          <QuickCard
            icono="📅"
            titulo="Citas"
            descripcion={`${citas.length} registradas`}
            onClick={() =>
              navegar(
                `${rutaBase}/citas`
              )
            }
          />

        </section>


        {/* =====================================
            INFORMACIÓN PERSONAL
        ===================================== */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 p-6">

          <h2 className="text-xl font-bold">
            Información personal
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-6">
            Datos personales registrados del paciente.
          </p>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <Info
              titulo="Nombres"
              valor={paciente.nombres}
            />

            <Info
              titulo="Apellidos"
              valor={paciente.apellidos}
            />

            <Info
              titulo="Documento"
              valor={`${paciente.tipoDocumento || "CC"} ${paciente.documento || ""}`}
            />

            <Info
              titulo="Fecha de nacimiento"
              valor={
                paciente.fechaNacimiento
                  ? new Date(
                      paciente.fechaNacimiento
                    ).toLocaleDateString(
                      "es-CO"
                    )
                  : ""
              }
            />

            <Info
              titulo="Sexo"
              valor={paciente.sexo}
            />

            <Info
              titulo="Teléfono"
              valor={paciente.telefono}
            />

            <Info
              titulo="Correo electrónico"
              valor={paciente.correo}
            />

            <Info
              titulo="Dirección"
              valor={paciente.direccion}
            />

            <Info
              titulo="Ciudad"
              valor={paciente.ciudad}
            />

          </div>

        </section>


        {/* =====================================
            INFORMACIÓN ADICIONAL
        ===================================== */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 p-6">

          <h2 className="text-xl font-bold">
            Información adicional
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

            <Info
              titulo="Contacto de emergencia"
              valor={
                paciente.contactoEmergencia
              }
            />

            <Info
              titulo="Teléfono de emergencia"
              valor={
                paciente.telefonoEmergencia
              }
            />

            <Info
              titulo="EPS / Aseguradora"
              valor={paciente.eps}
            />

            <Info
              titulo="Ocupación"
              valor={
                paciente.ocupacion
              }
            />

          </div>

        </section>


        {/* =====================================
            INFORMACIÓN CLÍNICA
        ===================================== */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 p-6 mb-10">

          <h2 className="text-xl font-bold">
            Información clínica inicial
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

            <Caja
              titulo="Alergias"
              valor={
                paciente.alergias ||
                "No se registraron alergias."
              }
            />

            <Caja
              titulo="Medicamentos"
              valor={
                paciente.medicamentos ||
                "No se registraron medicamentos."
              }
            />

            <Caja
              titulo="Antecedentes"
              valor={
                paciente.antecedentes ||
                "No se registraron antecedentes."
              }
            />

            <Caja
              titulo="Observaciones"
              valor={
                paciente.observaciones ||
                "No hay observaciones."
              }
            />

          </div>

        </section>

      </div>

    </main>
  );
}


/* =========================================
   TARJETA DASHBOARD
========================================= */

function DashboardCard({
  titulo,
  valor,
  icono,
  color,
  onClick,
}: {
  titulo: string;
  valor: string;
  icono: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:shadow-md hover:border-cyan-300 transition"
    >

      <div className="text-2xl">
        {icono}
      </div>

      <p className="text-sm text-slate-500 mt-3">
        {titulo}
      </p>

      <p
        className={`text-2xl font-bold mt-2 ${color}`}
      >
        {valor}
      </p>

      <p className="text-xs text-slate-400 mt-2">
        Abrir →
      </p>

    </button>
  );
}


/* =========================================
   TARJETA ACCESO RÁPIDO
========================================= */

function QuickCard({
  icono,
  titulo,
  descripcion,
  onClick,
}: {
  icono: string;
  titulo: string;
  descripcion: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:shadow-md hover:border-cyan-300 transition"
    >

      <div className="text-3xl mb-3">
        {icono}
      </div>

      <p className="font-bold text-slate-900">
        {titulo}
      </p>

      <p className="text-sm text-slate-500 mt-1">
        {descripcion}
      </p>

      <p className="text-xs text-cyan-600 mt-3">
        Abrir →
      </p>

    </button>
  );
}


/* =========================================
   INFORMACIÓN
========================================= */

function Info({
  titulo,
  valor,
}: {
  titulo: string;
  valor?: string;
}) {
  return (
    <div>

      <p className="text-sm text-slate-400">
        {titulo}
      </p>

      <p className="font-medium mt-1 text-slate-800">
        {valor || "No registrado"}
      </p>

    </div>
  );
}


/* =========================================
   CAJA
========================================= */

function Caja({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-5">

      <p className="text-sm font-semibold text-slate-700">
        {titulo}
      </p>

      <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">
        {valor}
      </p>

    </div>
  );
}