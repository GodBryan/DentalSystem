AUDITORIA

1. Crear:
lib/auditoria.ts

2. Crear:
app/admin/auditoria/page.tsx

3. El archivo de auditoría proporciona:
- registrarAuditoria(...)
- obtenerAuditoria()
- limpiarAuditoria()
- tipos de acciones.

4. Para que aparezcan registros reales hay que llamar registrarAuditoria()
desde cada módulo cuando se ejecuta una acción.

Ejemplo:

import { registrarAuditoria } from "@/lib/auditoria";

registrarAuditoria({
  accion: "REGISTRAR_PAGO",
  modulo: "Pagos",
  descripcion: "Registró un pago de $2.000.000",
  pacienteId: paciente.id,
  pacienteNombre: `${paciente.nombres} ${paciente.apellidos}`,
  referenciaId: String(pago.id),
});

5. El panel está protegido para ADMINISTRADOR en la aplicación actual.

IMPORTANTE:
Esta auditoría utiliza localStorage porque el proyecto actual funciona con localStorage.
Para producción, la auditoría debe guardarse en servidor/base de datos para que un usuario no pueda modificarla desde el navegador.
