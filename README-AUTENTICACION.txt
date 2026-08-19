DENTAL SYSTEM - AUTENTICACION Y ROLES

ESTRUCTURA

lib/auth.ts
components/AuthGuard.tsx
components/UserMenu.tsx
app/login/page.tsx
app/admin/usuarios/page.tsx

1. COPIAR ARCHIVOS

Copia cada archivo respetando exactamente estas rutas.

2. PROTEGER TODA LA APP

En tu app/layout.tsx actual, importa:

import AuthGuard from "@/components/AuthGuard";

Y envuelve el contenido que ya tienes:

<AuthGuard>
  {children}
</AuthGuard>

NO borres tu diseño actual del layout. Solo agrega el AuthGuard alrededor de children.

3. CUENTA ADMINISTRADORA INICIAL

Correo:
admin@dentalsystem.local

Contraseña:
Admin123!

Después de entrar puedes crear:
- Doctores
- Recepción

No existe un formulario para crear administradores.

4. PERMISOS

ADMIN:
Todo el sistema.

DOCTOR:
Pacientes, historia clínica, odontograma, citas, tratamientos, documentos y consulta de pagos.

RECEPCION:
Pacientes, citas, pagos y documentos. No puede modificar historia clínica, odontograma ni tratamientos.

5. IMPORTANTE SOBRE SEGURIDAD

Esta versión está diseñada para el prototipo actual que usa localStorage.

NO es autenticación segura para producción:
- Las contraseñas están en localStorage.
- Los roles también están en localStorage.
- Un usuario con conocimientos técnicos puede modificar esos datos.

Antes de usar el sistema con pacientes reales, hay que migrar:
- usuarios a base de datos,
- contraseñas a hash seguro,
- sesiones a cookies HttpOnly,
- permisos a validación del servidor,
- auditoría al backend.

Esta versión sirve para organizar y probar toda la lógica de roles dentro del proyecto actual.
