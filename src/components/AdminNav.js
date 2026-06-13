"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cerrarSesion } from "@/app/admin/acciones";

const TABS = [
  { label: "Productos", href: "/admin", coincide: (r) => r === "/admin" || r.startsWith("/admin/productos") },
  { label: "Contenido", href: "/admin/contenido", coincide: (r) => r.startsWith("/admin/contenido") },
];

// Barra del panel: pestañas para moverse entre secciones del CMS + cerrar sesión.
export default function AdminNav() {
  const ruta = usePathname() ?? "";

  return (
    <div className="border-b border-linea bg-superficie">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <nav aria-label="Secciones del panel" className="flex gap-1">
          {TABS.map((t) => {
            const activo = t.coincide(ruta);
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={activo ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-150 active:scale-95 ${
                  activo
                    ? "bg-navy text-superficie"
                    : "text-texto-suave hover:text-navy"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        <form action={cerrarSesion}>
          <button
            type="submit"
            className="rounded-full border border-linea px-4 py-2 text-sm font-semibold text-navy transition duration-150 hover:bg-acento-suave active:scale-95"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
