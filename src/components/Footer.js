import Logo from "./Logo";
import BotonWhatsApp from "./BotonWhatsApp";

export default function Footer() {
  return (
    <footer className="bg-navy text-superficie">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-center">
        <Logo variante="claro" />

        <BotonWhatsApp className="px-5 py-2.5 text-sm" />

        <p className="text-sm text-superficie/80">
          Rueda seguro <span aria-hidden="true">·</span> Medellín 2026
        </p>
      </div>
    </footer>
  );
}
