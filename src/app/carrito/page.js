"use client";

import Link from "next/link";
import LlantaSVG from "@/components/LlantaSVG";
import { useCarrito } from "@/context/CarritoContext";
import { formatoPrecio } from "@/lib/catalogo";

export default function CarritoPage() {
  const { items, cambiarCantidad, quitar, vaciar, subtotal } = useCarrito();

  // Estado vacío: sin filas ni resumen.
  if (items.length === 0) {
    return (
      <div className="bg-fondo">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <LlantaSVG className="mx-auto h-20 w-20 opacity-60" />
          <h1 className="mt-4 font-display text-2xl font-bold text-navy sm:text-3xl">
            Tu carrito está vacío
          </h1>
          <p className="mt-2 text-sm text-texto-suave">
            Agrega llantas desde el catálogo y aparecerán aquí.
          </p>
          <Link
            href="/catalogo"
            className="mt-6 inline-flex rounded-full bg-acento px-6 py-3 text-sm font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  function vaciarConConfirmacion() {
    if (window.confirm("¿Seguro que quieres vaciar el carrito?")) {
      vaciar();
    }
  }

  return (
    <div className="bg-fondo">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            Tu carrito
          </h1>
          <button
            type="button"
            onClick={vaciarConConfirmacion}
            className="text-sm font-semibold text-texto-suave transition-colors hover:text-acento"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Filas */}
          <ul className="flex flex-col gap-4 lg:col-span-2">
            {items.map((it) => (
              <li
                key={it.slug}
                className="flex flex-col gap-4 rounded-2xl border border-linea bg-superficie p-4 sm:flex-row sm:items-center sm:gap-6"
              >
                {/* Miniatura */}
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-fondo">
                  <LlantaSVG className="h-14 w-14" />
                </div>

                {/* Datos */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-texto-suave">
                    {it.marca}
                  </p>
                  <Link
                    href={`/producto/${it.slug}`}
                    className="font-display text-lg font-semibold leading-tight text-navy transition-colors hover:text-acento"
                  >
                    {it.modelo}
                  </Link>
                  <p className="mt-1 text-sm text-texto-suave">
                    {it.medida} · {formatoPrecio(it.precio)} c/u
                  </p>
                </div>

                {/* Cantidad + subtotal + quitar */}
                <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
                  {/* Selector de cantidad */}
                  <div className="inline-flex items-center rounded-full border border-linea">
                    <button
                      type="button"
                      onClick={() => cambiarCantidad(it.slug, it.cantidad - 1)}
                      aria-label={`Disminuir cantidad de ${it.modelo}`}
                      className="grid h-9 w-9 place-items-center rounded-full text-lg font-bold text-navy transition duration-150 hover:bg-acento-suave active:scale-95"
                    >
                      <span aria-hidden="true">−</span>
                    </button>
                    <span
                      aria-live="polite"
                      className="w-8 text-center text-sm font-semibold text-navy"
                    >
                      {it.cantidad}
                    </span>
                    <button
                      type="button"
                      onClick={() => cambiarCantidad(it.slug, it.cantidad + 1)}
                      aria-label={`Aumentar cantidad de ${it.modelo}`}
                      className="grid h-9 w-9 place-items-center rounded-full text-lg font-bold text-navy transition duration-150 hover:bg-acento-suave active:scale-95"
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>

                  {/* Subtotal de la línea */}
                  <p className="w-24 text-right font-bold text-navy">
                    <span className="sr-only">Subtotal: </span>
                    {formatoPrecio(it.precio * it.cantidad)}
                  </p>

                  {/* Quitar */}
                  <button
                    type="button"
                    onClick={() => quitar(it.slug)}
                    aria-label={`Quitar ${it.marca} ${it.modelo} del carrito`}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-texto-suave transition duration-150 hover:bg-acento-suave hover:text-acento active:scale-95"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Resumen */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-linea bg-superficie p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-xl font-bold text-navy">Resumen</h2>

              <div className="mt-4 flex items-center justify-between border-b border-linea pb-4">
                <span className="text-sm text-texto-suave">Subtotal</span>
                <span className="text-lg font-bold text-navy">
                  {formatoPrecio(subtotal)}
                </span>
              </div>

              <p className="mt-4 text-xs text-texto-suave">
                Envío e instalación se calculan al pagar.
              </p>

              <Link
                href="/checkout"
                className="mt-5 flex w-full items-center justify-center rounded-full bg-acento px-6 py-3 font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95"
              >
                Ir a pagar
              </Link>
              <Link
                href="/catalogo"
                className="mt-3 flex w-full items-center justify-center rounded-full border border-linea px-6 py-3 font-semibold text-navy transition duration-150 hover:bg-acento-suave active:scale-95"
              >
                Seguir comprando
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
