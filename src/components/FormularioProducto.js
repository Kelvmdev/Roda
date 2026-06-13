"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CampoFormulario from "@/components/CampoFormulario";
import { CLOUDINARY_CLOUD, CLOUDINARY_PRESET } from "@/lib/config";
import { imagenOptimizada } from "@/lib/img";

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
    imagen: producto?.imagen ?? "",
  });

  // Estado de la subida de foto a Cloudinary.
  const [subiendo, setSubiendo] = useState(false);
  const [errorSubida, setErrorSubida] = useState(null);

  const set = (campo) => (ev) =>
    setDatos((prev) => ({ ...prev, [campo]: ev.target.value }));

  // Sube el archivo elegido a Cloudinary (preset SIN firmar, desde el navegador)
  // y guarda la secure_url resultante en el producto. Patrón de SOLE/portafolio.
  async function subirFoto(ev) {
    const archivo = ev.target.files?.[0];
    if (!archivo) return;
    setSubiendo(true);
    setErrorSubida(null);
    try {
      const fd = new FormData();
      fd.append("file", archivo);
      fd.append("upload_preset", CLOUDINARY_PRESET);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
        { method: "POST", body: fd }
      );
      if (!res.ok) throw new Error("upload failed");
      const json = await res.json();
      setDatos((prev) => ({ ...prev, imagen: json.secure_url }));
    } catch {
      setErrorSubida("No se pudo subir la imagen. Intenta de nuevo.");
    } finally {
      setSubiendo(false);
    }
  }

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

          {/* Foto (opcional) → se sube a Cloudinary y se guarda la URL. */}
          <div className="sm:col-span-2">
            <span className="block text-sm font-semibold text-navy">
              Foto <span className="font-normal text-texto-suave">(opcional)</span>
            </span>
            {/* La URL viaja al Server Action por este campo oculto. */}
            <input type="hidden" name="imagen" value={datos.imagen} />

            <div className="mt-1.5 flex items-center gap-4">
              {/* Vista previa (o marcador "sin foto"). */}
              <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-linea bg-fondo">
                {datos.imagen ? (
                  <Image
                    src={imagenOptimizada(datos.imagen, 160)}
                    alt="Vista previa de la foto"
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="text-xs text-texto-suave">Sin foto</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="foto"
                  className="inline-flex w-fit cursor-pointer items-center rounded-full border border-linea px-4 py-2 text-sm font-semibold text-navy transition duration-150 hover:bg-acento-suave active:scale-95"
                >
                  {subiendo ? "Subiendo…" : datos.imagen ? "Cambiar foto" : "Subir foto"}
                </label>
                <input
                  id="foto"
                  type="file"
                  accept="image/*"
                  onChange={subirFoto}
                  disabled={subiendo}
                  className="sr-only"
                />
                {datos.imagen && !subiendo && (
                  <button
                    type="button"
                    onClick={() => setDatos((prev) => ({ ...prev, imagen: "" }))}
                    className="w-fit text-xs font-medium text-error hover:underline"
                  >
                    Quitar foto
                  </button>
                )}
                <p aria-live="polite" className="min-h-4 text-xs text-error">
                  {errorSubida}
                </p>
              </div>
            </div>
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
