"use server";

// Server Actions de autenticación. La directiva "use server" garantiza que
// este código SOLO corre en el servidor: la contraseña que escribe el usuario
// se compara aquí y nunca se expone al navegador.

import { redirect } from "next/navigation";
import { establecerSesion, eliminarSesion } from "@/lib/auth";

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
  if (clave !== process.env.ADMIN_PASSWORD) {
    return { error: "Contraseña incorrecta." };
  }

  // Correcta: creamos la cookie de sesión y entramos al panel.
  await establecerSesion();
  redirect("/admin");
}

// Cierra la sesión: borra la cookie y vuelve al login.
export async function cerrarSesion() {
  await eliminarSesion();
  redirect("/admin/login");
}
