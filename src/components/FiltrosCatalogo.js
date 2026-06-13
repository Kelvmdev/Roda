"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MARCAS, ANCHOS, PERFILES, RINES } from "@/lib/catalogo";

// Select con label asociado (a11y §5.11). Reutilizado para los 4 filtros.
function Select({ id, etiqueta, opciones, value, onChange, placeholder }) {
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
        <option value="">{placeholder}</option>
        {opciones.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function FiltrosCatalogo() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const tipo = params.get("tipo") || "todos";
  const valor = (clave) => params.get(clave) || "";
  const hayFiltros = [...params.keys()].length > 0;

  // Reescribe la URL con los cambios; campos vacíos o "todos" se quitan.
  function aplicar(cambios) {
    const next = new URLSearchParams(params.toString());
    for (const [clave, v] of Object.entries(cambios)) {
      if (!v || v === "todos") next.delete(clave);
      else next.set(clave, v);
    }
    const qs = next.toString();
    // scroll:false → no salta arriba al filtrar
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="mb-8 rounded-2xl border border-linea bg-superficie p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        {/* Toggle vehículo */}
        <div>
          <span className="mb-1 block text-xs font-medium text-texto-suave">
            Vehículo
          </span>
          <div className="flex gap-1 rounded-xl border border-linea bg-fondo p-1">
            {[
              ["todos", "Todos"],
              ["carro", "Carro"],
              ["moto", "Moto"],
            ].map(([v, texto]) => {
              const activo = tipo === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => aplicar({ tipo: v })}
                  aria-pressed={activo}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition duration-150 active:scale-95 ${
                    activo
                      ? "bg-navy text-superficie"
                      : "text-texto-suave hover:text-navy"
                  }`}
                >
                  {texto}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selects de medida + marca */}
        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
          <Select
            id="f-marca"
            etiqueta="Marca"
            placeholder="Todas"
            opciones={MARCAS}
            value={valor("marca")}
            onChange={(e) => aplicar({ marca: e.target.value })}
          />
          <Select
            id="f-ancho"
            etiqueta="Ancho"
            placeholder="Cualquiera"
            opciones={ANCHOS}
            value={valor("ancho")}
            onChange={(e) => aplicar({ ancho: e.target.value })}
          />
          <Select
            id="f-perfil"
            etiqueta="Perfil"
            placeholder="Cualquiera"
            opciones={PERFILES}
            value={valor("perfil")}
            onChange={(e) => aplicar({ perfil: e.target.value })}
          />
          <Select
            id="f-rin"
            etiqueta="Rin"
            placeholder="Cualquiera"
            opciones={RINES}
            value={valor("rin")}
            onChange={(e) => aplicar({ rin: e.target.value })}
          />
        </div>

        {/* Limpiar */}
        <button
          type="button"
          onClick={() => router.push(pathname, { scroll: false })}
          disabled={!hayFiltros}
          className="shrink-0 rounded-full border border-linea px-4 py-2 text-sm font-semibold text-navy transition duration-150 hover:bg-acento-suave active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
