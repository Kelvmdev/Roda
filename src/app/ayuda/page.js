import BotonWhatsApp from "@/components/BotonWhatsApp";

export const metadata = {
  title: "Ayuda — RODA",
  description:
    "Preguntas frecuentes sobre medidas, instalación, garantía y formas de pago en RODA. ¿Dudas? Escríbenos por WhatsApp.",
};

// FAQ corto: una sola fuente de datos → se mapea abajo (DRY §5.2).
const FAQ = [
  {
    pregunta: "¿Cómo sé qué medida necesito?",
    respuesta:
      "La medida está escrita en el costado de tu llanta actual, con el formato 205/55 R16 (ancho / perfil rin). Cópiala tal cual en el buscador del catálogo. Si tienes dudas, escríbenos y te ayudamos a encontrarla.",
  },
  {
    pregunta: "¿La instalación está incluida?",
    respuesta:
      "Sí. El precio incluye montaje y balanceo en Medellín. Coordinamos el día y el lugar contigo por WhatsApp.",
  },
  {
    pregunta: "¿Qué garantía tienen las llantas?",
    respuesta:
      "Todas nuestras llantas cuentan con la garantía del fabricante (hasta 5 años según la línea) contra defectos de fabricación.",
  },
  {
    pregunta: "¿Cómo puedo pagar?",
    respuesta:
      "Puedes pagar contraentrega o por transferencia / Nequi. No cobramos en línea: coordinamos el pago cuando confirmas tu pedido por WhatsApp.",
  },
];

export default function AyudaPage() {
  return (
    <div className="bg-fondo">
      <div className="mx-auto max-w-2xl px-4 py-12 lg:py-16">
        <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          ¿En qué te ayudamos?
        </h1>
        <p className="mt-2 text-sm text-texto-suave">
          Preguntas frecuentes. Si no resolvemos tu duda, escríbenos.
        </p>

        {/* Lista de preguntas. Cada pregunta es un h2 (orden de headings §5.11). */}
        <dl className="mt-8 flex flex-col gap-4">
          {FAQ.map((item) => (
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
            ¿Sigues con dudas?
          </p>
          <p className="mt-1 text-sm text-texto-suave">
            Te respondemos por WhatsApp.
          </p>
          <BotonWhatsApp className="mt-4 px-8 py-3.5" />
        </div>
      </div>
    </div>
  );
}
