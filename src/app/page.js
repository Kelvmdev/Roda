import Buscador from "@/components/Buscador";
import TarjetaLlanta from "@/components/TarjetaLlanta";

// --- Datos estáticos (presentacional; luego vendrán de datos reales) ---
const CONFIANZA = [
  {
    titulo: "Instalación incluida",
    sub: "En tu compra",
    icono: (
      <path
        d="M14.5 3a4 4 0 0 0-1.4 7.8L4 19.9 6.1 22l9.1-9.1A4 4 0 1 0 14.5 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
  },
  {
    titulo: "Garantía real",
    sub: "Hasta 5 años",
    icono: (
      <path
        d="M12 3 5 6v5c0 4.4 3 8 7 10 4-2 7-5.6 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
  },
  {
    titulo: "Envío rápido",
    sub: "24–48 h",
    icono: (
      <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </g>
    ),
  },
  {
    titulo: "Pago seguro",
    sub: "Tarjeta o efectivo",
    icono: (
      <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </g>
    ),
  },
];

const DESTACADAS = [
  { marca: "Michelin", modelo: "Primacy 4", medida: "205/55 R16", precio: 389900 },
  { marca: "Pirelli", modelo: "Cinturato P7", medida: "195/65 R15", precio: 329900 },
  { marca: "Bridgestone", modelo: "Turanza T005", medida: "225/45 R17", precio: 519900 },
  { marca: "Michelin", modelo: "Pilot Street", medida: "110/70 R17", precio: 249900 },
];

export default function Home() {
  return (
    <>
      {/* 1. HERO */}
      <section className="bg-fondo">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-2 lg:py-20">
          {/* Izquierda: mensaje */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-acento">
              Llantas para carro y moto
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl lg:text-6xl">
              El agarre que te lleva <span className="text-acento">a casa.</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-texto-suave sm:text-lg">
              Encuentra la medida exacta para tu vehículo, con garantía real e
              instalación incluida. Sin vueltas: tú eliges, nosotros montamos.
            </p>
          </div>

          {/* Derecha: tarjeta buscador */}
          <Buscador />
        </div>
      </section>

      {/* 2. FRANJA DE CONFIANZA */}
      <section className="bg-fondo">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 lg:grid-cols-4">
          {CONFIANZA.map((item) => (
            <div
              key={item.titulo}
              className="flex items-center gap-3 rounded-2xl border border-linea bg-superficie p-4 shadow-sm"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-acento-suave text-acento">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                  {item.icono}
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
              Más vendidas
            </h2>
            <a
              href="#"
              className="text-sm font-semibold text-acento transition-colors hover:text-navy"
            >
              Ver todo el catálogo <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DESTACADAS.map((p) => (
              <TarjetaLlanta key={`${p.modelo}-${p.medida}`} {...p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
