"use server";

// Server Actions de autenticación. La directiva "use server" garantiza que
// este código SOLO corre en el servidor: la contraseña que escribe el usuario
// se compara aquí y nunca se expone al navegador.

import { redirect } from "next/navigation";
import { establecerSesion, eliminarSesion, verificarClave } from "@/lib/auth";

// Recibe el formulario de login. Firma compatible con useActionState:
// (estadoPrevio, formData). Devuelve { error } si algo falla.
export async function iniciarSesion(estadoPrevio, formData) {
  const clave = formData.get("password");

  if (!process.env.ADMIN_PASSWORD) {
    return { error: "Falta configurar ADMIN_PASSWORD en el servidor." };
  }
  if (typeof clave !== "string" || clave.length === 0) {
    return { error: "Escribe la contraseña." };
  }
  // Comparación en tiempo constante (no `!==`).
  if (!verificarClave(clave)) {
    return { error: "Contraseña incorrecta." };
  }

  // Correcta: creamos la cookie de sesión firmada. Si falta SESSION_SECRET,
  // establecerSesion lanza (y lo deja claro en el log) → mensaje al usuario.
  try {
    await establecerSesion();
  } catch {
    return { error: "No se pudo crear la sesión. Revisa SESSION_SECRET en el servidor." };
  }
  redirect("/admin");
}

// Cierra la sesión: borra la cookie y vuelve al login.
export async function cerrarSesion() {
  await eliminarSesion();
  redirect("/admin/login");
}
