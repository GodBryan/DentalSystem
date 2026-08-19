export type Rol = "admin" | "doctor" | "recepcion";

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  especialidad?: string;
  registroProfesional?: string;
  telefono?: string;
  activo: boolean;
  fechaCreacion: string;
};

export const AUTH_USER_KEY = "dentalSystemUsuarios";
export const AUTH_SESSION_KEY = "dentalSystemSesion";

/*
|--------------------------------------------------------------------------
| PERMISOS
|--------------------------------------------------------------------------
|
| Estos son los permisos generales de cada rol.
|
*/

export const PERMISOS: Record<Rol, string[]> = {
  admin: [
    "dashboard",
    "pacientes",
    "historia",
    "odontograma",
    "citas",
    "tratamientos",
    "pagos",
    "inventario",
    "reportes",
    "configuracion",
    "usuarios",
    "documentos",
    "auditoria",
  ],

  doctor: [
    "dashboard",
    "pacientes",
    "historia",
    "odontograma",
    "citas",
    "tratamientos",
    "pagos_ver",
    "documentos",
  ],

  recepcion: [
    "dashboard",
    "pacientes",
    "citas",
    "pagos",
    "documentos",
  ],
};


/*
|--------------------------------------------------------------------------
| ADMINISTRADOR PRINCIPAL
|--------------------------------------------------------------------------
|
| Esta es la única cuenta administrativa inicial.
|
*/

const ADMIN_INICIAL: Usuario = {
  id: "admin-principal",
  nombre: "Administrador principal",
  email: "admin@dentalsystem.local",
  password: "Admin123!",
  rol: "admin",
  activo: true,
  fechaCreacion: new Date().toISOString(),
};


/*
|--------------------------------------------------------------------------
| INICIALIZAR USUARIOS
|--------------------------------------------------------------------------
*/

export function inicializarUsuarios(): Usuario[] {
  if (typeof window === "undefined") {
    return [];
  }

  const guardado = localStorage.getItem(
    AUTH_USER_KEY
  );

  if (guardado) {
    try {
      const usuarios = JSON.parse(guardado);

      if (
        Array.isArray(usuarios) &&
        usuarios.length > 0
      ) {
        return usuarios;
      }
    } catch {
      // Si el contenido está corrupto,
      // se reconstruirá la cuenta principal.
    }
  }

  const usuariosIniciales = [
    ADMIN_INICIAL,
  ];

  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify(usuariosIniciales)
  );

  return usuariosIniciales;
}


/*
|--------------------------------------------------------------------------
| OBTENER USUARIOS
|--------------------------------------------------------------------------
*/

export function obtenerUsuarios(): Usuario[] {
  if (typeof window === "undefined") {
    return [];
  }

  inicializarUsuarios();

  try {
    const datos = localStorage.getItem(
      AUTH_USER_KEY
    );

    const usuarios = datos
      ? JSON.parse(datos)
      : [];

    return Array.isArray(usuarios)
      ? usuarios
      : [];
  } catch {
    return [];
  }
}


/*
|--------------------------------------------------------------------------
| GUARDAR USUARIOS
|--------------------------------------------------------------------------
*/

export function guardarUsuarios(
  usuarios: Usuario[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify(usuarios)
  );
}


/*
|--------------------------------------------------------------------------
| SESIÓN ACTUAL
|--------------------------------------------------------------------------
*/

export function obtenerSesion(): Usuario | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const datos = localStorage.getItem(
      AUTH_SESSION_KEY
    );

    if (!datos) {
      return null;
    }

    const usuario = JSON.parse(datos);

    if (!usuario) {
      return null;
    }

    return usuario;
  } catch {
    return null;
  }
}


/*
|--------------------------------------------------------------------------
| INICIAR SESIÓN
|--------------------------------------------------------------------------
*/

export function iniciarSesion(
  usuario: Usuario
) {
  if (typeof window === "undefined") {
    return;
  }

  /*
   * Guardamos solamente los datos necesarios
   * para mantener la sesión.
   */

  const sesion: Usuario = {
    ...usuario,
  };

  localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify(sesion)
  );
}


/*
|--------------------------------------------------------------------------
| CERRAR SESIÓN
|--------------------------------------------------------------------------
*/

export function cerrarSesion() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    AUTH_SESSION_KEY
  );
}


/*
|--------------------------------------------------------------------------
| COMPROBAR PERMISO
|--------------------------------------------------------------------------
*/

