"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  guardarUsuarios,
  obtenerSesion,
  obtenerUsuarios,
  type Rol,
  type Usuario,
} from "@/lib/auth";
import { registrarAuditoria } from "@/lib/auditoria";

type RolEditable = "doctor" | "recepcion";

const nombresRol: Record<Rol, string> = {
  admin: "Administrador",
  doctor: "Doctor",
  recepcion: "Recepción",
};

const permisosPorRol: Record<Rol, string[]> = {
  admin: [
    "Dashboard",
    "Pacientes",
    "Historia clínica",
    "Odontograma",
    "Citas",
    "Tratamientos",
    "Pagos",
    "Inventario",
    "Reportes",
    "Configuración",
    "Usuarios",
    "Documentos",
  ],

  doctor: [
    "Dashboard",
    "Pacientes",
    "Historia clínica",
    "Odontograma",
    "Citas",
    "Tratamientos",
    "Consultar pagos",
    "Documentos",
  ],

  recepcion: [
    "Dashboard",
    "Pacientes",
    "Citas",
    "Pagos",
    "Documentos",
  ],
};

const estadoInicial = {
  nombre: "",
  email: "",
  password: "",
  rol: "doctor" as RolEditable,
  especialidad: "",
  registroProfesional: "",
  telefono: "",
};

