"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Publication, PublicationMedia } from "@/types";

interface Props {
  publication?: Publication;
}

export default function PublicationForm({ publication }: Props) {
  const router = useRouter();
  const isEdit = !!publication;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    titulo: publication?.titulo ?? "",
    descripcion: publication?.descripcion ?? "",
    autor: publication?.autor ?? "",
    materiales: publication?.materiales?.join(", ") ?? "",
    estado: publication?.estado ?? "disponible",
  });
  const [media, setMedia] = useState<PublicationMedia[]>(
    (publication?.media ?? []).sort((a, b) => a.display_order - b.display_order)
  );
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For new publications, we need the ID first (create then add media)
  const [savedId, setSavedId] = useState<string | null>(publication?.id ?? null);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function savePublication(): Promise<string | null> {
    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      autor: form.autor,
      materiales: form.materiales.split(",").map((m) => m.trim()).filter(Boolean),
      estado: form.estado,
    };

    if (isEdit && savedId) {
      const res = await fetch(`/api/publications/${savedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return null; }
      return savedId;
    } else {
      const res = await fetch("/api/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return null; }
      setSavedId(data.publication.id);
      return data.publication.id;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo || !form.descripcion || !form.autor) {
      setError("Título, descripción y autor son requeridos");
      return;
    }
    setSaving(true);
    setError(null);
    const id = await savePublication();
    if (!id) { setSaving(false); return; }
    router.push("/admin/publicaciones");
    router.refresh();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    // Need publication ID first — save the base data if new
    let pubId = savedId;
    if (!pubId) {
      if (!form.titulo || !form.descripcion || !form.autor) {
        setError("Completá título, descripción y autor antes de subir imágenes");
        return;
      }
      setSaving(true);
      pubId = await savePublication();
      setSaving(false);
      if (!pubId) return;
    }

    setUploading(true);
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/publications/${pubId}/media`, { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setMedia((prev) => [...prev, data.media]);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAddVideo() {
    if (!videoUrl.trim()) return;
    let pubId = savedId;
    if (!pubId) {
      if (!form.titulo || !form.descripcion || !form.autor) {
        setError("Completá título, descripción y autor antes de agregar videos");
        return;
      }
      setSaving(true);
      pubId = await savePublication();
      setSaving(false);
      if (!pubId) return;
    }

    const res = await fetch(`/api/publications/${pubId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: videoUrl }),
    });
    const data = await res.json();
    if (res.ok) { setMedia((prev) => [...prev, data.media]); setVideoUrl(""); }
    else setError(data.error);
  }

  async function handleDeleteMedia(mediaId: string) {
    if (!savedId) return;
    const res = await fetch(`/api/publications/${savedId}/media/${mediaId}`, { method: "DELETE" });
    if (res.ok) setMedia((prev) => prev.filter((m) => m.id !== mediaId));
  }

  const images = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* Basic info */}
      <div className="bg-white rounded-sm shadow-sm p-6 space-y-4">
        <h2 className="font-serif text-lg text-bark-900 border-b border-linen pb-3">Información</h2>

        <div>
          <label className="block font-sans text-sm font-bold text-bark-900 mb-1">
            Título <span className="text-terracotta-500">*</span>
          </label>
          <input value={form.titulo} onChange={set("titulo")} required className="w-full border border-linen rounded-sm px-3 py-2 font-sans text-sm focus:outline-none focus:border-terracotta-400" />
        </div>

        <div>
          <label className="block font-sans text-sm font-bold text-bark-900 mb-1">
            Descripción <span className="text-terracotta-500">*</span>
          </label>
          <textarea value={form.descripcion} onChange={set("descripcion")} required rows={4} className="w-full border border-linen rounded-sm px-3 py-2 font-sans text-sm focus:outline-none focus:border-terracotta-400 resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-sans text-sm font-bold text-bark-900 mb-1">
              Autor <span className="text-terracotta-500">*</span>
            </label>
            <input value={form.autor} onChange={set("autor")} required className="w-full border border-linen rounded-sm px-3 py-2 font-sans text-sm focus:outline-none focus:border-terracotta-400" />
          </div>
          <div>
            <label className="block font-sans text-sm font-bold text-bark-900 mb-1">Estado</label>
            <select value={form.estado} onChange={set("estado")} className="w-full border border-linen rounded-sm px-3 py-2 font-sans text-sm focus:outline-none focus:border-terracotta-400 bg-white">
              <option value="disponible">Disponible</option>
              <option value="agotado">Agotado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-sans text-sm font-bold text-bark-900 mb-1">
            Materiales <span className="font-normal text-clay-400">(separados por coma)</span>
          </label>
          <input value={form.materiales} onChange={set("materiales")} placeholder="arcilla, esmalte, óxido de hierro" className="w-full border border-linen rounded-sm px-3 py-2 font-sans text-sm focus:outline-none focus:border-terracotta-400" />
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-sm shadow-sm p-6 space-y-4">
        <h2 className="font-serif text-lg text-bark-900 border-b border-linen pb-3">Imágenes y videos</h2>

        {/* Image upload */}
        <div>
          <label className="block font-sans text-sm font-bold text-bark-900 mb-2">Imágenes</label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`flex items-center justify-center border-2 border-dashed border-linen rounded-sm py-6 cursor-pointer hover:border-terracotta-400 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <span className="font-sans text-sm text-clay-400">
              {uploading ? "Subiendo..." : "Hacé clic para subir imágenes"}
            </span>
          </label>
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="aspect-square bg-clay-100 rounded-sm overflow-hidden relative">
                    <Image src={img.url} alt="" fill className="object-cover" sizes="100px" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteMedia(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video URL */}
        <div>
          <label className="block font-sans text-sm font-bold text-bark-900 mb-2">Videos (YouTube / Vimeo)</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 border border-linen rounded-sm px-3 py-2 font-sans text-sm focus:outline-none focus:border-terracotta-400"
            />
            <button
              type="button"
              onClick={handleAddVideo}
              className="bg-clay-200 hover:bg-clay-300 text-bark-900 font-sans text-sm font-bold px-4 py-2 rounded-sm transition-colors"
            >
              Agregar
            </button>
          </div>
          {videos.length > 0 && (
            <ul className="mt-3 space-y-2">
              {videos.map((v) => (
                <li key={v.id} className="flex items-center justify-between bg-clay-100 px-3 py-2 rounded-sm">
                  <span className="font-sans text-xs text-clay-500 truncate flex-1">{v.url}</span>
                  <button type="button" onClick={() => handleDeleteMedia(v.id)} className="ml-2 text-red-500 hover:text-red-700 font-bold text-sm">×</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {error && <p className="font-sans text-sm text-terracotta-600 bg-terracotta-100 border border-terracotta-200 rounded-sm px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white font-sans font-bold px-6 py-3 rounded-sm transition-colors"
        >
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear publicación"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/publicaciones")}
          className="border border-linen text-bark-900 font-sans font-bold px-6 py-3 rounded-sm hover:bg-clay-100 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
