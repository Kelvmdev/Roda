import { leerContenido } from "@/lib/contenido-store";
import FormularioContenido from "@/components/FormularioContenido";
import { guardarContenidoAccion } from "./acciones";

export const metadata = {
  title: "Contenido — Panel RODA",
  robots: { index: false, follow: false },
};

// Siempre leemos el archivo actual (no una versión cacheada).
export const dynamic = "force-dynamic";

export default async function ContenidoPage() {
  const contenido = await leerContenido();

  return (
    <div className="bg-fondo">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          Contenido del sitio
        </h1>
        <p className="mt-1 text-sm text-texto-suave">
          Edita los textos de la portada y la barra. Los cambios se ven en la home.
        </p>

        <div className="mt-6">
          <FormularioContenido
            contenido={contenido}
            accion={guardarContenidoAccion}
          />
        </div>
      </div>
    </div>
  );
}
