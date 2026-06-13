import { notFound } from "next/navigation";
import Link from "next/link";
import productos from "@/data/productos.json";
import { porSlug, similares, formatoPrecio, medidaDe } from "@/lib/catalogo";
import { construirMeta, SITE_URL } from "@/lib/seo";
import ImagenProducto from "@/components/ImagenProducto";
import ProductCard from "@/components/ProductCard";
import BotonAgregar from "@/components/BotonAgregar";

// Pre-genera una página por cada slug en build (rápido + SEO).
export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

// Título y descripción propios por producto (SEO §6.2).
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const producto = porSlug(slug);
  if (!producto) {
    return { title: "Producto no encontrado — RODA" };
  }
  const medida = medidaDe(producto);
  return construirMeta({
    title: `${producto.marca} ${producto.modelo} ${medida} — RODA`,
    description:
      producto.descripcion ||
      `Llanta ${producto.marca} ${producto.modelo} medida ${medida}, con instalación y garantía en RODA.`,
    path: `/producto/${slug}`,
  });
}

const CONFIANZA = [
  "Instalación incluida",
  "Garantía hasta 5 años",
  "Envío 24–48 h",
];

export default async function ProductoPage({ params }) {
  const { slug } = await params;
  const producto = porSlug(slug);
  if (!producto) notFound();

  const { marca, modelo, tipo, precio, etiqueta, descripcion } = producto;
  const medida = medidaDe(producto);
  const relacionadas = similares(producto, 4);

  const especificaciones = [
    ["Tipo", tipo === "moto" ? "Moto" : "Carro"],
    ["Ancho", producto.ancho],
    ["Perfil", producto.perfil],
    ["Rin", producto.rin],
  ];

  // Datos estructurados Product + Offer (§6.2): habilitan resultados
  // enriquecidos en Google (precio, disponibilidad, marca…). Es un JSON que el
  // buscador lee; no se ve en la página.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${marca} ${modelo} ${medida}`,
    description:
      descripcion || `Llanta ${marca} ${modelo} medida ${medida}.`,
    brand: { "@type": "Brand", name: marca },
    sku: slug,
    image: producto.imagen || `${SITE_URL}/og`,
    offers: {
      "@type": "Offer",
      price: precio,
      priceCurrency: "COP",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/producto/${slug}`,
    },
  };

  return (
    <div className="bg-fondo">
      {/* Datos estructurados para Google (no visible). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <Link
          href="/catalogo"
          className="text-sm font-semibold text-acento-fuerte transition-colors hover:text-navy"
        >
          <span aria-hidden="true">←</span> Volver al catálogo
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Imagen grande (principal = LCP → priority). */}
          <div className="relative grid aspect-square place-items-center rounded-2xl border border-linea bg-superficie">
            <ImagenProducto
              imagen={producto.imagen}
              alt={`Llanta ${marca} ${modelo} ${medida}`}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              ancho={800}
              imgClassName="object-contain p-8"
              svgClassName="h-56 w-56 sm:h-72 sm:w-72"
            />
          </div>

          {/* Ficha */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-texto-suave">
              {marca}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-navy sm:text-4xl">
              {modelo}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-acento-suave px-3 py-1 text-sm font-semibold text-navy">
                {medida}
              </span>
              {etiqueta && (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    etiqueta === "Oferta"
                      ? "bg-acento text-superficie"
                      : "bg-navy text-superficie"
                  }`}
                >
                  {etiqueta}
                </span>
              )}
            </div>

            <p className="mt-4 text-base text-texto-suave">{descripcion}</p>

            <p className="mt-6 text-3xl font-bold text-navy">
              {formatoPrecio(precio)}
            </p>

            <BotonAgregar producto={producto} variante="completo" />

            {/* Badges de confianza */}
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {CONFIANZA.map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 text-sm font-medium text-texto"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 text-acento"
                    aria-hidden="true"
                  >
                    <path
                      d="M20 6 9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>

            {/* Especificaciones */}
            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-navy">
                Especificaciones
              </h2>
              <table className="mt-2 w-full text-sm">
                <tbody>
                  {especificaciones.map(([clave, valor]) => (
                    <tr key={clave} className="border-b border-linea">
                      <th
                        scope="row"
                        className="py-2 text-left font-medium text-texto-suave"
                      >
                        {clave}
                      </th>
                      <td className="py-2 text-right font-semibold text-navy">
                        {valor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Llantas similares */}
        {relacionadas.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-bold text-navy sm:text-3xl">
              Llantas similares
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relacionadas.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
