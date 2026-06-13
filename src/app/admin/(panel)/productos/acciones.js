"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { leerProductos, guardarProductos } from "@/lib/productos-store";
import { slugDe } from "@/lib/catalogo";
import { exigirAdmin } from "@/lib/auth";

// Lee los campos del formulario y los normaliza (sin tocar disco todavía).
function leerCampos(formData) {
  const txt = (clave) => (formData.get(clave)?.toString() ?? "").trim();

  // El rin se guarda como "R16": forzamos mayúscula y la R inicial.
  let rin = txt("rin").toUpperCase();
  if (rin && !rin.startsWith("R")) rin = `R${rin}`;

  return {
    marca: txt("marca"),
    modelo: txt("modelo"),
    tipo: txt("tipo"),
    ancho: txt("ancho"),
    perfil: txt("perfil"),
    rin,
    // Quitamos puntos/comas/símbolos: "389.900" → "389900".
    precio: txt("precio").replace(/[^\d]/g, ""),
    etiqueta: txt("etiqueta"), // "" = ninguna
    destacado: formData.get("destacado") != null,
    descripcion: txt("descripcion"),
    imagen: txt("imagen"), // URL de Cloudinary (o "" si no hay foto)
  };
}

// Valida lo obligatorio. Devuelve { campo: "mensaje" } (vacío = todo bien).
function validar(d) {
  const e = {};
  if (!d.marca) e.marca = "La marca es obligatoria.";
  if (!d.modelo) e.modelo = "El modelo es obligatorio.";
  if (d.tipo !== "carro" && d.tipo !== "moto") e.tipo = "Elige carro o moto.";
  if (!/^\d{2,3}$/.test(d.ancho)) e.ancho = "Solo números (ej. 205).";
  if (!/^\d{2,3}$/.test(d.perfil)) e.perfil = "Solo números (ej. 55).";
  if (!/^R\d{2}$/.test(d.rin)) e.rin = "Formato R + 2 dígitos (ej. R16).";
  if (!d.precio || Number(d.precio) <= 0) e.precio = "Precio mayor a 0.";
  return e;
}

// Construye el objeto producto final que se guardará en el JSON.
function construir(d, slug, id) {
  return {
    id,
    slug,
    marca: d.marca,
    modelo: d.modelo,
    tipo: d.tipo,
    ancho: d.ancho,
    perfil: d.perfil,
    rin: d.rin,
    precio: Number(d.precio),
    etiqueta: d.etiqueta || null,
    destacado: d.destacado,
    descripcion: d.descripcion,
    imagen: d.imagen || null,
  };
}

// Limpia la caché de las rutas que muestran productos para que el cambio se vea.
function revalidar() {
  revalidatePath("/"); // home (destacados)
  revalidatePath("/catalogo"); // listado y filtros
  revalidatePath("/admin"); // la propia lista del panel
  revalidatePath("/producto/[slug]", "page"); // todas las fichas de producto
}

export async function crearProducto(estadoPrevio, formData) {
  await exigirAdmin();

  const datos = leerCampos(formData);
  const errores = validar(datos);
  if (Object.keys(errores).length > 0) {
    return { error: "Revisa los campos marcados.", errores };
  }

  let productos;
  try {
    productos = await leerProductos();
  } catch {
    return { error: "No se pudo leer el catálogo. Intenta de nuevo." };
  }

  const slug = slugDe(datos);
  if (productos.some((p) => p.slug === slug)) {
    return {
      error: `Ya existe una llanta con ese identificador (slug: ${slug}). Cambia marca, modelo o medida.`,
      errores: {},
    };
  }

  const nuevoId = productos.reduce((max, p) => Math.max(max, p.id ?? 0), 0) + 1;
  const nuevo = construir(datos, slug, nuevoId);

  try {
    // Validamos TODO antes de escribir (§6.4): el archivo solo se toca con
    // datos correctos, nunca queda a medias.
    await guardarProductos([...productos, nuevo], `CMS: agrega llanta ${slug}`);
  } catch {
    return {
      error: "No se pudo guardar (revisa el token/permiso de GitHub). El catálogo no se modificó.",
    };
  }

  revalidar();
  redirect("/admin");
}

export async function actualizarProducto(estadoPrevio, formData) {
  await exigirAdmin();

  const slugOriginal = formData.get("slugOriginal")?.toString();
  const datos = leerCampos(formData);
  const errores = validar(datos);
  if (Object.keys(errores).length > 0) {
    return { error: "Revisa los campos marcados.", errores };
  }

  let productos;
  try {
    productos = await leerProductos();
  } catch {
    return { error: "No se pudo leer el catálogo. Intenta de nuevo." };
  }

  const indice = productos.findIndex((p) => p.slug === slugOriginal);
  if (indice === -1) {
    return { error: "No encontramos la llanta que intentas editar." };
  }

  const slug = slugDe(datos);
  // Si cambió la medida/marca/modelo, el slug cambia: no debe chocar con otra.
  if (slug !== slugOriginal && productos.some((p) => p.slug === slug)) {
    return {
      error: `Ya existe otra llanta con ese identificador (slug: ${slug}).`,
      errores: {},
    };
  }

  // Partimos del original y sobreescribimos (preserva id y cualquier campo
  // futuro que el formulario no maneje — §6.4 "blindar el guardado").
  const copia = [...productos];
  copia[indice] = { ...productos[indice], ...construir(datos, slug, productos[indice].id) };

  try {
    await guardarProductos(copia, `CMS: edita llanta ${slug}`);
  } catch {
    return {
      error: "No se pudo guardar (revisa el token/permiso de GitHub). El catálogo no se modificó.",
    };
  }

  revalidar();
  redirect("/admin");
}

// Borrar: firma (formData) porque se usa directo como action de un <form>,
// sin useActionState. Como no hay UI de error propia, en caso de fallo
// redirigimos con ?error=... y el panel muestra un aviso.
export async function borrarProducto(formData) {
  await exigirAdmin();

  const slug = formData.get("slug")?.toString();
  let productos;
  try {
    productos = await leerProductos();
  } catch {
    redirect("/admin?error=No+se+pudo+leer+el+cat%C3%A1logo.");
  }

  const filtrados = productos.filter((p) => p.slug !== slug);
  try {
    await guardarProductos(filtrados, `CMS: borra llanta ${slug}`);
  } catch {
    // Si falla, el archivo queda intacto (§6.4): no se borró nada.
    redirect("/admin?error=No+se+pudo+borrar.+El+cat%C3%A1logo+no+se+modific%C3%B3.");
  }

  revalidar();
  redirect("/admin");
}
