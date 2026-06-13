import { Suspense } from "react";
import { filtrar } from "@/lib/catalogo";
import ProductCard from "@/components/ProductCard";
import FiltrosCatalogo from "@/components/FiltrosCatalogo";

export const metadata = {
  title: "Catálogo — RODA",
  description:
    "Explora todas nuestras llantas para carro y moto. Filtra por tipo, marca y medida.",
};

export default async function Catalogo({ searchParams }) {
  // searchParams es una Promise en este Next → hay que await.
  const sp = await searchParams;

  const resultados = filtrar({
    tipo: sp.tipo ?? "",
    marca: sp.marca ?? "",
    ancho: sp.ancho ?? "",
    perfil: sp.perfil ?? "",
    rin: sp.rin ?? "",
  });

  return (
    <section className="bg-fondo">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <header className="mb-6">
          <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            Catálogo
          </h1>
          <p className="mt-1 text-sm text-texto-suave">
            {resultados.length} {resultados.length === 1 ? "llanta" : "llantas"}
          </p>
        </header>

        {/* useSearchParams (dentro de FiltrosCatalogo) requiere un Suspense */}
        <Suspense fallback={null}>
          <FiltrosCatalogo />
        </Suspense>

        {resultados.length === 0 ? (
          <div className="rounded-2xl border border-linea bg-superficie p-10 text-center">
            <p className="font-display text-xl font-semibold text-navy">
              No encontramos llantas con esa medida
            </p>
            <p className="mt-1 text-sm text-texto-suave">
              Prueba con otra combinación o limpia los filtros.
            </p>
            <a
              href="/catalogo"
              className="mt-4 inline-flex rounded-full bg-acento px-5 py-2.5 text-sm font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95"
            >
              Limpiar filtros
            </a>
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
