import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-navy text-superficie">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-center">
        <Logo variante="claro" />
        <p className="text-sm text-superficie/80">
          Rueda seguro <span aria-hidden="true">·</span> Medellín 2026
        </p>
      </div>
    </footer>
  );
}
