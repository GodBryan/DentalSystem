export type AccionAuditoria =
  | "LOGIN"
  | "LOGOUT"
  | "CREAR_USUARIO"
  | "EDITAR_USUARIO"
  | "ACTIVAR_USUARIO"
  | "DESACTIVAR_USUARIO"
  | "ELIMINAR_USUARIO"
  | "CREAR_PACIENTE"
  | "EDITAR_PACIENTE"
  | "CREAR_CITA"
  | "EDITAR_CITA"
  | "CANCELAR_CITA"
  | "CREAR_HISTORIA"
  | "EDITAR_HISTORIA"
  | "CREAR_TRATAMIENTO"
  | "EDITAR_TRATAMIENTO"
  | "REGISTRAR_PAGO"
  | "EDITAR_PAGO"
  | "ELIMINAR_PAGO"
  | "MODIFICAR_ODONTOGRAMA"
  | "CREAR_MOVIMIENTO_INVENTARIO"
  | "EDITAR_CONFIGURACION"
  | "OTRA";

export type RegistroAuditoria = {
  id: string;
  fecha: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioRol: "admin" | "doctor" | "recepcion";
  accion: AccionAuditoria;
  modulo: string;
  descripcion: string;
  pacienteId?: string;
  pacienteNombre?: string;
  referenciaId?: string;
};

export const AUDITORIA_KEY = "dentalSystemAuditoria";

export function obtenerAuditoria(): RegistroAuditoria[] {
  if (typeof window === "undefined") return [];

  try {
    const datos = localStorage.getItem(AUDITORIA_KEY);
    const registros = datos ? JSON.parse(datos) : [];
    return Array.isArray(registros) ? registros : [];
  } catch {
    return [];
  }
}

export function registrarAuditoria(
  datos: Omit<
    RegistroAuditoria,
    "id" | "fecha" | "usuarioId" | "usuarioNombre" | "usuarioRol"
  >
) {
  if (typeof window === "undefined") return;

  try {
    const sesionRaw = localStorage.getItem("dentalSystemSesion");

    if (!sesionRaw) return;

    const usuario = JSON.parse(sesionRaw);

    if (!usuario?.id || !usuario?.rol) return;

    const registro: RegistroAuditoria = {
      ...datos,
      id: `auditoria-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      fecha: new Date().toISOString(),
      usuarioId: usuario.id,
      usuarioNombre: usuario.nombre,
      usuarioRol: usuario.rol,
    };

    const anteriores = obtenerAuditoria();

    localStorage.setItem(
      AUDITORIA_KEY,
      JSON.stringify([registro, ...anteriores].slice(0, 5000))
    );
  } catch (error) {
    console.error("No se pudo registrar la auditoría:", error);
  }
}

export function limpiarAuditoria() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUDITORIA_KEY);
}
