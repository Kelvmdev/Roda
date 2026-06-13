"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import CampoFormulario from "@/components/CampoFormulario";

const ESTADO_INICIAL = { ok: false, error: null };

// Formulario de contenido del sitio. Estado controlado con el objeto completo;
// se envía como JSON en un campo oculto (maneja bien el anidamiento). La
// validación/guardado ocurre en el Server Action.
export default function FormularioContenido({ contenido, accion }) {
  const [estado, enviar, pendiente] = useActionState(accion, ESTADO_INICIAL);
  const [datos, setDatos] = useState(contenido);

  // Actualiza datos[seccion][campo] manteniendo el resto.
  const set = (seccion, campo) => (ev) =>
    setDatos((p) => ({ ...p, [seccion]: { ...p[seccion], [campo]: ev.target.value } }));

  // Actualiza confianza[i][campo] (es un array).
  const setConf = (i, campo) => (ev) =>
    setDatos((p) => ({
      ...p,
      confianza: p.confianza.map((it, idx) =>
        idx === i ? { ...it, [campo]: ev.target.value } : it
      ),
    }));

  const claseFieldset =
    "rounded-2xl border border-linea bg-superficie p-6";
  const claseLegend = "px-1 font-display text-lg font-bold text-navy";

  return (
    <form action={enviar} className="flex flex-col gap-6">
      {/* El contenido completo viaja al servidor por aquí. */}
      <input type="hidden" name="contenido" value={JSON.stringify(datos)} />

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>Barra superior</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFormulario id="tb-asesoria" etiqueta="Texto asesoría" valor={datos.topbar.asesoria} onChange={set("topbar", "asesoria")} />
          <CampoFormulario id="tb-envio" etiqueta="Texto envío" valor={datos.topbar.envio} onChange={set("topbar", "envio")} />
        </div>
      </fieldset>

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>Menú (etiquetas)</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFormulario id="nav-carros" etiqueta="Carros" valor={datos.nav.carros} onChange={set("nav", "carros")} />
          <CampoFormulario id="nav-motos" etiqueta="Motos" valor={datos.nav.motos} onChange={set("nav", "motos")} />
          <CampoFormulario id="nav-marcas" etiqueta="Marcas" valor={datos.nav.marcas} onChange={set("nav", "marcas")} />
          <CampoFormulario id="nav-ofertas" etiqueta="Ofertas" valor={datos.nav.ofertas} onChange={set("nav", "ofertas")} />
          <CampoFormulario id="nav-ayuda" etiqueta="Ayuda" valor={datos.nav.ayuda} onChange={set("nav", "ayuda")} />
        </div>
      </fieldset>

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>Hero (portada)</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFormulario id="hero-eyebrow" etiqueta="Eyebrow (texto pequeño arriba)" valor={datos.hero.eyebrow} onChange={set("hero", "eyebrow")} />
          <CampoFormulario id="hero-titulo" etiqueta="Título" valor={datos.hero.titulo} onChange={set("hero", "titulo")} />
          <CampoFormulario id="hero-tituloAcento" etiqueta="Título (parte en azul)" valor={datos.hero.tituloAcento} onChange={set("hero", "tituloAcento")} />
          <CampoFormulario id="hero-subtitulo" etiqueta="Subtítulo" valor={datos.hero.subtitulo} onChange={set("hero", "subtitulo")} />
        </div>
      </fieldset>

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>Buscador</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFormulario id="bus-titulo" etiqueta="Título" valor={datos.buscador.titulo} onChange={set("buscador", "titulo")} />
          <CampoFormulario id="bus-subtitulo" etiqueta="Subtítulo" valor={datos.buscador.subtitulo} onChange={set("buscador", "subtitulo")} />
          <CampoFormulario id="bus-boton" etiqueta="Texto del botón" valor={datos.buscador.boton} onChange={set("buscador", "boton")} />
        </div>
      </fieldset>

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>Franja de confianza</legend>
        <div className="flex flex-col gap-4">
          {datos.confianza.map((item, i) => (
            <div key={i} className="grid gap-4 sm:grid-cols-2">
              <CampoFormulario id={`conf-${i}-titulo`} etiqueta={`Ítem ${i + 1} · Título`} valor={item.titulo} onChange={setConf(i, "titulo")} />
              <CampoFormulario id={`conf-${i}-sub`} etiqueta={`Ítem ${i + 1} · Subtítulo`} valor={item.sub} onChange={setConf(i, "sub")} />
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>Sección «Más vendidas»</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFormulario id="mv-titulo" etiqueta="Título de la sección" valor={datos.masVendidas.titulo} onChange={set("masVendidas", "titulo")} />
          <CampoFormulario id="mv-enlace" etiqueta="Texto del enlace" valor={datos.masVendidas.enlace} onChange={set("masVendidas", "enlace")} />
        </div>
      </fieldset>

      {/* Mensajes (a11y: error asertivo, éxito en status). */}
      {estado?.error && (
        <p role="alert" aria-live="assertive" className="text-sm font-medium text-error">
          {estado.error}
        </p>
      )}
      {estado?.ok && (
        <p role="status" aria-live="polite" className="text-sm font-medium text-navy">
          Cambios guardados. Revisa la home para verlos.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pendiente}
          className="inline-flex items-center justify-center rounded-full bg-acento px-8 py-3.5 font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
          {pendiente ? "Guardando…" : "Guardar cambios"}
        </button>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-full border border-linea px-6 py-3.5 font-semibold text-navy transition duration-150 hover:bg-acento-suave active:scale-95"
        >
          Volver a productos
        </Link>
      </div>
    </form>
  );
}
