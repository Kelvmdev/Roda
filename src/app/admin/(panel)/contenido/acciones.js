"use server";

import { revalidatePath } from "next/cache";
import { leerContenido, guardarContenido } from "@/lib/contenido-store";
import { exigirAdmin } from "@/lib/auth";

// Fusiona cada documento legal (título/intro/secciones[]) preservando lo que el
// formulario no envíe. Las secciones se reemplazan completas si vienen.
function fusionarLegales(orig, edit) {
  const docs = ["enviosYGarantia", "terminos", "privacidad"];
  const salida = { ...orig };
  for (const doc of docs) {
    salida[doc] = {
      ...orig[doc],
      ...edit?.[doc],
      secciones: Array.isArray(edit?.[doc]?.secciones)
        ? edit[doc].secciones
        : orig[doc].secciones,
    };
  }
  return salida;
}

// Recibe el contenido editado (como JSON en un campo oculto) y lo guarda.
// Firma compatible con useActionState: (estadoPrevio, formData).
export async function guardarContenidoAccion(estadoPrevio, formData) {
  await exigirAdmin();

  let editado;
  try {
    editado = JSON.parse(formData.get("contenido")?.toString() ?? "");
  } catch {
    return { ok: false, error: "Datos inválidos. Recarga e intenta de nuevo." };
  }

  // Blindaje §6.4: partimos del contenido ORIGINAL y sobreescribimos solo las
  // secciones conocidas. Así nunca borramos campos que el formulario no maneja.
  let original;
  try {
    original = await leerContenido();
  } catch {
    return { ok: false, error: "No se pudo leer el contenido. Intenta de nuevo." };
  }

  const fusionado = {
    ...original,
    topbar: { ...original.topbar, ...editado.topbar },
    nav: { ...original.nav, ...editado.nav },
    hero: { ...original.hero, ...editado.hero },
    buscador: { ...original.buscador, ...editado.buscador },
    confianza: Array.isArray(editado.confianza)
      ? editado.confianza
      : original.confianza,
    masVendidas: { ...original.masVendidas, ...editado.masVendidas },
    faq: {
      ...original.faq,
      ...editado.faq,
      preguntas: Array.isArray(editado.faq?.preguntas)
        ? editado.faq.preguntas
        : original.faq.preguntas,
    },
    footer: { ...original.footer, ...editado.footer },
    contacto: { ...original.contacto, ...editado.contacto },
    fichaBadges: Array.isArray(editado.fichaBadges)
      ? editado.fichaBadges
      : original.fichaBadges,
    legales: fusionarLegales(original.legales, editado.legales),
    seo: { ...original.seo, ...editado.seo },
    testimonios: {
      ...original.testimonios,
      ...editado.testimonios,
      lista: Array.isArray(editado.testimonios?.lista)
        ? editado.testimonios.lista
        : original.testimonios.lista,
    },
    ubicacion: { ...original.ubicacion, ...editado.ubicacion },
  };

  try {
    await guardarContenido(fusionado, "CMS: edita contenido del sitio");
  } catch {
    return { ok: false, error: "No se pudo guardar. El contenido no se modificó." };
  }

  // El header (chrome) y la home leen este contenido → revalidamos todo.
  revalidatePath("/", "layout");
  return { ok: true, error: null };
}
