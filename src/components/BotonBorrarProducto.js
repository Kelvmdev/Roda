"use client";

import { useFormStatus } from "react-dom";

// Botón submit que conoce el estado del <form> padre (useFormStatus): mientras
// la acción corre, `pending` es true → lo deshabilitamos y mostramos "Borrando…"
// (feedback §5.5). Debe vivir DENTRO del <form> para leer ese estado.
function BotonSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full px-3 py-1.5 text-sm font-semibold text-error transition duration-150 hover:bg-error-suave active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
    >
      {pending ? "Borrando…" : "Borrar"}
    </button>
  );
}

// Botón de borrar con confirmación. El <form> llama al Server Action; si el
// usuario cancela el confirm, `preventDefault` impide que la acción se ejecute.
export default function BotonBorrarProducto({ slug, nombre, accion }) {
  return (
    <form
      action={accion}
      onSubmit={(ev) => {
        if (!window.confirm(`¿Borrar "${nombre}"? Esta acción no se puede deshacer.`)) {
          ev.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <BotonSubmit />
    </form>
  );
}
