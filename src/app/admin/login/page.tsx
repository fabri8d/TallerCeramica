"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Credenciales incorrectas");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bark-900 flex items-center justify-center px-4">
      <div className="bg-parchment rounded-sm p-8 w-full max-w-sm shadow-lg">
        <h1 className="font-serif text-2xl text-bark-900 mb-6 text-center">Panel Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-sm font-bold text-bark-900 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-linen rounded-sm px-3 py-2 font-sans text-sm focus:outline-none focus:border-terracotta-400"
            />
          </div>
          <div>
            <label className="block font-sans text-sm font-bold text-bark-900 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-linen rounded-sm px-3 py-2 font-sans text-sm focus:outline-none focus:border-terracotta-400"
            />
          </div>
          {error && <p className="font-sans text-sm text-terracotta-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white font-sans font-bold py-3 rounded-sm transition-colors"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
