import Image from "next/image";
import LlantaSVG from "@/components/LlantaSVG";
import { imagenOptimizada } from "@/lib/img";

// Imagen de un producto (DRY §5.2). Si hay foto (Cloudinary) usa next/image
// optimizada; si no, cae al SVG de llanta para que NADA se vea roto (§5.8).
//
// El contenedor padre debe ser `relative` y tener altura (aspect-*), porque
// con `fill` la imagen se posiciona absoluta dentro de él.
//
// Props:
//   imagen      URL de la foto (o vacío → SVG).
//   alt         "marca modelo medida".
//   sizes       pista de tamaño para que next/image sirva el ancho justo.
//   ancho       ancho objetivo para la transformación de Cloudinary.
//   priority    true en la imagen principal de la ficha (es el LCP).
//   decorativa  true en las tarjetas (el enlace ya es aria-hidden) → alt vacío.
export default function ImagenProducto({
  imagen,
  alt,
  sizes,
  ancho = 600,
  priority = false,
  decorativa = false,
  svgClassName = "h-28 w-28",
  imgClassName = "object-contain p-4",
}) {
  if (imagen) {
    return (
      <Image
        src={imagenOptimizada(imagen, ancho)}
        alt={decorativa ? "" : alt}
        fill
        sizes={sizes}
        priority={priority} // sin priority, next/image ya hace lazy-load solo
        className={imgClassName}
      />
    );
  }

  // Fallback SVG: informativo (con label) en la ficha; decorativo en tarjetas.
  return <LlantaSVG className={svgClassName} label={decorativa ? undefined : alt} />;
}
