// noindex para TODO /admin (panel, login y subpáginas). Se hereda a las hijas.
export const metadata = {
  title: "Panel RODA",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return children;
}
