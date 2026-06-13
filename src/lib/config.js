// Configuración compartida del negocio. Un solo lugar para datos que se reusan
// en varias páginas (checkout, /gracias y, a futuro, header/footer/ayuda).

// WhatsApp en formato wa.me (sin +, espacios ni guiones).
// El prefijo NEXT_PUBLIC_ hace que la variable esté disponible también en el
// navegador (los componentes cliente la necesitan). Si no se define, usamos el
// número real como valor por defecto.
export const WHATSAPP_NUMERO =
  process.env.NEXT_PUBLIC_WHATSAPP || "573117365928";

// Mismo número, derivado para otros usos (DRY): href de `tel:` y versión legible.
export const WHATSAPP_TEL = `+${WHATSAPP_NUMERO}`;
export const WHATSAPP_DISPLAY = `+${WHATSAPP_NUMERO.slice(0, 2)} ${WHATSAPP_NUMERO.slice(
  2,
  5
)} ${WHATSAPP_NUMERO.slice(5, 8)} ${WHATSAPP_NUMERO.slice(8)}`;

// Clave de sessionStorage donde el checkout deja el enlace de respaldo para
// que /gracias pueda reabrirlo. Compartida para no repetir el string.
export const CLAVE_WHATSAPP = "roda_whatsapp";

// Cloudinary: cloud name + preset de subida SIN firmar. Son PÚBLICOS (no
// secretos): el preset "unsigned" permite subir desde el navegador sin exponer
// ninguna API key. Configurables por env; default a los valores actuales.
export const CLOUDINARY_CLOUD =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dw26ujhoo";
export const CLOUDINARY_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "portafolio_unsigned";

// Arma un enlace wa.me. Si pasas texto, lo codifica para la URL.
export const enlaceWhatsapp = (texto) =>
  `https://wa.me/${WHATSAPP_NUMERO}${
    texto ? `?text=${encodeURIComponent(texto)}` : ""
  }`;
