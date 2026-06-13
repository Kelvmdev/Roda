"use client";

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
      <button
        type="submit"
        className="rounded-full px-3 py-1.5 text-sm font-semibold text-red-600 transition duration-150 hover:bg-red-50 active:scale-95"
      >
        Borrar
      </button>
    </form>
  );
}
