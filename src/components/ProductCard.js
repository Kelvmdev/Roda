// Tarjeta de producto reutilizable (home "Más vendidas", catálogo, similares) → DRY §5.2.
import Link from "next/link";
import ImagenProducto from "@/components/ImagenProducto";
import BotonAgregar from "@/components/BotonAgregar";
import { formatoPrecio, medidaDe } from "@/lib/catalogo";

export default function ProductCard({ producto }) {
  const { slug, marca, modelo, etiqueta } = producto;

  const medida = medidaDe(producto);
  const href = `/producto/${slug}`;
  // "Oferta" en acento, cualquier otra (p.ej. "Top") en navy.
  const estiloEtiqueta =
    etiqueta === "Oferta" ? "bg-acento text-superficie" : "bg-navy text-superficie";

  return (
    <article className="relative flex flex-col rounded-2xl border border-linea bg-superficie p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Etiqueta opcional */}
      {etiqueta && (
        <span
          className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-xs font-semibold ${estiloEtiqueta}`}
        >
          {etiqueta}
        </span>
      )}

      {/* Imagen (enlace decorativo, fuera del orden de tabulación para no duplicar) */}
      <Link
        href={href}
        aria-hidden="true"
        tabIndex={-1}
        className="relative mb-4 grid aspect-[16/10] place-items-center overflow-hidden rounded-xl bg-fondo"
      >
        <ImagenProducto
          imagen={producto.imagen}
          alt={`${marca} ${modelo} ${medida}`}
          decorativa
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          ancho={500}
          svgClassName="h-24 w-24"
        />
      </Link>

      {/* Datos */}
      <p className="text-xs font-medium uppercase tracking-wide text-texto-suave">
        {marca}
      </p>
      <h3 className="font-display text-lg font-semibold leading-tight text-navy">
        <Link href={href} className="transition-colors hover:text-acento-fuerte">
          {modelo}
        </Link>
      </h3>
      <span className="mt-2 inline-flex w-fit rounded-full bg-acento-suave px-2.5 py-1 text-xs font-semibold text-navy">
        {medida}
      </span>

      {/* Precio + agregar */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-bold text-navy">{formatoPrecio(producto.precio)}</p>
        <BotonAgregar producto={producto} variante="icono" />
      </div>
    </article>
  );
}
