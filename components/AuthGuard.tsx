"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  inicializarUsuarios,
  obtenerSesion,
  rutaPermitida,
  type Usuario,
} from "@/lib/auth";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const esLogin = pathname === "/login";

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [verificando, setVerificando] = useState(!esLogin);

  useEffect(() => {
    if (esLogin) {
      setVerificando(false);
      return;
    }

    inicializarUsuarios();

    const sesion = obtenerSesion();

    if (!sesion) {
      router.replace("/login");
      return;
    }

    if (!sesion.activo) {
      localStorage.removeItem("dentalSystemSesion");
      router.replace("/login");
      return;
    }

    if (!rutaPermitida(sesion.rol, pathname)) {
      router.replace("/");
      return;
    }

    setUsuario(sesion);
    setVerificando(false);
  }, [esLogin, pathname, router]);

  /*
   * LOGIN: se muestra directamente
   */

  if (esLogin) {
    return <>{children}</>;
  }

  /*
   * RESTO DE LA APP
   */

  if (verificando || !usuario) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="text-4xl">
            🦷
          </div>

          <p className="mt-3 text-slate-600">
            Verificando acceso...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}