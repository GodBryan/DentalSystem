"use client";

import { useEffect, useMemo, useState } from "react";

type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  minimo: number;
  unidad: string;
  precio: number;
  proveedor: string;
};

const inventarioInicial: Producto[] = [
  {
    id: 1,
    nombre: "Guantes de nitrilo",
    categoria: "Bioseguridad",
    cantidad: 120,
    minimo: 50,
    unidad: "cajas",
    precio: 28000,
    proveedor: "Proveedor dental",
  },
  {
    id: 2,
    nombre: "Mascarillas",
    categoria: "Bioseguridad",
    cantidad: 85,
    minimo: 40,
    unidad: "cajas",
    precio: 18000,
    proveedor: "Proveedor dental",
  },
  {
    id: 3,
    nombre: "Resina dental",
    categoria: "Material odontológico",
    cantidad: 12,
    minimo: 5,
    unidad: "unidades",
    precio: 95000,
    proveedor: "Dental Colombia",
  },
  {
    id: 4,
    nombre: "Anestesia local",
    categoria: "Medicamentos",
    cantidad: 8,
    minimo: 10,
    unidad: "cajas",
    precio: 65000,
    proveedor: "Distribuidora médica",
  },
];

export default function InventarioPage() {
  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [nombre, setNombre] = useState("");
  const [categoriaNueva, setCategoriaNueva] =
    useState("Material odontológico");
  const [cantidad, setCantidad] = useState("");
  const [minimo, setMinimo] = useState("");
  const [unidad, setUnidad] = useState("unidades");
  const [precio, setPrecio] = useState("");
  const [proveedor, setProveedor] = useState("");

  useEffect(() => {
    const guardado = localStorage.getItem(
      "dentalSystemInventario"
    );

    if (guardado) {
      try {
        setProductos(JSON.parse(guardado));
      } catch {
        setProductos(inventarioInicial);
      }
    } else {
      setProductos(inventarioInicial);

      localStorage.setItem(
        "dentalSystemInventario",
        JSON.stringify(inventarioInicial)
      );
    }
  }, []);

  const guardarProductos = (nuevos: Producto[]) => {
    setProductos(nuevos);

    localStorage.setItem(
      "dentalSystemInventario",
      JSON.stringify(nuevos)
    );
  };

  const agregarProducto = () => {
    if (!nombre.trim() || !cantidad || !minimo) {
      alert(
        "Completa el nombre, cantidad y stock mínimo."
      );
      return;
    }

    const nuevo: Producto = {
      id: Date.now(),
      nombre: nombre.trim(),
      categoria: categoriaNueva,
      cantidad: Number(cantidad),
      minimo: Number(minimo),
      unidad,
      precio: Number(precio) || 0,
      proveedor,
    };

    guardarProductos([...productos, nuevo]);

    setNombre("");
    setCategoriaNueva("Material odontológico");
    setCantidad("");
    setMinimo("");
    setUnidad("unidades");
    setPrecio("");
    setProveedor("");
    setMostrarFormulario(false);
  };

  const eliminarProducto = (id: number) => {
    const confirmar = window.confirm(
      "¿Deseas eliminar este producto del inventario?"
    );

    if (!confirmar) return;

    guardarProductos(
      productos.filter((producto) => producto.id !== id)
    );
  };

  const cambiarCantidad = (
    id: number,
    cantidad: number
  ) => {
    const nuevos = productos.map((producto) =>
      producto.id === id
        ? {
            ...producto,
            cantidad: Math.max(0, cantidad),
          }
        : producto
    );

    guardarProductos(nuevos);
  };

  const categorias = [
    "Todas",
    ...Array.from(
      new Set(productos.map((producto) => producto.categoria))
    ),
  ];

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const coincideBusqueda =
        `${producto.nombre} ${producto.categoria} ${producto.proveedor}`
          .toLowerCase()
          .includes(busqueda.toLowerCase());

      const coincideCategoria =
        categoria === "Todas" ||
        producto.categoria === categoria;

      return coincideBusqueda && coincideCategoria;
    });
  }, [productos, busqueda, categoria]);

  const productosBajoStock = productos.filter(
    (producto) => producto.cantidad <= producto.minimo
  );

  const valorInventario = productos.reduce(
    (total, producto) =>
      total + producto.cantidad * producto.precio,
    0
  );

  return (
    <main className="min-h-screen bg-slate-100">

      <div className="p-8 max-w-7xl mx-auto">

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


        {/* CABECERA */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-7">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>

                <h1 className="text-3xl font-bold text-slate-900">
                  📦 Inventario
                </h1>

                <p className="text-slate-500 mt-2">
                  Controla materiales, medicamentos y suministros de la clínica.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setMostrarFormulario(
                    !mostrarFormulario
                  )
                }
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
              >
                {mostrarFormulario
                  ? "Cerrar"
                  : "+ Nuevo producto"}
              </button>

            </div>

          </div>


          {/* RESUMEN */}

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-slate-100">

            <div className="p-5">

              <p className="text-sm text-slate-500">
                Productos
              </p>

              <p className="text-3xl font-bold mt-1">
                {productos.length}
              </p>

            </div>

            <div className="p-5 border-t md:border-t-0 md:border-l border-slate-100">

              <p className="text-sm text-slate-500">
                Bajo stock
              </p>

              <p className="text-3xl font-bold text-orange-500 mt-1">
                {productosBajoStock.length}
              </p>

            </div>

            <div className="p-5 border-t md:border-t-0 md:border-l border-slate-100">

              <p className="text-sm text-slate-500">
                Valor del inventario
              </p>

              <p className="text-2xl font-bold text-green-600 mt-1">
                ${valorInventario.toLocaleString("es-CO")}
              </p>

            </div>

          </div>

        </div>


        {/* FORMULARIO */}

        {mostrarFormulario && (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 p-7">

            <h2 className="text-xl font-bold mb-6">
              Nuevo producto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              <div className="lg:col-span-2">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nombre *
                </label>

                <input
                  value={nombre}
                  onChange={(e) =>
                    setNombre(e.target.value)
                  }
                  placeholder="Ej. Resina dental"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                />

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Categoría
                </label>

                <select
                  value={categoriaNueva}
                  onChange={(e) =>
                    setCategoriaNueva(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                >
                  <option>
                    Material odontológico
                  </option>
                  <option>
                    Bioseguridad
                  </option>
                  <option>
                    Medicamentos
                  </option>
                  <option>
                    Instrumental
                  </option>
                  <option>
                    Limpieza
                  </option>
                  <option>
                    Oficina
                  </option>
                  <option>
                    Otro
                  </option>
                </select>

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cantidad *
                </label>

                <input
                  type="number"
                  min="0"
                  value={cantidad}
                  onChange={(e) =>
                    setCantidad(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                />

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Stock mínimo *
                </label>

                <input
                  type="number"
                  min="0"
                  value={minimo}
                  onChange={(e) =>
                    setMinimo(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                />

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Unidad
                </label>

                <select
                  value={unidad}
                  onChange={(e) =>
                    setUnidad(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                >
                  <option>unidades</option>
                  <option>cajas</option>
                  <option>paquetes</option>
                  <option>litros</option>
                  <option>kilogramos</option>
                </select>

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Precio unitario
                </label>

                <input
                  type="number"
                  min="0"
                  value={precio}
                  onChange={(e) =>
                    setPrecio(e.target.value)
                  }
                  placeholder="0"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                />

              </div>


              <div className="lg:col-span-2">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Proveedor
                </label>

                <input
                  value={proveedor}
                  onChange={(e) =>
                    setProveedor(e.target.value)
                  }
                  placeholder="Nombre del proveedor"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
                />

              </div>

            </div>


            <div className="flex justify-end mt-6">

              <button
                type="button"
                onClick={agregarProducto}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
              >
                Guardar producto
              </button>

            </div>

          </div>

        )}


        {/* FILTROS */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 p-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Buscar
              </label>

              <input
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                placeholder="Producto, categoría o proveedor..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
              />

            </div>


            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Categoría
              </label>

              <select
                value={categoria}
                onChange={(e) =>
                  setCategoria(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900"
              >

                {categorias.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}

              </select>

            </div>

          </div>

        </div>


        {/* TABLA */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 overflow-hidden">

          <div className="p-6 border-b border-slate-100">

            <h2 className="text-xl font-bold">
              Productos
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {productosFiltrados.length} productos encontrados.
            </p>

          </div>


          {productosFiltrados.length === 0 ? (

            <div className="p-12 text-center">

              <div className="text-5xl mb-4">
                📦
              </div>

              <p className="font-semibold text-slate-700">
                No hay productos
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Producto
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Categoría
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Stock
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Precio
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Proveedor
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                      Acción
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {productosFiltrados.map((producto) => {

                    const bajoStock =
                      producto.cantidad <=
                      producto.minimo;

                    return (

                      <tr
                        key={producto.id}
                        className="hover:bg-slate-50"
                      >

                        <td className="px-6 py-5">

                          <p className="font-semibold text-slate-900">
                            {producto.nombre}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            ID #{producto.id}
                          </p>

                        </td>


                        <td className="px-6 py-5">

                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                            {producto.categoria}
                          </span>

                        </td>


                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <input
                              type="number"
                              min="0"
                              value={producto.cantidad}
                              onChange={(e) =>
                                cambiarCantidad(
                                  producto.id,
                                  Number(e.target.value)
                                )
                              }
                              className={`w-20 border rounded-lg px-3 py-2 text-center font-semibold ${
                                bajoStock
                                  ? "border-orange-300 text-orange-600 bg-orange-50"
                                  : "border-slate-300 text-slate-700"
                              }`}
                            />

                            <span className="text-xs text-slate-500">
                              {producto.unidad}
                            </span>

                          </div>

                          {bajoStock && (

                            <p className="text-xs text-orange-600 mt-2 font-medium">
                              ⚠️ Bajo stock
                            </p>

                          )}

                        </td>


                        <td className="px-6 py-5">

                          <p className="font-medium">
                            $
                            {producto.precio.toLocaleString(
                              "es-CO"
                            )}
                          </p>

                        </td>


                        <td className="px-6 py-5">

                          <p className="text-sm text-slate-600">
                            {producto.proveedor ||
                              "Sin proveedor"}
                          </p>

                        </td>


                        <td className="px-6 py-5 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              eliminarProducto(
                                producto.id
                              )
                            }
                            className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
                          >
                            Eliminar
                          </button>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}
