// Estructura común de las páginas legales (DRY §5.2): contenedor, h1, intro y
// secciones con h2 (orden de headings correcto, §5.11). El contenido se pasa
// como datos (`secciones`), así cada página solo define su texto.
export default function PaginaLegal({ titulo, intro, secciones }) {
  return (
    <div className="bg-fondo">
      <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
        <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          {titulo}
        </h1>
        {intro && <p className="mt-2 text-sm text-texto-suave">{intro}</p>}

        <div className="mt-8 flex flex-col gap-8">
          {secciones.map((s) => (
            <section key={s.titulo}>
              <h2 className="font-display text-xl font-bold text-navy">
                {s.titulo}
              </h2>
              {/* El texto puede traer varios párrafos separados por línea en blanco. */}
              {s.texto.split(/\n\s*\n/).map((parrafo, i) => (
                <p
                  key={i}
                  className="mt-2 text-sm leading-relaxed text-texto-suave"
                >
                  {parrafo}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
