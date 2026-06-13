import PaginaLegal from "@/components/PaginaLegal";
import { construirMeta } from "@/lib/seo";

export const metadata = construirMeta({
  title: "Términos y condiciones — RODA",
  description:
    "Términos y condiciones de compra en RODA: precios, pagos contraentrega o por transferencia, y uso del sitio.",
  path: "/terminos",
});

const SECCIONES = [
  {
    titulo: "Aceptación",
    parrafos: [
      "Al realizar un pedido en RODA aceptas estos términos y condiciones.",
    ],
  },
  {
    titulo: "Pedidos y precios",
    parrafos: [
      "Los precios están en pesos colombianos (COP) e incluyen la instalación. Pueden cambiar sin previo aviso.",
      "Confirmamos la disponibilidad de cada producto por WhatsApp antes de coordinar la entrega.",
    ],
  },
  {
    titulo: "Pagos",
    parrafos: [
      "Aceptamos pago contraentrega o por transferencia / Nequi. No procesamos pagos en línea ni solicitamos datos de tarjeta en el sitio.",
    ],
  },
  {
    titulo: "Productos",
    parrafos: [
      "Las imágenes son de referencia. Lo que define el producto es su medida y especificación: marca, modelo, ancho, perfil y rin.",
    ],
  },
  {
    titulo: "Responsabilidad",
    parrafos: [
      "RODA no se hace responsable por daños derivados de un uso indebido de las llantas o de instalaciones realizadas por terceros.",
    ],
  },
  {
    titulo: "Contacto",
    parrafos: [
      "Para cualquier duda sobre estos términos, escríbenos por WhatsApp.",
    ],
  },
];

export default function TerminosPage() {
  return (
    <PaginaLegal
      titulo="Términos y condiciones"
      intro="Las reglas básicas al comprar en RODA."
      secciones={SECCIONES}
    />
  );
}
