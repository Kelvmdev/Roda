"use client";

import { useEffect, useState } from "react";
import { CLAVE_WHATSAPP } from "@/lib/config";
import BotonWhatsApp from "@/components/BotonWhatsApp";

// Botón de respaldo en /gracias: reabre el enlace de WhatsApp que el checkout
// guardó en sessionStorage. Reutiliza BotonWhatsApp (mismo ícono y estilos, DRY
// §5.2), solo cambia el destino (href) y la etiqueta. Si no hay enlace (entraste
// a /gracias directo), no se muestra nada.
export default function BotonWhatsAppPedido() {
  const [url, setUrl] = useState(null);

  // sessionStorage solo existe en el navegador → lo leemos tras montar.
  // Sincronizar con un sistema externo al montar es un uso legítimo de setState
  // en un efecto, por eso silenciamos la regla aquí (igual que CarritoContext).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      setUrl(sessionStorage.getItem(CLAVE_WHATSAPP));
    } catch {
      // sin sessionStorage no hay respaldo; no pasa nada.
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!url) return null;

  return (
    <BotonWhatsApp
      href={url}
      etiqueta="Enviar pedido por WhatsApp"
      className="px-8 py-3.5"
    />
  );
}
