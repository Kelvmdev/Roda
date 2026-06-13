import Link from "next/link";
import { notFound } from "next/navigation";
import FormularioProducto from "@/components/FormularioProducto";
import { leerProductos } from "@/lib/productos-fs";
import { actualizarProducto } from "../acciones";

export const metadata = {
  title: "Editar llanta — Panel RODA",
  robots: { index: false, follow: false },
};

// Leemos el archivo en cada request para editar siempre la versión actual.
export const dynamic = "force-dynamic";

export default async function EditarLlantaPage({ params }) {
  const { slug } = await params;
  const productos = await leerProductos();
  const producto = productos.find((p) => p.slug === slug);
  if (!producto) notFound();

  return (
    <div className="bg-fondo">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/admin"
          className="text-sm font-semibold text-acento transition-colors hover:text-navy"
        >
          <span aria-hidden="true">←</span> Volver al panel
        </Link>

        <h1 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl">
          Editar llanta
        </h1>
        <p className="mt-1 text-sm text-texto-suave">
          {producto.marca} {producto.modelo}
        </p>

        <div className="mt-6">
          <FormularioProducto
            producto={producto}
            accion={actualizarProducto}
            textoBoton="Guardar cambios"
          />
        </div>
      </div>
    </div>
  );
}
