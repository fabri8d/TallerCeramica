import Link from "next/link";

const navLinks = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#galeria", label: "Galería" },
  { href: "#precios", label: "Precios" },
  { href: "#reservas", label: "Reservar" },
  { href: "#contacto", label: "Contacto" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-parchment/95 backdrop-blur-sm border-b border-linen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-semibold text-bark-900">
              Taller de Cerámica
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans text-sm text-bark-900 hover:text-terracotta-500 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#reservas"
              className="bg-terracotta-500 hover:bg-terracotta-600 text-white font-sans text-sm font-bold px-4 py-2 rounded-sm transition-colors"
            >
              Reservar turno
            </a>
          </nav>

          {/* Mobile CTA */}
          <a
            href="#reservas"
            className="md:hidden bg-terracotta-500 text-white text-sm font-bold px-4 py-2 rounded-sm"
          >
            Reservar
          </a>
        </div>
      </div>
    </header>
  );
}
