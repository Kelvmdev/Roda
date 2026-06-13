import Link from "next/link";
import Buscador from "@/components/Buscador";
import ProductCard from "@/components/ProductCard";
import productos from "@/data/productos.json";
import contenido from "@/data/contenido.json";
import { construirMeta } from "@/lib/seo";

export const metadata = construirMeta({
  clave: "home",
  title: "RODA — Llantas para carro y moto con instalación en Medellín",
  description:
    "Encuentra tu medida exacta y compra llantas para carro y moto con asesoría, garantía e instalación incluida. Paga contraentrega o por transferencia. Envío en Medellín.",
  path: "/",
});

// Iconos de la franja de confianza (en el mismo orden que contenido.confianza).
// Los textos vienen del CMS; los iconos se quedan en código (no son editables).
const ICONOS = [
  <path
    key="instalacion"
    d="M14.5 3a4 4 0 0 0-1.4 7.8L4 19.9 6.1 22l9.1-9.1A4 4 0 1 0 14.5 3Z"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
  />,
  <path
    key="garantia"
    d="M12 3 5 6v5c0 4.4 3 8 7 10 4-2 7-5.6 7-10V6l-7-3Z"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
  />,
  <g key="envio" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </g>,
  <g key="pago" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </g>,
];

// Destacados derivados de los datos (§5.6): un solo origen de verdad.
const DESTACADAS = productos.filter((p) => p.destacado);

export default function Home() {
  return (
    <>
      {/* 1. HERO */}
      <section className="bg-fondo">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-2 lg:py-20">
          {/* Izquierda: mensaje */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-acento-fuerte">
              {contenido.hero.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl lg:text-6xl">
              {contenido.hero.titulo}{" "}
              <span className="text-acento-fuerte">{contenido.hero.tituloAcento}</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-texto-suave sm:text-lg">
              {contenido.hero.subtitulo}
            </p>
          </div>

          {/* Derecha: tarjeta buscador */}
          <Buscador />
        </div>
      </section>

      {/* 2. FRANJA DE CONFIANZA */}
      <section className="bg-fondo">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 lg:grid-cols-4">
          {contenido.confianza.map((item, i) => (
            <div
              key={item.titulo}
              className="flex items-center gap-3 rounded-2xl border border-linea bg-superficie p-4 shadow-sm"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-acento-suave text-acento">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                  {ICONOS[i]}
                </svg>
              </span>
              <span>
                <span className="block text-sm font-semibold text-navy">
                  {item.titulo}
                </span>
                <span className="block text-xs text-texto-suave">{item.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DESTACADOS */}
      <section className="bg-fondo">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
              {contenido.masVendidas.titulo}
            </h2>
            <Link
              href="/catalogo"
              className="text-sm font-semibold text-acento-fuerte transition-colors hover:text-navy"
            >
              {contenido.masVendidas.enlace} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DESTACADAS.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
