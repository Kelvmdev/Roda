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

  // FAQ: editar campos sueltos, editar una pregunta, agregar y quitar.
  const setFaq = (campo) => (ev) =>
    setDatos((p) => ({ ...p, faq: { ...p.faq, [campo]: ev.target.value } }));
  const setPregunta = (i, campo) => (ev) =>
    setDatos((p) => ({
      ...p,
      faq: {
        ...p.faq,
        preguntas: p.faq.preguntas.map((q, idx) =>
          idx === i ? { ...q, [campo]: ev.target.value } : q
        ),
      },
    }));
  const agregarPregunta = () =>
    setDatos((p) => ({
      ...p,
      faq: { ...p.faq, preguntas: [...p.faq.preguntas, { pregunta: "", respuesta: "" }] },
    }));
  const quitarPregunta = (i) =>
    setDatos((p) => ({
      ...p,
      faq: { ...p.faq, preguntas: p.faq.preguntas.filter((_, idx) => idx !== i) },
    }));

  // Badges de la ficha (array de strings).
  const setBadge = (i) => (ev) =>
    setDatos((p) => ({
      ...p,
      fichaBadges: p.fichaBadges.map((b, idx) => (idx === i ? ev.target.value : b)),
    }));

  // Legales: editar título/intro, editar/agregar/quitar secciones de un doc.
  const setLegal = (doc, campo) => (ev) =>
    setDatos((p) => ({
      ...p,
      legales: { ...p.legales, [doc]: { ...p.legales[doc], [campo]: ev.target.value } },
    }));
  const setSeccion = (doc, i, campo) => (ev) =>
    setDatos((p) => ({
      ...p,
      legales: {
        ...p.legales,
        [doc]: {
          ...p.legales[doc],
          secciones: p.legales[doc].secciones.map((s, idx) =>
            idx === i ? { ...s, [campo]: ev.target.value } : s
          ),
        },
      },
    }));
  const agregarSeccion = (doc) => () =>
    setDatos((p) => ({
      ...p,
      legales: {
        ...p.legales,
        [doc]: {
          ...p.legales[doc],
          secciones: [...p.legales[doc].secciones, { titulo: "", texto: "" }],
        },
      },
    }));
  const quitarSeccion = (doc, i) => () =>
    setDatos((p) => ({
      ...p,
      legales: {
        ...p.legales,
        [doc]: {
          ...p.legales[doc],
          secciones: p.legales[doc].secciones.filter((_, idx) => idx !== i),
        },
      },
    }));

  // SEO: title/description por página.
  const setSeo = (clave, campo) => (ev) =>
    setDatos((p) => ({
      ...p,
      seo: { ...p.seo, [clave]: { ...p.seo[clave], [campo]: ev.target.value } },
    }));

  // Testimonios: título de sección + lista (editar/agregar/quitar).
  const setTesti = (campo) => (ev) =>
    setDatos((p) => ({
      ...p,
      testimonios: { ...p.testimonios, [campo]: ev.target.value },
    }));
  const setTestiItem = (i, campo) => (ev) => {
    // Las estrellas se guardan como número.
    const valor = campo === "estrellas" ? Number(ev.target.value) : ev.target.value;
    setDatos((p) => ({
      ...p,
      testimonios: {
        ...p.testimonios,
        lista: p.testimonios.lista.map((t, idx) =>
          idx === i ? { ...t, [campo]: valor } : t
        ),
      },
    }));
  };
  const agregarTesti = () =>
    setDatos((p) => ({
      ...p,
      testimonios: {
        ...p.testimonios,
        lista: [...p.testimonios.lista, { nombre: "", comentario: "", estrellas: 5 }],
      },
    }));
  const quitarTesti = (i) =>
    setDatos((p) => ({
      ...p,
      testimonios: {
        ...p.testimonios,
        lista: p.testimonios.lista.filter((_, idx) => idx !== i),
      },
    }));

  // Ubicación (mapa).
  const setUbic = (campo) => (ev) =>
    setDatos((p) => ({ ...p, ubicacion: { ...p.ubicacion, [campo]: ev.target.value } }));

  const claseFieldset =
    "rounded-2xl border border-linea bg-superficie p-6";
  const claseLegend = "px-1 font-display text-lg font-bold text-navy";
  // Estilo del <select> (estrellas), con los mismos tokens que CampoFormulario.
  const claseSelect =
    "mt-1.5 w-full rounded-xl border border-linea bg-superficie px-4 py-3 text-sm text-navy outline-none transition duration-150 focus:ring-2 focus:ring-acento";

  // Editor de un documento legal (título + intro + secciones editables).
  const renderLegal = (doc, etiqueta) => (
    <fieldset className={claseFieldset}>
      <legend className={claseLegend}>{etiqueta}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoFormulario id={`leg-${doc}-titulo`} etiqueta="Título" valor={datos.legales[doc].titulo} onChange={setLegal(doc, "titulo")} />
        <CampoFormulario id={`leg-${doc}-intro`} etiqueta="Intro" valor={datos.legales[doc].intro} onChange={setLegal(doc, "intro")} />
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {datos.legales[doc].secciones.map((s, i) => (
          <div key={i} className="rounded-xl border border-linea p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-navy">Sección {i + 1}</span>
              <button type="button" onClick={quitarSeccion(doc, i)} className="text-xs font-medium text-error hover:underline">
                Quitar
              </button>
            </div>
            <div className="mt-2 flex flex-col gap-4">
              <CampoFormulario id={`leg-${doc}-${i}-titulo`} etiqueta="Encabezado" valor={s.titulo} onChange={setSeccion(doc, i, "titulo")} />
              <div>
                <label htmlFor={`leg-${doc}-${i}-texto`} className="block text-sm font-semibold text-navy">
                  Texto
                </label>
                <textarea
                  id={`leg-${doc}-${i}-texto`}
                  rows={4}
                  value={s.texto}
                  onChange={setSeccion(doc, i, "texto")}
                  className="mt-1.5 w-full rounded-xl border border-linea bg-superficie px-4 py-3 text-sm text-navy outline-none transition duration-150 focus:ring-2 focus:ring-acento"
                />
                <p className="mt-1 text-xs text-texto-suave">
                  Deja una línea en blanco para separar párrafos.
                </p>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={agregarSeccion(doc)} className="w-fit rounded-full border border-linea px-4 py-2 text-sm font-semibold text-navy transition duration-150 hover:bg-acento-suave active:scale-95">
          + Agregar sección
        </button>
      </div>
    </fieldset>
  );

  const SEO_PAGINAS = [
    { clave: "home", nombre: "Home" },
    { clave: "catalogo", nombre: "Catálogo" },
    { clave: "ayuda", nombre: "Ayuda" },
    { clave: "enviosYGarantia", nombre: "Envíos y garantía" },
    { clave: "terminos", nombre: "Términos" },
    { clave: "privacidad", nombre: "Privacidad" },
  ];

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

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>Preguntas frecuentes (/ayuda)</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFormulario id="faq-titulo" etiqueta="Título" valor={datos.faq.titulo} onChange={setFaq("titulo")} />
          <CampoFormulario id="faq-intro" etiqueta="Intro" valor={datos.faq.intro} onChange={setFaq("intro")} />
          <CampoFormulario id="faq-ctaTitulo" etiqueta="Tarjeta final · Título" valor={datos.faq.ctaTitulo} onChange={setFaq("ctaTitulo")} />
          <CampoFormulario id="faq-ctaTexto" etiqueta="Tarjeta final · Texto" valor={datos.faq.ctaTexto} onChange={setFaq("ctaTexto")} />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {datos.faq.preguntas.map((q, i) => (
            <div key={i} className="rounded-xl border border-linea p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-navy">Pregunta {i + 1}</span>
                <button
                  type="button"
                  onClick={() => quitarPregunta(i)}
                  className="text-xs font-medium text-error hover:underline"
                >
                  Quitar
                </button>
              </div>
              <div className="mt-2 grid gap-4">
                <CampoFormulario id={`faq-q-${i}`} etiqueta="Pregunta" valor={q.pregunta} onChange={setPregunta(i, "pregunta")} />
                <CampoFormulario id={`faq-r-${i}`} etiqueta="Respuesta" valor={q.respuesta} onChange={setPregunta(i, "respuesta")} />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={agregarPregunta}
            className="w-fit rounded-full border border-linea px-4 py-2 text-sm font-semibold text-navy transition duration-150 hover:bg-acento-suave active:scale-95"
          >
            + Agregar pregunta
          </button>
        </div>
      </fieldset>

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>Footer</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFormulario id="ft-tagline" etiqueta="Tagline" valor={datos.footer.tagline} onChange={set("footer", "tagline")} />
          <CampoFormulario id="ft-credito" etiqueta="Crédito (nombre)" valor={datos.footer.credito} onChange={set("footer", "credito")} />
          <CampoFormulario id="ft-tienda" etiqueta="Título columna «Tienda»" valor={datos.footer.tituloTienda} onChange={set("footer", "tituloTienda")} />
          <CampoFormulario id="ft-ayuda" etiqueta="Título columna «Ayuda»" valor={datos.footer.tituloAyuda} onChange={set("footer", "tituloAyuda")} />
          <CampoFormulario id="ft-contacto" etiqueta="Título columna «Contacto»" valor={datos.footer.tituloContacto} onChange={set("footer", "tituloContacto")} />
          <CampoFormulario id="ft-copy" etiqueta="Línea de copyright" valor={datos.footer.copyright} onChange={set("footer", "copyright")} />
        </div>
      </fieldset>

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>Contacto</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <CampoFormulario id="ct-whatsapp" etiqueta="WhatsApp (solo dígitos)" valor={datos.contacto.whatsapp} onChange={set("contacto", "whatsapp")} inputMode="numeric" />
          <CampoFormulario id="ct-telefono" etiqueta="Teléfono visible" valor={datos.contacto.telefono} onChange={set("contacto", "telefono")} />
          <CampoFormulario id="ct-ciudad" etiqueta="Ciudad" valor={datos.contacto.ciudad} onChange={set("contacto", "ciudad")} />
        </div>
      </fieldset>

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>Badges de la ficha de producto</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          {datos.fichaBadges.map((b, i) => (
            <CampoFormulario key={i} id={`badge-${i}`} etiqueta={`Badge ${i + 1}`} valor={b} onChange={setBadge(i)} />
          ))}
        </div>
      </fieldset>

      {renderLegal("enviosYGarantia", "Legal · Envíos y garantía")}
      {renderLegal("terminos", "Legal · Términos y condiciones")}
      {renderLegal("privacidad", "Legal · Política de privacidad")}

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>SEO (título y descripción por página)</legend>
        <div className="flex flex-col gap-5">
          {SEO_PAGINAS.map(({ clave, nombre }) => (
            <div key={clave}>
              <p className="text-sm font-semibold text-navy">{nombre}</p>
              <div className="mt-1.5 grid gap-4 sm:grid-cols-2">
                <CampoFormulario id={`seo-${clave}-title`} etiqueta="Título (title)" valor={datos.seo[clave].title} onChange={setSeo(clave, "title")} />
                <CampoFormulario id={`seo-${clave}-desc`} etiqueta="Descripción" valor={datos.seo[clave].description} onChange={setSeo(clave, "description")} />
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>Testimonios</legend>
        <CampoFormulario id="testi-titulo" etiqueta="Título de la sección" valor={datos.testimonios.titulo} onChange={setTesti("titulo")} />
        <div className="mt-4 flex flex-col gap-4">
          {datos.testimonios.lista.map((t, i) => (
            <div key={i} className="rounded-xl border border-linea p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-navy">Testimonio {i + 1}</span>
                <button type="button" onClick={() => quitarTesti(i)} className="text-xs font-medium text-error hover:underline">
                  Quitar
                </button>
              </div>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <CampoFormulario id={`testi-${i}-nombre`} etiqueta="Nombre" valor={t.nombre} onChange={setTestiItem(i, "nombre")} />
                <div>
                  <label htmlFor={`testi-${i}-estrellas`} className="block text-sm font-semibold text-navy">
                    Estrellas
                  </label>
                  <select
                    id={`testi-${i}-estrellas`}
                    value={t.estrellas}
                    onChange={setTestiItem(i, "estrellas")}
                    className={claseSelect}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <CampoFormulario id={`testi-${i}-comentario`} etiqueta="Comentario" valor={t.comentario} onChange={setTestiItem(i, "comentario")} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={agregarTesti} className="w-fit rounded-full border border-linea px-4 py-2 text-sm font-semibold text-navy transition duration-150 hover:bg-acento-suave active:scale-95">
            + Agregar testimonio
          </button>
        </div>
      </fieldset>

      <fieldset className={claseFieldset}>
        <legend className={claseLegend}>Ubicación (mapa)</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFormulario id="ubic-titulo" etiqueta="Título" valor={datos.ubicacion.titulo} onChange={setUbic("titulo")} />
          <CampoFormulario id="ubic-subtitulo" etiqueta="Subtítulo / cobertura" valor={datos.ubicacion.subtitulo} onChange={setUbic("subtitulo")} />
          <div className="sm:col-span-2">
            <CampoFormulario id="ubic-direccion" etiqueta="Dirección (la usa el mapa)" valor={datos.ubicacion.direccion} onChange={setUbic("direccion")} />
          </div>
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
