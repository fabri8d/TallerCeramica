"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Galería" },
  { href: "/taller", label: "El Taller" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-parchment/95 backdrop-blur-sm border-b border-linen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center h-16">
          <Link href="/" className="absolute left-0 flex items-center gap-2">
            <span className="font-serif text-xl font-semibold text-bark-900">
              Susana Biondi
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm transition-colors ${
                  pathname === link.href
                    ? "text-terracotta-500 font-bold"
                    : "text-bark-900 hover:text-terracotta-500"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
