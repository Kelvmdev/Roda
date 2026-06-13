// Prueba social (§5.0): tarjetas con nombre, estrellas y comentario.
// Se oculta solo si la lista está realmente vacía.

// Estrellas accesibles (§5.11): el contenedor lleva role="img" + aria-label con
// el texto ("4 de 5 estrellas"); las estrellas visuales van aria-hidden.
function Estrellas({ n }) {
  return (
    <span role="img" aria-label={`${n} de 5 estrellas`} className="inline-flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className={i <= n ? "text-acento" : "text-linea"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function Testimonios({ titulo, lista }) {
  if (!lista || lista.length === 0) return null;

  return (
    <section className="bg-fondo">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
          {titulo}
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((t, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-2xl border border-linea bg-superficie p-6 shadow-sm"
            >
              <Estrellas n={t.estrellas} />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-texto-suave">
                “{t.comentario}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-navy">
                {t.nombre}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
