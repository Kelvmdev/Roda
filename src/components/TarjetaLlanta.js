// Tarjeta de producto (presentacional). Se repite en la grilla → componente (DRY §5.2).

// Placeholder visual: una llanta dibujada en SVG (sin imágenes reales por ahora).
function LlantaSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28" aria-hidden="true">
      <circle cx="50" cy="50" r="48" className="fill-navy" />
      <circle cx="50" cy="50" r="33" className="fill-superficie" />
      {/* Rayos del rin */}
      {[0, 72, 144, 216, 288].map((deg) => (
        <rect
          key={deg}
          x="47"
          y="20"
          width="6"
          height="30"
          rx="3"
          className="fill-navy"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="9" className="fill-acento" />
    </svg>
  );
}

export default function TarjetaLlanta({ marca, modelo, medida, precio }) {
  const precioCOP = `$${precio.toLocaleString("es-CO")}`;

  return (
    <article className="flex flex-col rounded-2xl border border-linea bg-superficie p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Imagen placeholder */}
      <div className="mb-4 grid place-items-center rounded-xl bg-fondo py-6">
        <LlantaSVG />
      </div>

      {/* Datos */}
      <p className="text-xs font-medium uppercase tracking-wide text-texto-suave">
        {marca}
      </p>
      <h3 className="font-display text-lg font-semibold leading-tight text-navy">
        {modelo}
      </h3>
      <span className="mt-2 inline-flex w-fit rounded-full bg-acento-suave px-2.5 py-1 text-xs font-semibold text-acento">
        {medida}
      </span>

      {/* Precio + agregar */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-bold text-navy">{precioCOP}</p>
        <button
          type="button"
          aria-label={`Agregar ${marca} ${modelo} al carrito`}
          className="grid h-10 w-10 place-items-center rounded-full bg-acento text-superficie transition duration-150 hover:bg-navy active:scale-95"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
