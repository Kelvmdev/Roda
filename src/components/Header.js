"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { useCarrito } from "@/context/CarritoContext";

// Una sola fuente de verdad para los enlaces (DRY §5.2).
const ENLACES = [
  { label: "Carros", href: "/catalogo?tipo=carro" },
  { label: "Motos", href: "/catalogo?tipo=moto" },
  { label: "Marcas", href: "/catalogo" },
  { label: "Ofertas", href: "/catalogo?etiqueta=Oferta" },
  { label: "Ayuda", href: "/ayuda" },
];

// Campo de búsqueda reutilizado en desktop y en el menú móvil.
// `id` único por instancia (evita IDs duplicados entre desktop y móvil).
// `onNavegar` permite cerrar el menú móvil al buscar.
function Busqueda({ className = "", id = "buscar", onNavegar }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function alBuscar(ev) {
    ev.preventDefault();
    const consulta = q.trim();
    // Navega al catálogo con ?q=… (o sin él si está vacío).
    router.push(consulta ? `/catalogo?q=${encodeURIComponent(consulta)}` : "/catalogo");
    onNavegar?.();
  }

  return (
    <form role="search" onSubmit={alBuscar} className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Buscar llantas
      </label>
      <input
        id={id}
        type="search"
        name="q"
        value={q}
        onChange={(ev) => setQ(ev.target.value)}
        placeholder="Busca por medida o marca…"
        autoComplete="off"
        className="w-full rounded-full border border-linea bg-fondo py-2 pl-4 pr-10 text-sm text-texto placeholder:text-texto-suave focus:border-acento focus:outline-none focus:ring-2 focus:ring-acento/40"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-1 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-texto-suave transition duration-150 hover:bg-acento-suave hover:text-acento active:scale-95"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const { totalItems } = useCarrito();

  return (
    <header className="sticky top-0 z-50">
      {/* Barra superior delgada (navy) */}
      <div className="bg-navy text-superficie text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
          <a href="tel:+573117365928" className="hover:underline">
            <span aria-hidden="true">☎</span> Asesoría: +57 311 736 5928
          </a>
          <span className="hidden sm:inline">
            <span aria-hidden="true">🚚</span> Envío e instalación en Medellín
          </span>
        </div>
      </div>

      {/* Header principal (blanco) */}
      <div className="border-b border-linea bg-superficie">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          {/* Izquierda: logo */}
          <Link href="/" aria-label="RODA, inicio" className="shrink-0">
            <Logo />
          </Link>

          {/* Centro: enlaces (solo desktop) */}
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {ENLACES.map((e) => (
                <li key={e.label}>
                  <Link
                    href={e.href}
                    className="text-sm font-medium text-texto transition-colors hover:text-acento-fuerte"
                  >
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Derecha: búsqueda (desktop) + carrito + hamburguesa */}
          <div className="flex items-center gap-2">
            <Busqueda className="hidden md:block md:w-56 lg:w-72" id="buscar-desktop" />

            {/* Carrito con badge */}
            <Link
              href="/carrito"
              className="relative rounded-full p-2 text-navy transition duration-150 hover:bg-acento-suave active:scale-95"
            >
              <span className="sr-only">
                Carrito, {totalItems} {totalItems === 1 ? "producto" : "productos"}
              </span>
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                <path
                  d="M3 4h2l2.4 12.3a1 1 0 0 0 1 .7h8.7a1 1 0 0 0 1-.8L21 8H6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9" cy="20" r="1.4" fill="currentColor" />
                <circle cx="18" cy="20" r="1.4" fill="currentColor" />
              </svg>
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-acento px-1 text-[0.625rem] font-semibold leading-none text-superficie"
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburguesa (solo móvil) */}
            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={abierto}
              aria-controls="menu-movil"
              className="rounded-full p-2 text-navy transition duration-150 hover:bg-acento-suave active:scale-95 md:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                {abierto ? (
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        <div
          id="menu-movil"
          className={`${abierto ? "block" : "hidden"} border-t border-linea bg-superficie md:hidden`}
        >
          <div className="mx-auto max-w-7xl px-4 py-4">
            <Busqueda className="mb-4" id="buscar-movil" onNavegar={() => setAbierto(false)} />
            <nav aria-label="Principal móvil">
              <ul className="flex flex-col">
                {ENLACES.map((e) => (
                  <li key={e.label}>
                    <Link
                      href={e.href}
                      onClick={() => setAbierto(false)}
                      className="block rounded-lg px-2 py-3 text-base font-medium text-texto transition-colors hover:bg-acento-suave hover:text-acento-fuerte"
                    >
                      {e.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
