"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Pago = {
  id: number;
  pacienteId: string;
  tratamientoId?: number;
  fecha: string;
  concepto: string;
  monto: number;
  metodo: string;
  estado: string;
  referencia: string;
  notas: string;
};

type Tratamiento = {
  id: number;
  pacienteId: string;
  nombre: string;
  diente: string;
  estado: string;
  costo: string;
  abonado: string;
  fecha: string;
  profesional: string;
  descripcion: string;
  observaciones: string;
};

const estados = [
  "Pendiente",
  "En proceso",
  "Completado",
  "Cancelado",
];

export default function TratamientosPage() {
  const params = useParams();
  const pacienteId = String(params.id);

  const [tratamientos, setTratamientos] =
    useState<Tratamiento[]>([]);

  const [pagos, setPagos] =
    useState<Pago[]>([]);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [nombre, setNombre] = useState("");
  const [diente, setDiente] = useState("");
  const [estado, setEstado] =
    useState("Pendiente");

  const [costo, setCosto] = useState("");
  const [abonado, setAbonado] = useState("");
  const [fecha, setFecha] = useState("");
  const [profesional, setProfesional] =
    useState("");

  const [descripcion, setDescripcion] =
    useState("");

  const [observaciones, setObservaciones] =
    useState("");

  const [busqueda, setBusqueda] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  /* =====================================================
     CARGAR TRATAMIENTOS
  ===================================================== */

  useEffect(() => {
    cargarTratamientos();
    cargarPagos();
  }, [pacienteId]);

  const cargarTratamientos = () => {
    try {
      const guardado =
        localStorage.getItem(
          "tratamientos-bryan"
        );

      if (!guardado) {
        setTratamientos([]);
        return;
      }

      const todos = JSON.parse(guardado);

      if (!Array.isArray(todos)) {
        setTratamientos([]);
        return;
      }

      const delPaciente = todos.filter(
        (tratamiento: Tratamiento) =>
          String(tratamiento.pacienteId) ===
          pacienteId
      );

      setTratamientos(delPaciente);
    } catch (error) {
      console.error(
        "Error cargando tratamientos:",
        error
      );

      setTratamientos([]);
    }
  };


  const cargarPagos = () => {
    try {
      const guardado =
        localStorage.getItem("pagos-bryan");

      if (!guardado) {
        setPagos([]);
        return;
      }

      const todos = JSON.parse(guardado);

      if (!Array.isArray(todos)) {
        setPagos([]);
        return;
      }

      const delPaciente = todos.filter(
        (pago: Pago) =>
          String(pago.pacienteId) === pacienteId
      );

      setPagos(delPaciente);
    } catch (error) {
      console.error(
        "Error cargando pagos:",
        error
      );
      setPagos([]);
    }
  };


  /* =====================================================
     ABONADO REAL DEL TRATAMIENTO
     Abono inicial + pagos relacionados PAGADOS.
  ===================================================== */

  const calcularAbonadoReal = (
    tratamiento: Tratamiento
  ) => {
    const abonoInicial =
      Number(tratamiento.abonado) || 0;

    const pagosRelacionados =
      pagos
        .filter(
          (pago) =>
            pago.tratamientoId === tratamiento.id &&
            pago.estado === "Pagado"
        )
        .reduce(
          (total, pago) =>
            total + (Number(pago.monto) || 0),
          0
        );

    return abonoInicial + pagosRelacionados;
  };


  /* =====================================================
     SALDO REAL DEL TRATAMIENTO
  ===================================================== */

  const calcularSaldoReal = (
    tratamiento: Tratamiento
  ) => {
    const costo =
      Number(tratamiento.costo) || 0;

    return Math.max(
      costo - calcularAbonadoReal(tratamiento),
      0
    );
  };


  /* =====================================================
     LIMPIAR FORMULARIO
  ===================================================== */

  const limpiarFormulario = () => {
    setNombre("");
    setDiente("");
    setEstado("Pendiente");
    setCosto("");
    setAbonado("");
    setFecha("");
    setProfesional("");
    setDescripcion("");
    setObservaciones("");

    setEditandoId(null);
    setMostrarFormulario(false);
  };


  /* =====================================================
     NUEVO TRATAMIENTO
  ===================================================== */

  const nuevoTratamiento = () => {
    setEditandoId(null);

    setNombre("");
    setDiente("");
    setEstado("Pendiente");
    setCosto("");
    setAbonado("");
    setFecha("");
    setProfesional("");
    setDescripcion("");
    setObservaciones("");

    setMensaje("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =====================================================
     EDITAR TRATAMIENTO
  ===================================================== */

  const editarTratamiento = (
    tratamiento: Tratamiento
  ) => {
    setEditandoId(tratamiento.id);

    setNombre(tratamiento.nombre);
    setDiente(tratamiento.diente);
    setEstado(tratamiento.estado);
    setCosto(tratamiento.costo);
    setAbonado(tratamiento.abonado);
    setFecha(tratamiento.fecha);
    setProfesional(
      tratamiento.profesional
    );
    setDescripcion(
      tratamiento.descripcion
    );
    setObservaciones(
      tratamiento.observaciones
    );

    setMensaje("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =====================================================
     CALCULAR SALDO
  ===================================================== */

  const calcularSaldo = (
    costo: string,
    abonado: string
  ) => {
    const total =
      Number(costo) || 0;

    const pagado =
      Number(abonado) || 0;

    return Math.max(
      total - pagado,
      0
    );
  };


  /* =====================================================
     GUARDAR TRATAMIENTO
  ===================================================== */

  const guardarTratamiento = () => {
    if (!nombre.trim()) {
      alert(
        "Escribe el nombre del tratamiento."
      );
      return;
    }

    const costoNumero =
      Number(costo) || 0;

    const abonadoNumero =
      Number(abonado) || 0;

    if (
      abonadoNumero > costoNumero &&
      costoNumero > 0
    ) {
      alert(
        "El valor abonado no puede ser mayor que el costo total."
      );
      return;
    }

    let todos: Tratamiento[] = [];

    try {
      const guardado =
        localStorage.getItem(
          "tratamientos-bryan"
        );

      todos = guardado
        ? JSON.parse(guardado)
        : [];

      if (!Array.isArray(todos)) {
        todos = [];
      }
    } catch {
      todos = [];
    }


    /* =================================================
       EDITAR
    ================================================= */

    if (editandoId !== null) {
      const actualizados =
        todos.map((tratamiento) => {

          if (
            tratamiento.id ===
              editandoId &&
            String(
              tratamiento.pacienteId
            ) === pacienteId
          ) {
            return {
              ...tratamiento,

              pacienteId,

              nombre:
                nombre.trim(),

              diente:
                diente.trim(),

              estado,

              costo,

              abonado,

              fecha,

              profesional:
                profesional.trim(),

              descripcion:
                descripcion.trim(),

              observaciones:
                observaciones.trim(),
            };
          }

          return tratamiento;
        });

      localStorage.setItem(
        "tratamientos-bryan",
        JSON.stringify(actualizados)
      );

      const delPaciente =
        actualizados.filter(
          (tratamiento) =>
            String(
              tratamiento.pacienteId
            ) === pacienteId
        );

      setTratamientos(
        delPaciente
      );

      setMensaje(
        "✓ Tratamiento actualizado correctamente."
      );

    } else {

      /* ===============================================
         NUEVO
      =============================================== */

      const nuevo: Tratamiento = {
        id: Date.now(),
        pacienteId,

        nombre:
          nombre.trim(),

        diente:
          diente.trim(),

        estado,

        costo,

        abonado,

        fecha,

        profesional:
          profesional.trim(),

        descripcion:
          descripcion.trim(),

        observaciones:
          observaciones.trim(),
      };

      const nuevosTratamientos = [
        ...todos,
        nuevo,
      ];

      localStorage.setItem(
        "tratamientos-bryan",
        JSON.stringify(
          nuevosTratamientos
        )
      );

      const delPaciente =
        nuevosTratamientos.filter(
          (tratamiento) =>
            String(
              tratamiento.pacienteId
            ) === pacienteId
        );

      setTratamientos(
        delPaciente
      );

      setMensaje(
        "✓ Nuevo tratamiento guardado correctamente."
      );
    }


    limpiarFormulario();

    setTimeout(() => {
      setMensaje("");
    }, 4000);
  };


  /* =====================================================
     ELIMINAR
  ===================================================== */

  const eliminarTratamiento = (
    id: number
  ) => {
    const confirmar =
      window.confirm(
        "¿Deseas eliminar este tratamiento?"
      );

    if (!confirmar) {
      return;
    }

    try {
      const guardado =
        localStorage.getItem(
          "tratamientos-bryan"
        );

      const todos: Tratamiento[] =
        guardado
          ? JSON.parse(guardado)
          : [];

      const nuevosTodos =
        todos.filter(
          (tratamiento) =>
            tratamiento.id !== id
        );

      localStorage.setItem(
        "tratamientos-bryan",
        JSON.stringify(
          nuevosTodos
        )
      );

      setTratamientos(
        nuevosTodos.filter(
          (tratamiento) =>
            String(
              tratamiento.pacienteId
            ) === pacienteId
        )
      );

      setMensaje(
        "✓ Tratamiento eliminado."
      );

      setTimeout(() => {
        setMensaje("");
      }, 3000);

    } catch (error) {
      console.error(
        "Error eliminando tratamiento:",
        error
      );
    }
  };


  /* =====================================================
     FILTRO
  ===================================================== */

  const tratamientosFiltrados =
    tratamientos.filter(
      (tratamiento) => {

        const texto =
          `
          ${tratamiento.nombre}
          ${tratamiento.diente}
          ${tratamiento.estado}
          ${tratamiento.profesional}
          ${tratamiento.descripcion}
          ${tratamiento.observaciones}
          `.toLowerCase();

        return texto.includes(
          busqueda.toLowerCase()
        );
      }
    );


  /* =====================================================
     TOTALES
  ===================================================== */

  const totalTratamientos =
    tratamientos.reduce(
      (total, tratamiento) =>
        total +
        (Number(
          tratamiento.costo
        ) || 0),
      0
    );

  const totalAbonado =
    tratamientos.reduce(
      (total, tratamiento) =>
        total + calcularAbonadoReal(tratamiento),
      0
    );

  const saldoTotal =
    Math.max(
      totalTratamientos -
        totalAbonado,
      0
    );


  /* =====================================================
     FORMATO DINERO
  ===================================================== */

  const dinero = (
    valor: number
  ) => {
    return valor.toLocaleString(
      "es-CO",
      {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }
    );
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

        {/* VOLVER */}

        <button
          type="button"
          onClick={
            volverPaciente
          }
          className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
        >
          ← Volver al paciente
        </button>


        {/* =================================================
            CONTENEDOR PRINCIPAL
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mt-5">


          {/* =================================================
              ENCABEZADO
          ================================================= */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                🩺 Tratamientos
              </h1>

              <p className="text-slate-500 mt-2">
                Gestiona los tratamientos odontológicos del paciente.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                mostrarFormulario
                  ? limpiarFormulario()
                  : nuevoTratamiento()
              }
              className="px-5 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition"
            >
              {mostrarFormulario
                ? "Cerrar formulario"
                : "+ Nuevo tratamiento"}
            </button>

          </div>


          {/* MENSAJE */}

          {mensaje && (

            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 font-medium">
              {mensaje}
            </div>

          )}


          {/* =================================================
              RESUMEN FINANCIERO
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">

              <p className="text-sm text-slate-500">
                Costo total
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {dinero(
                  totalTratamientos
                )}
              </p>

            </div>


            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">

              <p className="text-sm text-green-700">
                Total abonado
              </p>

              <p className="text-2xl font-bold text-green-800 mt-1">
                {dinero(
                  totalAbonado
                )}
              </p>

            </div>


            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">

              <p className="text-sm text-orange-700">
                Saldo pendiente
              </p>

              <p className="text-2xl font-bold text-orange-800 mt-1">
                {dinero(
                  saldoTotal
                )}
              </p>

            </div>

          </div>


          {/* =================================================
              FORMULARIO
          ================================================= */}

          {mostrarFormulario && (

            <div className="border border-slate-200 rounded-2xl p-6 mb-8 bg-slate-50">

              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {editandoId !== null
                  ? "Editar tratamiento"
                  : "Nuevo tratamiento"}
              </h2>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                {/* NOMBRE */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tratamiento *
                  </label>

                  <input
                    value={nombre}
                    onChange={(e) =>
                      setNombre(
                        e.target.value
                      )
                    }
                    placeholder="Ej. Restauración dental"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>


                {/* DIENTE */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Diente
                  </label>

                  <input
                    value={diente}
                    onChange={(e) =>
                      setDiente(
                        e.target.value
                      )
                    }
                    placeholder="Ej. 16"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>


                {/* ESTADO */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Estado
                  </label>

                  <select
                    value={estado}
                    onChange={(e) =>
                      setEstado(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >

                    {estados.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                </div>


                {/* FECHA */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Fecha
                  </label>

                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) =>
                      setFecha(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>


                {/* COSTO */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Costo total
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={costo}
                    onChange={(e) =>
                      setCosto(
                        e.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>


                {/* ABONADO */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Abono inicial
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={abonado}
                    onChange={(e) =>
                      setAbonado(
                        e.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>


                {/* SALDO */}

                <div className="md:col-span-2">

                  <div className="bg-white border border-slate-200 rounded-xl p-4">

                    <p className="text-sm text-slate-500">
                      Saldo pendiente
                    </p>

                    <p className="text-2xl font-bold text-orange-600 mt-1">
                      {dinero(
                        calcularSaldo(
                          costo,
                          abonado
                        )
                      )}
                    </p>

                  </div>

                </div>


                {/* PROFESIONAL */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Profesional
                  </label>

                  <input
                    value={
                      profesional
                    }
                    onChange={(e) =>
                      setProfesional(
                        e.target.value
                      )
                    }
                    placeholder="Nombre del odontólogo"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>


                {/* DESCRIPCIÓN */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Descripción
                  </label>

                  <textarea
                    value={
                      descripcion
                    }
                    onChange={(e) =>
                      setDescripcion(
                        e.target.value
                      )
                    }
                    rows={5}
                    placeholder="Detalles del tratamiento, materiales, procedimiento, etc."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>


                {/* OBSERVACIONES */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Observaciones
                  </label>

                  <textarea
                    value={
                      observaciones
                    }
                    onChange={(e) =>
                      setObservaciones(
                        e.target.value
                      )
                    }
                    rows={5}
                    placeholder="Observaciones, evolución, recomendaciones o información adicional."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>

              </div>


              {/* BOTONES */}

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={
                    limpiarFormulario
                  }
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>


                <button
                  type="button"
                  onClick={
                    guardarTratamiento
                  }
                  className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600"
                >
                  {editandoId !== null
                    ? "Guardar cambios"
                    : "Guardar tratamiento"}
                </button>

              </div>

            </div>

          )}


          {/* =================================================
              BUSCADOR
          ================================================= */}

          {tratamientos.length > 0 && (

            <div className="mb-6">

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Buscar tratamiento
              </label>

              <input
                type="text"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
                placeholder="Nombre, diente, estado, profesional..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />

            </div>

          )}


          {/* =================================================
              LISTA
          ================================================= */}

          <div>

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Tratamientos registrados
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Historial de tratamientos del paciente.
                </p>

              </div>


              <span className="text-sm text-slate-500">
                {tratamientosFiltrados.length}{" "}
                tratamiento
                {tratamientosFiltrados.length !==
                1
                  ? "s"
                  : ""}
              </span>

            </div>


            {tratamientosFiltrados.length ===
            0 ? (

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">

                <div className="text-5xl mb-4">
                  🩺
                </div>

                <p className="font-semibold text-slate-700 text-lg">
                  {tratamientos.length ===
                  0
                    ? "No hay tratamientos registrados"
                    : "No encontramos tratamientos"}
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  {tratamientos.length ===
                  0
                    ? 'Pulsa "Nuevo tratamiento" para agregar el primero.'
                    : "Prueba con otra búsqueda."}
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {tratamientosFiltrados.map(
                  (tratamiento) => {

                    const costoNumero =
                      Number(
                        tratamiento.costo
                      ) || 0;

                    const abonadoNumero =
                      calcularAbonadoReal(
                        tratamiento
                      );

                    const saldo =
                      calcularSaldoReal(
                        tratamiento
                      );

                    return (

                      <div
                        key={
                          tratamiento.id
                        }
                        className="border border-slate-200 rounded-2xl p-6 hover:border-cyan-300 hover:shadow-sm transition"
                      >

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">


                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-3">

                              <h3 className="text-xl font-bold text-slate-900">
                                {
                                  tratamiento.nombre
                                }
                              </h3>


                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  tratamiento.estado ===
                                  "Completado"
                                    ? "bg-green-50 text-green-700"
                                    : tratamiento.estado ===
                                      "Cancelado"
                                    ? "bg-red-50 text-red-700"
                                    : tratamiento.estado ===
                                      "En proceso"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-orange-50 text-orange-700"
                                }`}
                              >
                                {
                                  tratamiento.estado
                                }
                              </span>

                            </div>


                            <div className="flex flex-wrap gap-2 mt-3">

                              {tratamiento.diente && (

                                <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold">
                                  🦷 Diente{" "}
                                  {
                                    tratamiento.diente
                                  }
                                </span>

                              )}


                              {tratamiento.fecha && (

                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                                  📅{" "}
                                  {
                                    tratamiento.fecha
                                  }
                                </span>

                              )}


                              {tratamiento.profesional && (

                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                                  👨‍⚕️{" "}
                                  {
                                    tratamiento.profesional
                                  }
                                </span>

                              )}

                            </div>


                            {/* DESCRIPCIÓN */}

                            {tratamiento.descripcion && (

                              <div className="mt-5 bg-slate-50 rounded-xl p-4">

                                <p className="text-xs font-semibold text-slate-400 mb-1">
                                  DESCRIPCIÓN
                                </p>

                                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                  {
                                    tratamiento.descripcion
                                  }
                                </p>

                              </div>

                            )}


                            {/* OBSERVACIONES */}

                            {tratamiento.observaciones && (

                              <div className="mt-3 bg-slate-50 rounded-xl p-4">

                                <p className="text-xs font-semibold text-slate-400 mb-1">
                                  OBSERVACIONES
                                </p>

                                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                  {
                                    tratamiento.observaciones
                                  }
                                </p>

                              </div>

                            )}

                          </div>


                          {/* =================================================
                              INFORMACIÓN ECONÓMICA
                          ================================================= */}

                          <div className="lg:min-w-[250px]">

                            <div className="bg-slate-50 rounded-xl p-4">

                              <div className="flex justify-between gap-5">

                                <span className="text-sm text-slate-500">
                                  Costo
                                </span>

                                <span className="font-bold text-slate-900">
                                  {dinero(
                                    costoNumero
                                  )}
                                </span>

                              </div>


                              <div className="flex justify-between gap-5 mt-2">

                                <span className="text-sm text-green-600">
                                  Abonado
                                </span>

                                <span className="font-bold text-green-700">
                                  {dinero(
                                    abonadoNumero
                                  )}
                                </span>

                              </div>


                              {pagos.some(
                                (pago) =>
                                  pago.tratamientoId === tratamiento.id &&
                                  pago.estado === "Pagado"
                              ) && (
                                <p className="text-xs text-green-600 mt-1">
                                  Incluye pagos registrados en Pagos.
                                </p>
                              )}

                              <div className="border-t border-slate-200 my-3" />


                              <div className="flex justify-between gap-5">

                                <span className="text-sm text-orange-600">
                                  Saldo
                                </span>

                                <span className="font-bold text-orange-700">
                                  {dinero(
                                    saldo
                                  )}
                                </span>

                              </div>

                            </div>


                            {/* ACCIONES */}

                            <div className="flex justify-end gap-2 mt-3">

                              <button
                                type="button"
                                onClick={() =>
                                  editarTratamiento(
                                    tratamiento
                                  )
                                }
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                              >
                                ✏️ Editar
                              </button>


                              <button
                                type="button"
                                onClick={() =>
                                  eliminarTratamiento(
                                    tratamiento.id
                                  )
                                }
                                className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100"
                              >
                                🗑️ Eliminar
                              </button>

                            </div>

                          </div>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </main>
  );
}