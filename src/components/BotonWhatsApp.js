import { enlaceWhatsapp } from "@/lib/config";

// Botón verde de WhatsApp reutilizable (DRY §5.2). Lo usan el footer y /ayuda
// (y cualquier página que necesite el mismo CTA). El `className` ajusta tamaño.
// Usa los tokens --color-whatsapp / --color-whatsapp-deep (texto blanco, AA §6.3).
export default function BotonWhatsApp({
  mensaje = "Hola RODA, tengo una duda",
  href, // si se pasa, se usa tal cual (p. ej. el enlace guardado en /gracias)
  etiqueta = "Escríbenos por WhatsApp",
  className = "",
}) {
  const destino = href ?? enlaceWhatsapp(mensaje);
  return (
    <a
      href={destino}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${etiqueta} (se abre en una pestaña nueva)`}
      className={`inline-flex items-center gap-2 rounded-full bg-whatsapp font-semibold text-superficie transition duration-150 hover:bg-whatsapp-deep active:scale-95 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm5.8 14.16c-.25.69-1.44 1.32-1.99 1.36-.51.05-1.16.07-1.87-.12-.43-.14-.99-.32-1.7-.63-2.99-1.29-4.94-4.3-5.09-4.5-.15-.2-1.22-1.62-1.22-3.09s.77-2.19 1.05-2.49c.27-.3.6-.37.8-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.84 2.07.91 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.18-.31.4-.45.53-.15.15-.3.31-.13.61.17.3.76 1.26 1.64 2.04 1.13 1.01 2.08 1.32 2.38 1.47.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.71.81 2.01.96.3.15.5.22.57.35.07.12.07.72-.18 1.41z" />
      </svg>
      {etiqueta}
    </a>
  );
}
