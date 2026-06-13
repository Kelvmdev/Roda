import productos from "@/data/productos.json";

// Quita duplicados de un array.
const unicos = (arr) => [...new Set(arr)];

// Opciones derivadas de los datos (§5.6), ordenadas. Una sola fuente de verdad.
export const MARCAS = unicos(productos.map((p) => p.marca)).sort((a, b) =>
  a.localeCompare(b)
);
export const ANCHOS = unicos(productos.map((p) => p.ancho)).sort(
  (a, b) => Number(a) - Number(b)
);
export const PERFILES = unicos(productos.map((p) => p.perfil)).sort(
  (a, b) => Number(a) - Number(b)
);
export const RINES = unicos(productos.map((p) => p.rin)).sort(
  (a, b) => Number(a.slice(1)) - Number(b.slice(1))
);

// Filtra el catálogo. Un campo vacío (o "todos") no filtra.
export function filtrar({ tipo, marca, ancho, perfil, rin } = {}) {
  return productos.filter((p) => {
    if (tipo && tipo !== "todos" && p.tipo !== tipo) return false;
    if (marca && p.marca !== marca) return false;
    if (ancho && p.ancho !== ancho) return false;
    if (perfil && p.perfil !== perfil) return false;
    if (rin && p.rin !== rin) return false;
    return true;
  });
}

// Busca un producto por su slug (undefined si no existe).
export const porSlug = (slug) => productos.find((p) => p.slug === slug);

// Productos del mismo tipo, excluyendo el actual (máx. `max`).
export const similares = (producto, max = 4) =>
  productos
    .filter((p) => p.tipo === producto.tipo && p.slug !== producto.slug)
    .slice(0, max);

// Formatos compartidos (DRY §5.2): precio en pesos y medida "205/55 R16".
export const formatoPrecio = (precio) => `$${precio.toLocaleString("es-CO")}`;
export const medidaDe = ({ ancho, perfil, rin }) => `${ancho}/${perfil} ${rin}`;
