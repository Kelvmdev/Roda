import Link from "next/link";
import Logo from "./Logo";
import BotonWhatsApp from "./BotonWhatsApp";
import { WHATSAPP_TEL, WHATSAPP_DISPLAY } from "@/lib/config";

// Enlaces por columna (una sola fuente de verdad, DRY §5.2).
const TIENDA = [
  { label: "Carros", href: "/catalogo?tipo=carro" },
  { label: "Motos", href: "/catalogo?tipo=moto" },
  { label: "Ofertas", href: "/catalogo?etiqueta=Oferta" },
  { label: "Catálogo", href: "/catalogo" },
];

const AYUDA = [
  { label: "Preguntas frecuentes", href: "/ayuda" },
  { label: "Envíos y garantía", href: "/envios-y-garantia" },
  { label: "Términos", href: "/terminos" },
  { label: "Privacidad", href: "/privacidad" },
];

// Columna de enlaces reutilizable. <nav aria-label> = landmark navegable para
// lectores de pantalla (§5.11).
function Columna({ titulo, enlaces }) {
  return (
    <nav aria-label={titulo} className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-superficie/70">
        {titulo}
      </h2>
      <ul className="flex flex-col gap-2">
        {enlaces.map((e) => (
          <li key={e.href}>
            <Link
              href={e.href}
              className="text-sm text-superficie/80 transition-colors hover:text-superficie"
            >
              {e.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="bg-navy text-superficie">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca + crédito */}
          <div className="flex flex-col gap-3">
            <Logo variante="claro" />
            <p className="text-sm text-superficie/80">
              El agarre que te lleva a casa.
            </p>
            <p className="text-xs text-superficie/70">
              Sitio por{" "}
              <a
                href="https://mi-portafolio-eta-hazel.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline transition-colors hover:text-superficie"
              >
                Kervin Martínez
              </a>
            </p>
          </div>

          {/* Tienda + Ayuda */}
          <Columna titulo="Tienda" enlaces={TIENDA} />
          <Columna titulo="Ayuda" enlaces={AYUDA} />

          {/* Contacto */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-superficie/70">
              Contacto
            </h2>
            <BotonWhatsApp className="w-fit px-5 py-2.5 text-sm" />
            <a
              href={`tel:${WHATSAPP_TEL}`}
              className="text-sm text-superficie/80 transition-colors hover:text-superficie"
            >
              {WHATSAPP_DISPLAY}
            </a>
            <p className="text-sm text-superficie/80">Medellín, Colombia</p>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-10 border-t border-superficie/15 pt-6 text-center text-xs text-superficie/70">
          © 2026 RODA. Rueda seguro.
        </div>
      </div>
    </footer>
  );
}
