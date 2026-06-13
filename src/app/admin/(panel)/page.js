import Link from "next/link";
import { leerProductos } from "@/lib/productos-store";
import { medidaDe, formatoPrecio } from "@/lib/catalogo";
import BotonBorrarProducto from "@/components/BotonBorrarProducto";
import { borrarProducto } from "./productos/acciones";
import { cerrarSesion } from "../acciones";

export const metadata = {
  title: "Panel RODA",
  robots: { index: false, follow: false },
};

// Siempre leemos el archivo actual (no una versión cacheada): así el panel
// muestra el resultado de sus propios cambios al instante.
export const dynamic = "force-dynamic";

export default async function AdminPanel({ searchParams }) {
  const sp = await searchParams;
  const productos = await leerProductos();

  return (
    <div className="bg-fondo">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Encabezado */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
              Panel RODA
            </h1>
            <p className="mt-1 text-sm text-texto-suave">
              {productos.length} {productos.length === 1 ? "llanta" : "llantas"} en
              el catálogo.
            </p>
          </div>
          <form action={cerrarSesion}>
            <button
              type="submit"
              className="rounded-full border border-linea px-5 py-2.5 text-sm font-semibold text-navy transition duration-150 hover:bg-acento-suave active:scale-95"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        {/* Aviso de error (p. ej. si falla un borrado contra GitHub). */}
        {sp?.error && (
          <p
            role="alert"
            aria-live="assertive"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {sp.error}
          </p>
        )}

        <div className="mt-6">
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center gap-1 rounded-full bg-acento px-5 py-2.5 text-sm font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95"
          >
            <span aria-hidden="true">+</span> Agregar llanta
          </Link>
        </div>

        {/* Lista de llantas */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-linea bg-superficie">
          <table className="w-full text-sm">
            <caption className="sr-only">Llantas del catálogo</caption>
            <thead>
              <tr className="border-b border-linea text-left text-texto-suave">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Marca
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Modelo
                </th>
                <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">
                  Medida
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Precio
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.slug} className="border-b border-linea last:border-0">
                  <td className="px-4 py-3 font-medium text-navy">{p.marca}</td>
                  <td className="px-4 py-3 text-navy">{p.modelo}</td>
                  <td className="hidden px-4 py-3 text-texto-suave sm:table-cell">
                    {medidaDe(p)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-navy">
                    {formatoPrecio(p.precio)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/productos/${p.slug}`}
                        className="rounded-full px-3 py-1.5 text-sm font-semibold text-acento transition duration-150 hover:bg-acento-suave active:scale-95"
                      >
                        Editar
                      </Link>
                      <BotonBorrarProducto
                        slug={p.slug}
                        nombre={`${p.marca} ${p.modelo} ${medidaDe(p)}`}
                        accion={borrarProducto}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
