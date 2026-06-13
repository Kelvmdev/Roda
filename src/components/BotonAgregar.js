"use client";

import { useState } from "react";
import { useCarrito } from "@/context/CarritoContext";

export default function BotonAgregar({ producto, variante = "icono" }) {
  const { agregar } = useCarrito();
  const [agregado, setAgregado] = useState(false);

  function manejar() {
    agregar(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  }

  // Aviso accesible: una región viva que anuncia el cambio sin recargar.
  const aviso = (
    <span aria-live="polite" className="sr-only">
      {agregado ? `${producto.modelo} agregado al carrito` : ""}
    </span>
  );

  if (variante === "completo") {
    return (
      <>
        <button
          type="button"
          onClick={manejar}
          className="mt-4 w-full rounded-full bg-acento px-6 py-4 text-lg font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95 sm:w-auto sm:px-10"
        >
          {agregado ? "¡Agregado!" : "Agregar al carrito"}
        </button>
        {aviso}
      </>
    );
  }

  // Variante "icono" (tarjeta de producto).
  return (
    <>
      <button
        type="button"
        onClick={manejar}
        aria-label={`Agregar ${producto.marca} ${producto.modelo} al carrito`}
        className="grid h-10 w-10 place-items-center rounded-full bg-acento text-superficie transition duration-150 hover:bg-navy active:scale-95"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          {agregado ? (
            <path
              d="M20 6 9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>
      {aviso}
    </>
  );
}
