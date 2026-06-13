// Placeholder visual de una llanta (sin imágenes reales por ahora).
// Si recibe `label`, se anuncia como imagen accesible; si no, es decorativo.
export default function LlantaSVG({ className = "h-28 w-28", label }) {
  const a11y = label
    ? { role: "img", "aria-label": label }
    : { "aria-hidden": "true" };

  return (
    <svg viewBox="0 0 100 100" className={className} {...a11y}>
      <circle cx="50" cy="50" r="48" className="fill-navy" />
      <circle cx="50" cy="50" r="33" className="fill-superficie" />
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
