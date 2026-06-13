"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ANCHOS, PERFILES, RINES } from "@/lib/catalogo";

// Select etiquetado (a11y §5.11), controlado por estado.
function Campo({ id, etiqueta, opciones, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-texto-suave">
        {etiqueta}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="rounded-lg border border-linea bg-fondo px-3 py-2 text-sm text-texto focus:border-acento focus:outline-none focus:ring-2 focus:ring-acento/40"
      >
        <option value="">—</option>
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
  const router = useRouter();
  const [tipo, setTipo] = useState("carro");
  const [ancho, setAncho] = useState("");
  const [perfil, setPerfil] = useState("");
  const [rin, setRin] = useState("");

  // Arma la URL del catálogo con lo elegido y navega.
  function verCompatibles() {
    const params = new URLSearchParams();
    params.set("tipo", tipo);
    if (ancho) params.set("ancho", ancho);
    if (perfil) params.set("perfil", perfil);
    if (rin) params.set("rin", rin);
    router.push(`/catalogo?${params.toString()}`);
  }

  const botonTipo = (valor, texto) => {
    const activo = tipo === valor;
    return (
      <button
        type="button"
        onClick={() => setTipo(valor)}
        aria-pressed={activo}
        className={`flex-1 rounded-lg py-2 text-sm font-semibold transition duration-150 active:scale-95 ${
          activo ? "bg-navy text-superficie" : "text-texto-suave hover:text-navy"
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

      {/* Toggle Carro / Moto */}
      <div className="mt-4 flex gap-1 rounded-xl border border-linea bg-fondo p-1">
        {botonTipo("carro", "Carro")}
        {botonTipo("moto", "Moto")}
      </div>

      {/* Selects de medida */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Campo
          id="ancho"
          etiqueta="Ancho"
          opciones={ANCHOS}
          value={ancho}
          onChange={(e) => setAncho(e.target.value)}
        />
        <Campo
          id="perfil"
          etiqueta="Perfil"
          opciones={PERFILES}
          value={perfil}
          onChange={(e) => setPerfil(e.target.value)}
        />
        <Campo
          id="rin"
          etiqueta="Rin"
          opciones={RINES}
          value={rin}
          onChange={(e) => setRin(e.target.value)}
        />
      </div>

      {/* Acción: navega al catálogo filtrado */}
      <button
        type="button"
        onClick={verCompatibles}
        className="mt-5 w-full rounded-full bg-acento py-3 font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95"
      >
        Ver llantas compatibles
      </button>
    </div>
  );
}
