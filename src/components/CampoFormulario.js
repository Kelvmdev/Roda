// Campo de texto reutilizable para formularios (DRY §5.2).
// Un solo componente para todos los inputs: label asociado, aria-invalid y el
// error enlazado por aria-describedby + aria-live (a11y §5.11).
// Se usa en /checkout y se reutilizará en los formularios de cuenta.
//
// Props:
//   id           identificador único (también del <label> y del id de error)
//   name         atributo name del input (para FormData/Server Actions; default = id)
//   etiqueta     texto visible del <label>
//   valor        valor controlado del input
//   onChange     handler de cambio
//   onBlur       handler al salir del campo (opcional)
//   error        mensaje de error a mostrar (falsy = sin error)
//   tipo         type del input (default "text")
//   inputMode    pista de teclado en móvil ("tel", "email"…)
//   autoComplete valor de autocompletado del navegador ("name", "tel"…)
//   placeholder  texto de ejemplo
//   inputRef     ref al <input> (para mover el foco al primer campo con error)
export default function CampoFormulario({
  id,
  name,
  etiqueta,
  valor,
  onChange,
  onBlur,
  error,
  tipo = "text",
  inputMode,
  autoComplete,
  placeholder,
  inputRef,
}) {
  const idError = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy">
        {etiqueta}
      </label>
      <input
        id={id}
        name={name ?? id}
        ref={inputRef}
        type={tipo}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={valor}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? idError : undefined}
        className={`mt-1.5 w-full rounded-xl border bg-superficie px-4 py-3 text-sm text-navy outline-none transition duration-150 placeholder:text-texto-suave/70 focus:ring-2 focus:ring-acento ${
          error ? "border-red-500" : "border-linea"
        }`}
      />
      {/* aria-live: el lector anuncia el error en cuanto aparece (§5.11) */}
      <p id={idError} aria-live="polite" className="min-h-5 text-xs text-red-600">
        {error}
      </p>
    </div>
  );
}
