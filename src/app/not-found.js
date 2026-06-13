import Link from "next/link";
import LlantaSVG from "@/components/LlantaSVG";

export const metadata = {
  title: "Página no encontrada — RODA",
  robots: { index: false, follow: false },
};

// Página 404 con estilo RODA (Next la usa para cualquier ruta inexistente).
export default function NotFound() {
  return (
    <div className="bg-fondo">
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <LlantaSVG className="mx-auto h-20 w-20 opacity-60" />
        <p className="mt-6 font-display text-5xl font-bold text-acento">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
          Esta página se desinfló
        </h1>
        <p className="mt-2 text-sm text-texto-suave">
          No encontramos lo que buscabas. Volvamos al catálogo.
        </p>
        <Link
          href="/catalogo"
          className="mt-6 inline-flex rounded-full bg-acento px-8 py-3.5 font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
