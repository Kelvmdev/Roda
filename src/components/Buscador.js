"use client";

import { useState } from "react";

// Opciones de ejemplo para los selects (presentacional por ahora).
const ANCHOS = ["185", "195", "205", "215", "225"];
const PERFILES = ["45", "50", "55", "60", "65"];
const RINES = ["R15", "R16", "R17", "R18"];

// Sub-componente para no repetir la estructura label + select (DRY §5.2).
function Campo({ id, etiqueta, opciones }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-texto-suave">
        {etiqueta}
      </label>
      <select
        id={id}
        defaultValue=""
        className="rounded-lg border border-linea bg-fondo px-3 py-2 text-sm text-texto focus:border-acento focus:outline-none focus:ring-2 focus:ring-acento/40"
      >
        <option value="" disabled>
          —
        </option>
        {opciones.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Buscador() {
  const [tipo, setTipo] = useState("carro");

  const botonTipo = (valor, texto) => {
    const activo = tipo === valor;
    return (
      <button
        type="button"
        onClick={() => setTipo(valor)}
        aria-pressed={activo}
        className={`flex-1 rounded-lg py-2 text-sm font-semibold transition duration-150 active:scale-95 ${
          activo
            ? "bg-navy text-superficie"
            : "text-texto-suave hover:text-navy"
        }`}
      >
        {texto}
      </button>
    );
  };

  return (
    <div className="rounded-2xl border border-linea bg-superficie p-6 shadow-xl">
      <h2 className="font-display text-2xl font-bold text-navy">
        Encuentra tu llanta
      </h2>
      <p className="mt-1 text-sm text-texto-suave">
        Filtra por medida y te mostramos lo compatible.
      </p>

      {/* Toggle Carro / Moto (visual) */}
      <div className="mt-4 flex gap-1 rounded-xl border border-linea bg-fondo p-1">
        {botonTipo("carro", "Carro")}
        {botonTipo("moto", "Moto")}
      </div>

      {/* Selects de medida */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Campo id="ancho" etiqueta="Ancho" opciones={ANCHOS} />
        <Campo id="perfil" etiqueta="Perfil" opciones={PERFILES} />
        <Campo id="rin" etiqueta="Rin" opciones={RINES} />
      </div>

      {/* Acción (sin lógica por ahora) */}
      <button
        type="button"
        className="mt-5 w-full rounded-full bg-acento py-3 font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95"
      >
        Ver llantas compatibles
      </button>
    </div>
  );
}
