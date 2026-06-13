"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { medidaDe } from "@/lib/catalogo";

const CarritoContext = createContext(null);
const CLAVE = "roda_carrito";

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cargado, setCargado] = useState(false);

  // 1) Leer de localStorage SOLO en el cliente, tras montar (evita la
  //    desincronización de hidratación: el servidor no tiene localStorage).
  //    Sincronizar con un sistema externo al montar es un uso legítimo de
  //    setState dentro de un efecto, por eso silenciamos la regla aquí.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado) setItems(JSON.parse(guardado));
    } catch {
      // si el dato está corrupto, empezamos vacío
    }
    setCargado(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // 2) Guardar cada vez que cambie (solo después de la carga inicial,
  //    para no pisar lo guardado con el array vacío del primer render).
  useEffect(() => {
    if (!cargado) return;
    localStorage.setItem(CLAVE, JSON.stringify(items));
  }, [items, cargado]);

  // Agrega un producto; si ya está, suma 1 a la cantidad.
  function agregar(producto) {
    setItems((prev) => {
      const existe = prev.find((it) => it.slug === producto.slug);
      if (existe) {
        return prev.map((it) =>
          it.slug === producto.slug ? { ...it, cantidad: it.cantidad + 1 } : it
        );
      }
      return [
        ...prev,
        {
          slug: producto.slug,
          marca: producto.marca,
          modelo: producto.modelo,
          medida: medidaDe(producto),
          precio: producto.precio,
          cantidad: 1,
        },
      ];
    });
  }

  function quitar(slug) {
    setItems((prev) => prev.filter((it) => it.slug !== slug));
  }

  // Fija la cantidad de un ítem; si baja a 0 o menos, lo quita.
  function cambiarCantidad(slug, n) {
    setItems((prev) =>
      n <= 0
        ? prev.filter((it) => it.slug !== slug)
        : prev.map((it) => (it.slug === slug ? { ...it, cantidad: n } : it))
    );
  }

  function vaciar() {
    setItems([]);
  }

  const totalItems = items.reduce((acc, it) => acc + it.cantidad, 0);
  const subtotal = items.reduce((acc, it) => acc + it.precio * it.cantidad, 0);

  const valor = {
    items,
    agregar,
    quitar,
    cambiarCantidad,
    vaciar,
    totalItems,
    subtotal,
  };

  return (
    <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
  );
}

// Hook para consumir el carrito desde cualquier componente cliente.
export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) {
    throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  }
  return ctx;
}
