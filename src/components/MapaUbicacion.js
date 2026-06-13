"use client";

import { useRef, useState } from "react";

// Sección de ubicación con un iframe público de Google Maps (SIN API key, $0).
// Anti-hijack de scroll (§2): una capa cubre el mapa para que la rueda del ratón
// no lo "capture" mientras desplazas la página. Primer clic muestra una pista;
// segundo clic activa la interacción. Al volver a hacer scroll, se re-bloquea.
export default function MapaUbicacion({ titulo, subtitulo, direccion }) {
  const [bloqueado, setBloqueado] = useState(true);
  const [pista, setPista] = useState(false);
  const taps = useRef(0);
  const timer = useRef(null);

  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    direccion
  )}&output=embed`;

  function alClick() {
    taps.current += 1;
    if (taps.current === 1) {
      setPista(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        taps.current = 0;
        setPista(false);
      }, 1800);
    } else {
      // segundo clic → activar el mapa
      setBloqueado(false);
      setPista(false);
      taps.current = 0;
      if (timer.current) clearTimeout(timer.current);
    }
  }

  // Al desplazar la página sobre el mapa ya activo, se vuelve a bloquear.
  function reBloquear() {
    if (!bloqueado) {
      setBloqueado(true);
      taps.current = 0;
      setPista(false);
    }
  }

  return (
    <section className="bg-fondo">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
          {titulo}
        </h2>
        <p className="mt-1 text-sm text-texto-suave">{subtitulo}</p>
        <p className="mt-1 text-sm font-medium text-navy">{direccion}</p>

        <div
          className="relative mt-6 overflow-hidden rounded-2xl border border-linea"
          onWheel={reBloquear}
        >
          <iframe
            src={src}
            title={`Mapa de ubicación: ${direccion}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full border-0 sm:h-[26rem]"
          />

          {bloqueado && (
            <button
              type="button"
              onClick={alClick}
              aria-label="Activar el mapa (doble clic para interactuar)"
              className="absolute inset-0 grid place-items-center bg-transparent"
            >
              {pista && (
                <span className="pointer-events-none rounded-full bg-navy px-4 py-2 text-sm font-medium text-superficie shadow-lg">
                  Doble clic para interactuar con el mapa
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
