"use client";

import { useEffect, useMemo, useState } from "react";
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
  diente?: string;
  costo: string;
  abonado: string;
  estado: string;
};

const METODOS = [
  "Efectivo",
  "Transferencia",
  "Tarjeta débito",
  "Tarjeta crédito",
  "Nequi",
  "Daviplata",
  "Otro",
];

const ESTADOS = ["Pagado", "Pendiente", "Anulado"];

const dinero = (valor: number) =>
  valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

export default function PagosPage() {
  const params = useParams();
  const pacienteId = String(params.id);

  const [pagos, setPagos] = useState<Pago[]>([]);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [fecha, setFecha] = useState("");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [metodo, setMetodo] = useState("Efectivo");
  const [estado, setEstado] = useState("Pagado");
  const [referencia, setReferencia] = useState("");
  const [notas, setNotas] = useState("");
  const [tratamientoId, setTratamientoId] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarDatos = () => {
    try {
      const pagosGuardados = localStorage.getItem("pagos-bryan");
      const tratamientosGuardados =
        localStorage.getItem("tratamientos-bryan");

      const todosPagos = pagosGuardados
        ? JSON.parse(pagosGuardados)
        : [];

      const todosTratamientos = tratamientosGuardados
        ? JSON.parse(tratamientosGuardados)
        : [];

      setPagos(
        Array.isArray(todosPagos)
          ? todosPagos.filter(
              (p: Pago) => String(p.pacienteId) === pacienteId
            )
          : []
      );

      setTratamientos(
        Array.isArray(todosTratamientos)
          ? todosTratamientos.filter(
              (t: Tratamiento) =>
                String(t.pacienteId) === pacienteId
            )
          : []
      );
    } catch (error) {
      console.error("Error cargando pagos:", error);
      setPagos([]);
      setTratamientos([]);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [pacienteId]);

  const limpiar = () => {
    setFecha("");
    setConcepto("");
    setMonto("");
    setMetodo("Efectivo");
    setEstado("Pagado");
    setReferencia("");
    setNotas("");
    setTratamientoId("");
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  const nuevoPago = () => {
    const hoy = new Date().toISOString().slice(0, 10);

    setFecha(hoy);
    setConcepto("");
    setMonto("");
    setMetodo("Efectivo");
    setEstado("Pagado");
    setReferencia("");
    setNotas("");
    setTratamientoId("");
    setEditandoId(null);
    setMensaje("");
    setMostrarFormulario(true);
  };

  const editarPago = (pago: Pago) => {
    setEditandoId(pago.id);
    setFecha(pago.fecha);
    setConcepto(pago.concepto);
    setMonto(String(pago.monto));
    setMetodo(pago.metodo);
    setEstado(pago.estado);
    setReferencia(pago.referencia || "");
    setNotas(pago.notas || "");
    setTratamientoId(
      pago.tratamientoId ? String(pago.tratamientoId) : ""
    );
    setMensaje("");
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardarPago = () => {
    const valor = Number(monto);

    if (!fecha || !concepto.trim() || !Number.isFinite(valor) || valor <= 0) {
      alert("Completa fecha, concepto y un monto mayor que cero.");
      return;
    }

    let todos: Pago[] = [];

    try {
      const guardado = localStorage.getItem("pagos-bryan");
      const parsed = guardado ? JSON.parse(guardado) : [];
      todos = Array.isArray(parsed) ? parsed : [];
    } catch {
      todos = [];
    }

    if (editandoId !== null) {
      todos = todos.map((pago) => {
        if (
          pago.id === editandoId &&
          String(pago.pacienteId) === pacienteId
        ) {
          return {
            ...pago,
            pacienteId,
            tratamientoId: tratamientoId
              ? Number(tratamientoId)
              : undefined,
            fecha,
            concepto: concepto.trim(),
            monto: valor,
            metodo,
            estado,
            referencia: referencia.trim(),
            notas: notas.trim(),
          };
        }

        return pago;
      });

      setMensaje("✓ Pago actualizado correctamente.");
    } else {
      const nuevo: Pago = {
        id: Date.now(),
        pacienteId,
        tratamientoId: tratamientoId
          ? Number(tratamientoId)
          : undefined,
        fecha,
        concepto: concepto.trim(),
        monto: valor,
        metodo,
        estado,
        referencia: referencia.trim(),
        notas: notas.trim(),
      };

      todos.push(nuevo);
      setMensaje("✓ Pago registrado correctamente.");
    }

    localStorage.setItem("pagos-bryan", JSON.stringify(todos));
    cargarDatos();
    limpiar();

    setTimeout(() => setMensaje(""), 3500);
  };

  const eliminarPago = (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pago?")) {
      return;
    }

    let todos: Pago[] = [];

    try {
      const guardado = localStorage.getItem("pagos-bryan");
      const parsed = guardado ? JSON.parse(guardado) : [];
      todos = Array.isArray(parsed) ? parsed : [];
    } catch {
      todos = [];
    }

    const nuevos = todos.filter((pago) => pago.id !== id);

    localStorage.setItem("pagos-bryan", JSON.stringify(nuevos));
    cargarDatos();
    setMensaje("✓ Pago eliminado correctamente.");

    setTimeout(() => setMensaje(""), 3000);
  };

  const cambiarEstado = (id: number, nuevoEstado: string) => {
    let todos: Pago[] = [];

    try {
      const guardado = localStorage.getItem("pagos-bryan");
      const parsed = guardado ? JSON.parse(guardado) : [];
      todos = Array.isArray(parsed) ? parsed : [];
    } catch {
      todos = [];
    }

    const actualizados = todos.map((pago) =>
      pago.id === id && String(pago.pacienteId) === pacienteId
        ? { ...pago, estado: nuevoEstado }
        : pago
    );

    localStorage.setItem("pagos-bryan", JSON.stringify(actualizados));
    cargarDatos();
  };

  const totalPagos = useMemo(
    () =>
      pagos
        .filter((p) => p.estado === "Pagado")
        .reduce((sum, p) => sum + Number(p.monto || 0), 0),
    [pagos]
  );

  const totalAbonosIniciales = useMemo(
    () =>
      tratamientos.reduce(
        (sum, t) => sum + Number(t.abonado || 0),
        0
      ),
    [tratamientos]
  );

  const totalCostoTratamientos = useMemo(
    () =>
      tratamientos.reduce(
        (sum, t) => sum + Number(t.costo || 0),
        0
      ),
    [tratamientos]
  );

  const saldoGeneral = Math.max(
    totalCostoTratamientos - totalAbonosIniciales - totalPagos,
    0
  );

  const totalPendiente = pagos
    .filter((p) => p.estado === "Pendiente")
    .reduce((sum, p) => sum + Number(p.monto || 0), 0);

  const pagosFiltrados = pagos
    .filter((p) => {
      const texto = [
        p.concepto,
        p.metodo,
        p.estado,
        p.referencia,
        p.notas,
      ]
        .join(" ")
        .toLowerCase();

      return texto.includes(busqueda.toLowerCase());
    })
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const volverPaciente = () => {
    window.location.href = `/pacientes/${pacienteId}`;
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                💰 Pagos
              </h1>
              <p className="text-slate-500 mt-2">
                Gestiona los pagos del paciente y relaciónalos con sus tratamientos.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                mostrarFormulario ? limpiar() : nuevoPago()
              }
              className="px-5 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600"
            >
              {mostrarFormulario ? "Cerrar formulario" : "+ Registrar pago"}
            </button>
          </div>

          {mensaje && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 font-medium">
              {mensaje}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <p className="text-sm text-slate-500">Costo tratamientos</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {dinero(totalCostoTratamientos)}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-sm text-green-700">Total abonado</p>
              <p className="text-2xl font-bold text-green-800 mt-2">
                {dinero(totalAbonosIniciales + totalPagos)}
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <p className="text-sm text-orange-700">Pagos pendientes</p>
              <p className="text-2xl font-bold text-orange-800 mt-2">
                {dinero(totalPendiente)}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <p className="text-sm text-red-700">Saldo tratamientos</p>
              <p className="text-2xl font-bold text-red-800 mt-2">
                {dinero(saldoGeneral)}
              </p>
            </div>
          </div>

          {mostrarFormulario && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {editandoId !== null ? "Editar pago" : "Registrar pago"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tratamiento relacionado
                  </label>
                  <select
                    value={tratamientoId}
                    onChange={(e) => setTratamientoId(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  >
                    <option value="">
                      Pago general / sin tratamiento específico
                    </option>

                    {tratamientos.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                        {t.diente ? ` — Diente ${t.diente}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Concepto *
                  </label>
                  <input
                    value={concepto}
                    onChange={(e) => setConcepto(e.target.value)}
                    placeholder="Ej. Abono tratamiento"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Monto *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="0"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Método de pago
                  </label>
                  <select
                    value={metodo}
                    onChange={(e) => setMetodo(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  >
                    {METODOS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  >
                    {ESTADOS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Referencia
                  </label>
                  <input
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Número de comprobante"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Notas
                  </label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    rows={4}
                    placeholder="Observaciones del pago..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={limpiar}
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={guardarPago}
                  className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600"
                >
                  {editandoId !== null ? "Guardar cambios" : "Guardar pago"}
                </button>
              </div>
            </div>
          )}

          {pagos.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Buscar pago
              </label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Concepto, método, referencia, estado..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Historial de pagos
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Los pagos de este paciente.
                </p>
              </div>

              <span className="text-sm text-slate-500">
                {pagosFiltrados.length} registro
                {pagosFiltrados.length === 1 ? "" : "s"}
              </span>
            </div>

            {pagosFiltrados.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">💰</div>
                <p className="font-semibold text-slate-700 text-lg">
                  No hay pagos registrados
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Registra un pago para comenzar.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pagosFiltrados.map((pago) => {
                  const tratamiento = tratamientos.find(
                    (t) => t.id === pago.tratamientoId
                  );

                  return (
                    <div
                      key={pago.id}
                      className="border border-slate-200 rounded-2xl p-5 hover:border-cyan-300 transition"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900">
                              {pago.concepto}
                            </h3>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                pago.estado === "Pagado"
                                  ? "bg-green-50 text-green-700"
                                  : pago.estado === "Pendiente"
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {pago.estado}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                              📅 {pago.fecha}
                            </span>

                            <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold">
                              💳 {pago.metodo}
                            </span>

                            {tratamiento && (
                              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                                🩺 {tratamiento.nombre}
                              </span>
                            )}
                          </div>

                          {pago.referencia && (
                            <p className="text-sm text-slate-500 mt-3">
                              Referencia: {pago.referencia}
                            </p>
                          )}

                          {pago.notas && (
                            <div className="mt-3 bg-slate-50 rounded-xl p-3">
                              <p className="text-xs text-slate-400 font-semibold">
                                NOTAS
                              </p>
                              <p className="text-sm text-slate-600 mt-1">
                                {pago.notas}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="lg:text-right">
                          <p className="text-2xl font-bold text-slate-900">
                            {dinero(pago.monto)}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3 lg:justify-end">
                            <select
                              value={pago.estado}
                              onChange={(e) =>
                                cambiarEstado(pago.id, e.target.value)
                              }
                              className="border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white text-slate-900"
                            >
                              {ESTADOS.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() => editarPago(pago)}
                              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                            >
                              ✏️ Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => eliminarPago(pago.id)}
                              className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}