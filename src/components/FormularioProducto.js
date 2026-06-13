"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import CampoFormulario from "@/components/CampoFormulario";

const ESTADO_INICIAL = { error: null, errores: {} };

// Formulario único para crear y editar una llanta (DRY §5.2).
// - `producto`: si viene, es edición (pre-rellena y agrega el slug original).
// - `accion`: el Server Action (crearProducto o actualizarProducto).
// La validación real ocurre en el servidor; los errores vuelven en `estado`.
export default function FormularioProducto({ producto, accion, textoBoton = "Guardar" }) {
  const [estado, enviar, pendiente] = useActionState(accion, ESTADO_INICIAL);

  // Estado controlado: mantiene los valores tras un error del servidor y
  // pre-rellena en edición.
  const [datos, setDatos] = useState({
    marca: producto?.marca ?? "",
    modelo: producto?.modelo ?? "",
    tipo: producto?.tipo ?? "carro",
    ancho: producto?.ancho ?? "",
    perfil: producto?.perfil ?? "",
    rin: producto?.rin ?? "",
    precio: producto?.precio ?? "",
    etiqueta: producto?.etiqueta ?? "",
    destacado: producto?.destacado ?? false,
    descripcion: producto?.descripcion ?? "",
  });

  const set = (campo) => (ev) =>
    setDatos((prev) => ({ ...prev, [campo]: ev.target.value }));

  const err = estado?.errores ?? {};
  // Estilo común de los <select> (mismos tokens que CampoFormulario).
  const claseSelect =
    "mt-1.5 w-full rounded-xl border border-linea bg-superficie px-4 py-3 text-sm text-navy outline-none transition duration-150 focus:ring-2 focus:ring-acento";

  return (
    <form action={enviar} className="flex flex-col gap-5">
      {/* En edición, el servidor necesita saber QUÉ llanta actualizar. */}
      {producto && (
        <input type="hidden" name="slugOriginal" value={producto.slug} />
      )}

      <div className="rounded-2xl border border-linea bg-superficie p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFormulario
            id="marca"
            etiqueta="Marca"
            valor={datos.marca}
            onChange={set("marca")}
            error={err.marca}
            autoComplete="off"
            placeholder="Ej. Michelin"
          />
          <CampoFormulario
            id="modelo"
            etiqueta="Modelo"
            valor={datos.modelo}
            onChange={set("modelo")}
            error={err.modelo}
            autoComplete="off"
            placeholder="Ej. Primacy 4"
          />

          {/* Tipo */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-semibold text-navy">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              value={datos.tipo}
              onChange={set("tipo")}
              aria-invalid={err.tipo ? "true" : undefined}
              aria-describedby={err.tipo ? "tipo-error" : undefined}
              className={claseSelect}
            >
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
            </select>
            <p id="tipo-error" aria-live="polite" className="min-h-5 text-xs text-error">
              {err.tipo}
            </p>
          </div>

          {/* Etiqueta */}
          <div>
            <label htmlFor="etiqueta" className="block text-sm font-semibold text-navy">
              Etiqueta
            </label>
            <select
              id="etiqueta"
              name="etiqueta"
              value={datos.etiqueta}
              onChange={set("etiqueta")}
              className={claseSelect}
            >
              <option value="">Ninguna</option>
              <option value="Top">Top</option>
              <option value="Oferta">Oferta</option>
            </select>
            <p className="min-h-5" aria-hidden="true" />
          </div>

          <CampoFormulario
            id="ancho"
            etiqueta="Ancho"
            valor={datos.ancho}
            onChange={set("ancho")}
            error={err.ancho}
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ej. 205"
          />
          <CampoFormulario
            id="perfil"
            etiqueta="Perfil"
            valor={datos.perfil}
            onChange={set("perfil")}
            error={err.perfil}
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ej. 55"
          />
          <CampoFormulario
            id="rin"
            etiqueta="Rin"
            valor={datos.rin}
            onChange={set("rin")}
            error={err.rin}
            autoComplete="off"
            placeholder="Ej. R16"
          />
          <CampoFormulario
            id="precio"
            etiqueta="Precio (COP)"
            valor={datos.precio}
            onChange={set("precio")}
            error={err.precio}
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ej. 389900"
          />

          {/* Descripción (opcional) */}
          <div className="sm:col-span-2">
            <label htmlFor="descripcion" className="block text-sm font-semibold text-navy">
              Descripción <span className="font-normal text-texto-suave">(opcional)</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              value={datos.descripcion}
              onChange={set("descripcion")}
              placeholder="Breve descripción que se muestra en la ficha del producto."
              className="mt-1.5 w-full rounded-xl border border-linea bg-superficie px-4 py-3 text-sm text-navy outline-none transition duration-150 placeholder:text-texto-suave/70 focus:ring-2 focus:ring-acento"
            />
          </div>

          {/* Destacado */}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-navy">
              <input
                type="checkbox"
                name="destacado"
                checked={datos.destacado}
                onChange={(ev) =>
                  setDatos((prev) => ({ ...prev, destacado: ev.target.checked }))
                }
                className="h-4 w-4 accent-acento"
              />
              Destacado (aparece en la home)
            </label>
          </div>
        </div>
      </div>

      {/* Error general del servidor (slug duplicado, fallo al guardar…). */}
      {estado?.error && (
        <p role="alert" aria-live="assertive" className="text-sm font-medium text-error">
          {estado.error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pendiente}
          className="inline-flex items-center justify-center rounded-full bg-acento px-8 py-3.5 font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
          {pendiente ? "Guardando…" : textoBoton}
        </button>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-full border border-linea px-6 py-3.5 font-semibold text-navy transition duration-150 hover:bg-acento-suave active:scale-95"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
