"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/publicaciones", label: "Publicaciones", exact: false },
  { href: "/admin/reservas", label: "Reservas", exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-56 bg-bark-900 text-clay-200 flex flex-col min-h-screen">
      <div className="p-6 border-b border-bark-700">
        <p className="font-serif text-lg text-white">Admin</p>
        <p className="font-sans text-xs text-clay-400">Susana Biondi</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href) && link.href !== "/admin" || pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block font-sans text-sm px-3 py-2 rounded-sm transition-colors ${
                active ? "bg-terracotta-500 text-white" : "text-clay-300 hover:bg-bark-800"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-bark-700">
        <button
          onClick={handleLogout}
          className="w-full font-sans text-sm text-clay-400 hover:text-white transition-colors text-left px-3 py-2"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
