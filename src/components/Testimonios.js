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

// Renderiza solo su contenido (sin <section>): la home lo coloca en una columna
// de la rejilla de dos columnas. Se oculta si la lista está realmente vacía.
export default function Testimonios({ titulo, lista }) {
  if (!lista || lista.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
        {titulo}
      </h2>

      {/* Tarjetas apiladas verticalmente (columna izquierda). */}
      <div className="mt-6 flex flex-col gap-4">
        {lista.map((t, i) => (
          <figure
            key={i}
            className="rounded-2xl border border-linea bg-superficie p-6 shadow-sm"
          >
            <Estrellas n={t.estrellas} />
            <blockquote className="mt-3 text-sm leading-relaxed text-texto-suave">
              “{t.comentario}”
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-navy">
              {t.nombre}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
