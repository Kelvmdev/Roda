// Logo de marca RODA. Reutilizable (Header y Footer) → DRY (§5.2).
// variante "claro" invierte los colores para fondos oscuros (footer navy).
export default function Logo({ variante = "oscuro", className = "" }) {
  const ro = variante === "claro" ? "text-superficie" : "text-navy";
  const da = "text-acento";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Círculo tipo llanta: aro + agujero + buje. Decorativo. */}
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden="true">
        <circle cx="16" cy="16" r="15" className="fill-acento" />
        <circle cx="16" cy="16" r="11" className="fill-navy" />
        <circle cx="16" cy="16" r="4" className="fill-superficie" />
      </svg>
      <span className="font-display font-bold text-2xl tracking-tight leading-none">
        <span className={ro}>RO</span>
        <span className={da}>DA</span>
      </span>
    </span>
  );
}