export function tienePermiso(
  rol: Rol,
  permiso: string
): boolean {
  return (
    PERMISOS[rol]?.includes(permiso) ??
    false
  );
}


/*
|--------------------------------------------------------------------------
| RUTAS ADMINISTRATIVAS
|--------------------------------------------------------------------------
*/

const RUTAS_SOLO_ADMIN = [
  "/admin",
  "/inventario",
  "/reportes",
  "/configuracion",
];


/*
|--------------------------------------------------------------------------
| RUTAS CLÍNICAS
|--------------------------------------------------------------------------
*/

const RUTAS_SOLO_DOCTOR = [
  "/historias-clinicas",
  "/odontograma",
  "/tratamientos",
];


/*
|--------------------------------------------------------------------------
| RUTAS DE PAGOS
|--------------------------------------------------------------------------
*/

const RUTA_PAGOS = "/pagos";


/*
|--------------------------------------------------------------------------
| RUTAS DE CITAS
|--------------------------------------------------------------------------
*/

const RUTA_CITAS = "/agenda";


/*
|--------------------------------------------------------------------------
| RUTAS DE PACIENTES
|--------------------------------------------------------------------------
*/

const RUTA_PACIENTES = "/pacientes";


/*
|--------------------------------------------------------------------------
| RUTAS DE DOCUMENTOS
|--------------------------------------------------------------------------
*/

const RUTAS_DOCUMENTOS = [
  "/documentos",
  "/impresion",
];


/*
|--------------------------------------------------------------------------
| COMPROBAR SI UNA RUTA EMPIEZA POR ALGUNA
| DE LAS RUTAS INDICADAS
|--------------------------------------------------------------------------
*/

function coincideRuta(
  ruta: string,
  rutas: string[]
): boolean {
  return rutas.some(
    (rutaBase) =>
      ruta === rutaBase ||
      ruta.startsWith(`${rutaBase}/`)
  );
}


/*
|--------------------------------------------------------------------------
| CONTROL DE ACCESO POR RUTA
|--------------------------------------------------------------------------
*/

export function rutaPermitida(
  rol: Rol,
  ruta: string
): boolean {

  /*
   * ADMINISTRADOR
   *
   * El administrador tiene acceso completo.
   */

  if (rol === "admin") {
    return true;
  }


  /*
   * ADMINISTRACIÓN
   *
   * Doctor y recepción NO pueden acceder.
   */

  if (
    coincideRuta(
      ruta,
      RUTAS_SOLO_ADMIN
    )
  ) {
    return false;
  }


  /*
   * HISTORIA CLÍNICA,
   * ODONTOGRAMA Y TRATAMIENTOS
   *
   * Solo el doctor.
   */

  if (
    coincideRuta(
      ruta,
      RUTAS_SOLO_DOCTOR
    )
  ) {
    return rol === "doctor";
  }


  /*
   * PAGOS
   *
   * Doctor puede consultar.
   * Recepción puede gestionar.
   */

  if (
    ruta === RUTA_PAGOS ||
    ruta.startsWith(`${RUTA_PAGOS}/`)
  ) {
    return (
      rol === "doctor" ||
      rol === "recepcion"
    );
  }


  /*
   * AGENDA
   *
   * Doctor y recepción.
   */

  if (
    ruta === RUTA_CITAS ||
    ruta.startsWith(`${RUTA_CITAS}/`)
  ) {
    return (
      rol === "doctor" ||
      rol === "recepcion"
    );
  }


  /*
   * PACIENTES
   *
   * Los tres roles pueden acceder.
   */

  if (
    ruta === RUTA_PACIENTES ||
    ruta.startsWith(`${RUTA_PACIENTES}/`)
  ) {
    return true;
  }


  /*
   * DOCUMENTOS
   *
   * Doctor y recepción.
   */

  if (
    coincideRuta(
      ruta,
      RUTAS_DOCUMENTOS
    )
  ) {
    return (
      rol === "doctor" ||
      rol === "recepcion"
    );
  }


  /*
   * DASHBOARD
   *
   * Todos los usuarios autenticados.
   */

  if (
    ruta === "/" ||
    ruta === "/dashboard"
  ) {
    return true;
  }


  /*
   * RUTA DESCONOCIDA
   *
   * IMPORTANTE:
   *
   * No damos acceso automáticamente.
   */

  return false;
}