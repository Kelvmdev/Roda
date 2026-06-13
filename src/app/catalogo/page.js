import { Suspense } from "react";
import Link from "next/link";
import { filtrar } from "@/lib/catalogo";
import ProductCard from "@/components/ProductCard";
import FiltrosCatalogo from "@/components/FiltrosCatalogo";
import { construirMeta } from "@/lib/seo";

export const metadata = construirMeta({
  clave: "catalogo",
  title: "Catálogo de llantas para carro y moto — RODA",
  description:
    "Explora todas nuestras llantas para carro y moto. Filtra por tipo, marca y medida, y encuentra la tuya con instalación incluida en Medellín.",
  path: "/catalogo",
});

export default async function Catalogo({ searchParams }) {
  // searchParams es una Promise en este Next → hay que await.
  const sp = await searchParams;

  const resultados = filtrar({
    tipo: sp.tipo ?? "",
    marca: sp.marca ?? "",
    ancho: sp.ancho ?? "",
    perfil: sp.perfil ?? "",
    rin: sp.rin ?? "",
    etiqueta: sp.etiqueta ?? "",
    q: sp.q ?? "",
  });

  // Subtítulo según lo que se esté viendo (búsqueda u oferta).
  let contexto = null;
  if (sp.q) contexto = `Resultados para «${sp.q}»`;
  else if (sp.etiqueta) contexto = `Llantas en ${sp.etiqueta}`;

  return (
    <section className="bg-fondo">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <header className="mb-6">
          <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            Catálogo
          </h1>
          <p className="mt-1 text-sm text-texto-suave">
            {contexto && <span className="font-medium text-navy">{contexto} · </span>}
            {resultados.length} {resultados.length === 1 ? "llanta" : "llantas"}
          </p>
        </header>

        {/* useSearchParams (dentro de FiltrosCatalogo) requiere un Suspense */}
        <Suspense fallback={null}>
          <FiltrosCatalogo />
        </Suspense>

        {/* Heading de la lista (sr-only) para no saltar de h1 a h3 (§5.11). */}
        <h2 className="sr-only">Resultados</h2>

        {resultados.length === 0 ? (
          <div className="rounded-2xl border border-linea bg-superficie p-10 text-center">
            <p className="font-display text-xl font-semibold text-navy">
              No encontramos llantas con esos criterios
            </p>
            <p className="mt-1 text-sm text-texto-suave">
              Prueba con otra combinación o limpia los filtros.
            </p>
            <Link
              href="/catalogo"
              className="mt-4 inline-flex rounded-full bg-acento px-5 py-2.5 text-sm font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95"
            >
              Limpiar filtros
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resultados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
