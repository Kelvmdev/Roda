// Optimización de imágenes de Cloudinary (§5.8). Insertamos transformaciones
// justo después de "/upload/":
//   f_auto  → el formato más moderno que soporte el navegador (WebP/AVIF).
//   q_auto  → compresión automática sin perder calidad visible.
//   w_<n>   → reduce el ancho al que realmente se muestra.
// Esto baja el peso ~10-20× y es la palanca #1 del LCP. Si la URL no es de
// Cloudinary (o está vacía), la devolvemos tal cual.
export function imagenOptimizada(url, ancho = 600) {
  if (!url) return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${ancho}/`);
  }
  return url;
}
