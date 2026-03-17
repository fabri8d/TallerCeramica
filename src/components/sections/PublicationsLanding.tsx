"use client";

import { useState, useEffect, useCallback } from "react";
import PublicationCard from "@/components/publications/PublicationCard";
import type { Publication } from "@/types";

export default function PublicationsLanding() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<"" | "disponible" | "agotado">("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (estadoFilter) params.set("estado", estadoFilter);
    const res = await fetch(`/api/publications?${params}`);
    const data = await res.json();
    setPublications(data.publications ?? []);
    setLoading(false);
  }, [debouncedSearch, estadoFilter]);

  useEffect(() => { fetchPublications(); }, [fetchPublications]);

  return (
    <div className="bg-parchment min-h-screen pt-16">
      {/* Intro hero */}
      <section className="bg-bark-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block font-sans text-terracotta-400 text-sm tracking-widest uppercase mb-4">
            Galería
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
            Obras del taller
          </h1>
          <p className="font-sans text-clay-300 text-lg leading-relaxed">
            Todo lo que ves acá fue creado a mano en nuestro taller por nuestros alumnos.
            Cada pieza es única — si algo te interesa, consultanos directo por WhatsApp.
          </p>
          <a
            href="/taller"
            className="inline-block mt-6 font-sans text-sm text-terracotta-400 hover:text-terracotta-300 underline transition-colors"
          >
            Conocé más sobre el taller →
          </a>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-40 bg-parchment/95 backdrop-blur-sm border-b border-linen py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            placeholder="Buscar por título, autor o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-linen rounded-sm px-4 py-2 font-sans text-sm text-bark-900 bg-white focus:outline-none focus:border-terracotta-400 transition-colors"
          />
          <div className="flex gap-2">
            {(["", "disponible", "agotado"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setEstadoFilter(f)}
                className={`font-sans text-sm px-4 py-2 rounded-sm border transition-colors ${
                  estadoFilter === f
                    ? "bg-terracotta-500 text-white border-terracotta-500"
                    : "border-linen text-bark-900 hover:border-terracotta-400"
                }`}
              >
                {f === "" ? "Todas" : f === "disponible" ? "Disponibles" : "Agotadas"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="text-center py-20 font-sans text-clay-400">Cargando publicaciones...</div>
        ) : publications.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-bark-900 mb-2">No hay publicaciones</p>
            <p className="font-sans text-clay-500">
              {search || estadoFilter ? "Probá con otros filtros" : "Pronto habrá obras para mostrar"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