export default function UsuariosPage() {
  const router = useRouter();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] =
    useState<Usuario | null>(null);

  const [formulario, setFormulario] = useState(estadoInicial);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== "admin") {
      router.replace("/");
      return;
    }

    setUsuarios(obtenerUsuarios());
  }, [router]);

  const limpiarFormulario = () => {
    setFormulario(estadoInicial);
    setUsuarioEditando(null);
    setMostrarFormulario(false);
    setError("");
  };

  const actualizarCampo = (
    campo: keyof typeof estadoInicial,
    valor: string
  ) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const abrirCrear = () => {
    setFormulario(estadoInicial);
    setUsuarioEditando(null);
    setError("");
    setMostrarFormulario(true);
  };

  const abrirEditar = (usuario: Usuario) => {
    if (usuario.rol === "admin") {
      return;
    }

    setUsuarioEditando(usuario);

    setFormulario({
      nombre: usuario.nombre || "",
      email: usuario.email || "",
      password: "",
      rol:
        usuario.rol === "recepcion"
          ? "recepcion"
          : "doctor",
      especialidad: usuario.especialidad || "",
      registroProfesional:
        usuario.registroProfesional || "",
      telefono: usuario.telefono || "",
    });

    setError("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const guardarUsuario = (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    const nombre = formulario.nombre.trim();
    const email = formulario.email.trim().toLowerCase();
    const password = formulario.password;

    if (!nombre || !email) {
      setError(
        "El nombre y el correo electrónico son obligatorios."
      );
      return;
    }

    if (!usuarioEditando && !password) {
      setError(
        "Debes establecer una contraseña para el nuevo usuario."
      );
      return;
    }

    if (password && password.length < 6) {
      setError(
        "La contraseña debe tener mínimo 6 caracteres."
      );
      return;
    }

    const todos = obtenerUsuarios();

    const correoExiste = todos.some(
      (usuario) =>
        usuario.email.toLowerCase() === email &&
        usuario.id !== usuarioEditando?.id
    );

    if (correoExiste) {
      setError(
        "Ya existe un usuario registrado con ese correo."
      );
      return;
    }

    if (usuarioEditando) {
      const actualizados = todos.map((usuario) => {
        if (usuario.id !== usuarioEditando.id) {
          return usuario;
        }

        return {
          ...usuario,
          nombre,
          email,
          rol: formulario.rol,
          especialidad:
            formulario.rol === "doctor"
              ? formulario.especialidad.trim()
              : "",
          registroProfesional:
            formulario.rol === "doctor"
              ? formulario.registroProfesional.trim()
              : "",
          telefono: formulario.telefono.trim(),
          ...(password
            ? {
                password,
              }
            : {}),
        };
      });

      guardarUsuarios(actualizados);
      setUsuarios(actualizados);

      registrarAuditoria({
        accion: "EDITAR_USUARIO",
        modulo: "Usuarios",
        descripcion: `Actualizó la cuenta de ${nombre}.`,
        referenciaId: usuarioEditando.id,
      });

      setMensaje(
        "Usuario actualizado correctamente."
      );
    } else {
      const nuevoUsuario: Usuario = {
        id: `usuario-${Date.now()}`,
        nombre,
        email,
        password,
        rol: formulario.rol,
        especialidad:
          formulario.rol === "doctor"
            ? formulario.especialidad.trim()
            : "",
        registroProfesional:
          formulario.rol === "doctor"
            ? formulario.registroProfesional.trim()
            : "",
        telefono: formulario.telefono.trim(),
        activo: true,
        fechaCreacion: new Date().toISOString(),
      };

      const actualizados = [
        ...todos,
        nuevoUsuario,
      ];

      guardarUsuarios(actualizados);
      setUsuarios(actualizados);

      registrarAuditoria({
        accion: "CREAR_USUARIO",
        modulo: "Usuarios",
        descripcion: `Creó la cuenta de ${nombre} con rol ${nombresRol[formulario.rol]}.`,
        referenciaId: nuevoUsuario.id,
      });

      setMensaje(
        "Usuario creado correctamente."
      );
    }

    limpiarFormulario();

    setTimeout(() => {
      setMensaje("");
    }, 3500);
  };

  const cambiarEstado = (usuario: Usuario) => {
    if (usuario.rol === "admin") {
      return;
    }

    const actualizados = usuarios.map((item) =>
      item.id === usuario.id
        ? {
            ...item,
            activo: !item.activo,
          }
        : item
    );

    guardarUsuarios(actualizados);
    setUsuarios(actualizados);

    registrarAuditoria({
      accion: usuario.activo
        ? "DESACTIVAR_USUARIO"
        : "ACTIVAR_USUARIO",
      modulo: "Usuarios",
      descripcion: `${
        usuario.activo
          ? "Desactivó"
          : "Activó"
      } la cuenta de ${usuario.nombre}.`,
      referenciaId: usuario.id,
    });

    setMensaje(
      usuario.activo
        ? "Usuario desactivado."
        : "Usuario activado."
    );

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  };

  const eliminarUsuario = (usuario: Usuario) => {
    if (usuario.rol === "admin") {
      alert(
        "La cuenta de administración principal no puede eliminarse."
      );
      return;
    }

    const confirmar = window.confirm(
      `¿Deseas eliminar definitivamente a ${usuario.nombre}?`
    );

    if (!confirmar) {
      return;
    }

    const actualizados = usuarios.filter(
      (item) => item.id !== usuario.id
    );

    guardarUsuarios(actualizados);
    setUsuarios(actualizados);

    registrarAuditoria({
      accion: "ELIMINAR_USUARIO",
      modulo: "Usuarios",
      descripcion: `Eliminó la cuenta de ${usuario.nombre}.`,
      referenciaId: usuario.id,
    });

    setMensaje("Usuario eliminado correctamente.");

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* NAVEGACIÓN */}

        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-cyan-700 hover:text-cyan-900 font-medium mb-5"
        >
          ← Volver al inicio
        </button>

        {/* CONTENEDOR PRINCIPAL */}

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* ENCABEZADO */}

          <header className="p-7 border-b border-slate-200">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <p className="text-sm font-semibold text-cyan-700 uppercase tracking-wide">
                  Administración
                </p>

                <h1 className="text-3xl font-bold text-slate-900 mt-1">
                  Usuarios y permisos
                </h1>

                <p className="text-slate-500 mt-2 max-w-2xl">
                  Administra las cuentas de acceso y controla
                  las funciones disponibles para cada perfil.
                </p>

              </div>

              <button
                type="button"
                onClick={abrirCrear}
                className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"
              >
                Crear usuario
              </button>

            </div>

          </header>

          {/* MENSAJE */}

          {mensaje && (
            <div className="mx-7 mt-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-medium">
              {mensaje}
            </div>
          )}

          {/* FORMULARIO */}

          {mostrarFormulario && (
            <div className="m-7 bg-slate-50 border border-slate-200 rounded-2xl p-6">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {usuarioEditando
                      ? "Editar usuario"
                      : "Crear usuario"}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Los campos marcados con * son obligatorios.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="text-slate-500 hover:text-slate-800"
                >
                  Cerrar
                </button>

              </div>

              <form onSubmit={guardarUsuario}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* NOMBRE */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nombre completo *
                    </label>

                    <input
                      type="text"
                      value={formulario.nombre}
                      onChange={(e) =>
                        actualizarCampo(
                          "nombre",
                          e.target.value
                        )
                      }
                      placeholder="Nombre completo"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* ROL */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tipo de usuario *
                    </label>

                    <select
                      value={formulario.rol}
                      onChange={(e) =>
                        actualizarCampo(
                          "rol",
                          e.target.value
                        )
                      }
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      <option value="doctor">
                        Doctor
                      </option>

                      <option value="recepcion">
                        Recepción
                      </option>
                    </select>
                  </div>

                  {/* CORREO */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Correo electrónico *
                    </label>

                    <input
                      type="email"
                      value={formulario.email}
                      onChange={(e) =>
                        actualizarCampo(
                          "email",
                          e.target.value
                        )
                      }
                      placeholder="correo@clinica.com"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* CONTRASEÑA */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Contraseña{" "}
                      {usuarioEditando
                        ? "(opcional)"
                        : "*"}
                    </label>

                    <input
                      type="password"
                      value={formulario.password}
                      onChange={(e) =>
                        actualizarCampo(
                          "password",
                          e.target.value
                        )
                      }
                      placeholder={
                        usuarioEditando
                          ? "Dejar vacío para conservarla"
                          : "Mínimo 6 caracteres"
                      }
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* TELÉFONO */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Teléfono
                    </label>

                    <input
                      type="tel"
                      value={formulario.telefono}
                      onChange={(e) =>
                        actualizarCampo(
                          "telefono",
                          e.target.value
                        )
                      }
                      placeholder="Número de contacto"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* DATOS DEL DOCTOR */}

                  {formulario.rol === "doctor" && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Especialidad
                        </label>

                        <input
                          type="text"
                          value={formulario.especialidad}
                          onChange={(e) =>
                            actualizarCampo(
                              "especialidad",
                              e.target.value
                            )
                          }
                          placeholder="Odontología general"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Registro profesional
                        </label>

                        <input
                          type="text"
                          value={
                            formulario.registroProfesional
                          }
                          onChange={(e) =>
                            actualizarCampo(
                              "registroProfesional",
                              e.target.value
                            )
                          }
                          placeholder="Número de registro"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                      </div>
                    </>
                  )}

                </div>

                {/* PERMISOS */}

                <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5">

                  <h3 className="font-bold text-slate-900">
                    Permisos del perfil
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Los permisos dependen automáticamente del
                    tipo de usuario.
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">

                    {permisosPorRol[
                      formulario.rol
                    ].map((permiso) => (
                      <span
                        key={permiso}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm border border-slate-200"
                      >
                        {permiso}
                      </span>
                    ))}

                  </div>

                </div>

                {error && (
                  <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                    {error}
                  </div>
                )}

                {/* BOTONES */}

                <div className="flex justify-end gap-3 mt-6">

                  <button
                    type="button"
                    onClick={limpiarFormulario}
                    className="px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
                  >
                    {usuarioEditando
                      ? "Guardar cambios"
                      : "Crear usuario"}
                  </button>

                </div>

              </form>

            </div>
          )}

          {/* LISTADO */}

          <div className="p-7">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Cuentas registradas
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {usuarios.length} usuario
                  {usuarios.length === 1
                    ? ""
                    : "s"} en el sistema.
                </p>
              </div>

            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">

              <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-4 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-500">
                <span>Usuario</span>
                <span>Correo</span>
                <span>Rol</span>
                <span>Estado</span>
                <span>Acciones</span>
              </div>

              <div className="divide-y divide-slate-200">

                {usuarios.map((usuario) => (

                  <div
                    key={usuario.id}
                    className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 items-center px-5 py-5"
                  >

                    {/* USUARIO */}

                    <div>

                      <p className="font-semibold text-slate-900">
                        {usuario.nombre}
                      </p>

                      {usuario.rol === "doctor" &&
                        usuario.especialidad && (
                          <p className="text-sm text-slate-500 mt-1">
                            {usuario.especialidad}
                          </p>
                        )}

                    </div>

                    {/* CORREO */}

                    <div className="text-sm text-slate-600 break-all">
                      {usuario.email}
                    </div>

                    {/* ROL */}

                    <div>

                      <span
                        className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold ${
                          usuario.rol === "admin"
                            ? "bg-slate-900 text-white"
                            : usuario.rol === "doctor"
                            ? "bg-cyan-50 text-cyan-700 border border-cyan-100"
                            : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        }`}
                      >
                        {nombresRol[
                          usuario.rol
                        ]}
                      </span>

                    </div>

                    {/* ESTADO */}

                    <div>

                      <span
                        className={`inline-flex items-center gap-2 text-sm font-semibold ${
                          usuario.activo
                            ? "text-green-700"
                            : "text-slate-500"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            usuario.activo
                              ? "bg-green-500"
                              : "bg-slate-400"
                          }`}
                        />

                        {usuario.activo
                          ? "Activo"
                          : "Inactivo"}
                      </span>

                    </div>

                    {/* ACCIONES */}

                    <div className="flex flex-wrap gap-2">

                      {usuario.rol === "admin" ? (
                        <span className="text-xs text-slate-400">
                          Cuenta principal
                        </span>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              abrirEditar(usuario)
                            }
                            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              cambiarEstado(usuario)
                            }
                            className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                              usuario.activo
                                ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {usuario.activo
                              ? "Desactivar"
                              : "Activar"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              eliminarUsuario(usuario)
                            }
                            className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100"
                          >
                            Eliminar
                          </button>
                        </>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}