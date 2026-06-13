import Link from "next/link";
import { redirect } from "next/navigation";
import BotonWhatsAppPedido from "@/components/BotonWhatsAppPedido";

// /gracias no debe indexarse en buscadores (§6.4): es una página de confirmación.
export const metadata = {
  title: "Pedido recibido — RODA",
  robots: { index: false, follow: false },
};

// Server Component async: en Next 16 `searchParams` es un Promise, se espera.
export default async function GraciasPage({ searchParams }) {
  const params = await searchParams;
  const numero = typeof params?.pedido === "string" ? params.pedido : null;

  // Visita directa sin número de pedido (no vino del checkout) → no tiene
  // sentido decir "¡Pedido recibido!". La mandamos al catálogo.
  if (!numero) {
    redirect("/catalogo");
  }

  return (
    <div className="bg-fondo">
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        {/* Check decorativo: aria-hidden para que el lector no lo deletree (§5.11) */}
        <div
          aria-hidden="true"
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-acento-suave text-acento"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mt-6 font-display text-3xl font-bold text-navy sm:text-4xl">
          ¡Pedido recibido!
        </h1>

        {numero && (
          <p className="mt-3 text-sm text-texto-suave">
            Tu número de pedido es{" "}
            <span className="font-semibold tracking-wide text-navy">
              {numero}
            </span>
          </p>
        )}

        <p className="mx-auto mt-4 max-w-md text-base text-texto-suave">
          Gracias por confiar en RODA. <strong className="text-navy">Te
          contactamos por WhatsApp</strong> para coordinar la instalación y el
          pago. No se realizó ningún cobro en línea.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          {/* Respaldo: reabre WhatsApp si la pestaña automática se bloqueó. */}
          <BotonWhatsAppPedido />
          <Link
            href="/catalogo"
            className="inline-flex rounded-full border border-linea px-8 py-3.5 font-semibold text-navy transition duration-150 hover:bg-acento-suave active:scale-95"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
