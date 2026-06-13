import { exigirAdmin } from "@/lib/auth";

// Layout del grupo (panel): TODAS las páginas dentro de (panel) pasan por aquí
// antes de renderizar. Un solo chequeo protege el panel y cualquier página
// nueva que agreguemos al grupo (DRY). El login vive FUERA del grupo, así que
// no queda protegido (si no, sería un bucle de redirecciones).
export default async function PanelLayout({ children }) {
  await exigirAdmin();
  return children;
}
