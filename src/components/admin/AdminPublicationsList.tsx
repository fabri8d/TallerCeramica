"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Publication } from "@/types";

interface Props {
  initialPublications: Publication[];
}

type EstadoFilter = "todas" | "disponible" | "agotado";

export default function AdminPublicationsList({ initialPublications }: Props) {
  const [publications, setPublications] = useState(initialPublications);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>("todas");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return publications.filter((p) => {
      const matchesSearch =
        !q || p.titulo.toLowerCase().includes(q) || p.autor.toLowerCase().includes(q);
      const matchesEstado =
        estadoFilter === "todas" || p.estado === estadoFilter;
      return matchesSearch && matchesEstado;
    });
  }, [publications, search, estadoFilter]);

  async function handleDelete(id: string, titulo: string) {
    if (!confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return;
    const res = await fetch(`/api/publications/${id}`, { method: "DELETE" });
    if (res.ok) setPublications((prev) => prev.filter((p) => p.id !== id));
    else alert("Error al eliminar la publicación");
  }

  const estadoButtons: { value: EstadoFilter; label: string }[] = [
    { value: "todas", label: "Todas" },
    { value: "disponible", label: "Disponible" },
    { value: "agotado", label: "Agotado" },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por título o autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 font-sans text-sm border border-linen rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
        />
        <div className="flex gap-1">
          {estadoButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setEstadoFilter(btn.value)}
              className={`font-sans text-xs font-bold px-3 py-2 rounded-sm transition-colors ${
                estadoFilter === btn.value
                  ? "bg-terracotta-500 text-white"
                  : "bg-white border border-linen text-clay-500 hover:border-terracotta-300"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-sm p-12 text-center shadow-sm">
          <p className="font-serif text-xl text-bark-900 mb-2">
            {publications.length === 0 ? "No hay publicaciones" : "Sin resultados"}
          </p>
          {publications.length === 0 && (
            <Link href="/admin/publicaciones/nueva" className="font-sans text-sm text-terracotta-500 underline">
              Crear la primera
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-clay-100 border-b border-linen">
              <tr>
                <th className="font-sans text-xs text-clay-400 uppercase tracking-wider text-left px-4 py-3">Obra</th>
                <th className="font-sans text-xs text-clay-400 uppercase tracking-wider text-left px-4 py-3 hidden sm:table-cell">Autor</th>
                <th className="font-sans text-xs text-clay-400 uppercase tracking-wider text-left px-4 py-3">Estado</th>
                <th className="font-sans text-xs text-clay-400 uppercase tracking-wider text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linen">
              {filtered.map((pub) => {
                const firstImage = pub.media?.find((m) => m.type === "image");
                return (
                  <tr key={pub.id} className="hover:bg-clay-100 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-clay-100 rounded-sm overflow-hidden flex-shrink-0 relative">
                          {firstImage ? (
                            <Image src={firstImage.url} alt="" fill className="object-cover" sizes="40px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg opacity-30">🏺</div>
                          )}
                        </div>
                        <span className="font-sans text-sm text-bark-900 font-bold">{pub.titulo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="font-sans text-sm text-clay-500">{pub.autor}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block font-sans text-xs font-bold px-2 py-1 rounded-sm ${
                        pub.estado === "agotado" ? "bg-clay-200 text-clay-600" : "bg-terracotta-100 text-terracotta-700"
                      }`}>
                        {pub.estado === "agotado" ? "Agotado" : "Disponible"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/publicaciones/${pub.id}/editar`}
                          className="font-sans text-xs text-terracotta-500 hover:text-terracotta-600 font-bold transition-colors"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(pub.id, pub.titulo)}
                          className="font-sans text-xs text-clay-400 hover:text-red-600 font-bold transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
