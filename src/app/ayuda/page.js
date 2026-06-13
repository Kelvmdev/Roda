import BotonWhatsApp from "@/components/BotonWhatsApp";
import contenido from "@/data/contenido.json";
import { construirMeta } from "@/lib/seo";

export const metadata = construirMeta({
  clave: "ayuda",
  title: "Ayuda — RODA",
  description:
    "Preguntas frecuentes sobre medidas, instalación, garantía y formas de pago en RODA. ¿Dudas? Escríbenos por WhatsApp.",
  path: "/ayuda",
});

export default function AyudaPage() {
  const faq = contenido.faq;
  return (
    <div className="bg-fondo">
      <div className="mx-auto max-w-2xl px-4 py-12 lg:py-16">
        <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          {faq.titulo}
        </h1>
        <p className="mt-2 text-sm text-texto-suave">{faq.intro}</p>

        {/* Lista de preguntas. Cada pregunta es un h2 (orden de headings §5.11). */}
        <dl className="mt-8 flex flex-col gap-4">
          {faq.preguntas.map((item) => (
            <div
              key={item.pregunta}
              className="rounded-2xl border border-linea bg-superficie p-5"
            >
              <dt>
                <h2 className="font-display text-lg font-bold text-navy">
                  {item.pregunta}
                </h2>
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-texto-suave">
                {item.respuesta}
              </dd>
            </div>
          ))}
        </dl>

        {/* CTA verde de WhatsApp (mismo token que /gracias). */}
        <div className="mt-10 rounded-2xl border border-linea bg-superficie p-6 text-center">
          <p className="font-display text-xl font-bold text-navy">
            {faq.ctaTitulo}
          </p>
          <p className="mt-1 text-sm text-texto-suave">{faq.ctaTexto}</p>
          <BotonWhatsApp className="mt-4 px-8 py-3.5" />
        </div>
      </div>
    </div>
  );
}
