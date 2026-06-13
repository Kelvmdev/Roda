import Link from "next/link";
import FormularioProducto from "@/components/FormularioProducto";
import { crearProducto } from "../acciones";

export const metadata = {
  title: "Agregar llanta — Panel RODA",
  robots: { index: false, follow: false },
};

export default function NuevaLlantaPage() {
  return (
    <div className="bg-fondo">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/admin"
          className="text-sm font-semibold text-acento-fuerte transition-colors hover:text-navy"
        >
          <span aria-hidden="true">←</span> Volver al panel
        </Link>

        <h1 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl">
          Agregar llanta
        </h1>
        <p className="mt-1 text-sm text-texto-suave">
          El identificador (slug) se genera solo con marca + modelo + medida.
        </p>

        <div className="mt-6">
          <FormularioProducto accion={crearProducto} textoBoton="Agregar llanta" />
        </div>
      </div>
    </div>
  );
}
