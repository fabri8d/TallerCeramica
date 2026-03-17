"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Publication } from "@/types";

interface Props {
  publication: Publication;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname.includes("youtube.com")) videoId = u.searchParams.get("v");
    else if (u.hostname === "youtu.be") videoId = u.pathname.slice(1);
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {}
  return url;
}

function buildWhatsAppUrl(titulo: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const message = encodeURIComponent(`Hola! Me interesa la publicación: "${titulo}". ¿Podés darme más información?`);
  return `https://wa.me/${phone}?text=${message}`;
}

export default function PublicationDetail({ publication }: Props) {
  const images = (publication.media ?? []).filter((m) => m.type === "image").sort((a, b) => a.display_order - b.display_order);
  const videos = (publication.media ?? []).filter((m) => m.type === "video").sort((a, b) => a.display_order - b.display_order);
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-2 font-sans text-sm text-terracotta-500 hover:text-terracotta-600 mb-8 transition-colors">
        ← Volver a la galería
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Media */}
        <div>
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="aspect-square bg-clay-100 rounded-sm overflow-hidden relative">
                <Image
                  src={images[activeImage].url}
                  alt={publication.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-16 h-16 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-colors ${
                        i === activeImage ? "border-terracotta-500" : "border-transparent"
                      }`}
                    >
                      <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Videos */}
          {videos.map((v) => (
            <div key={v.id} className="mt-4 aspect-video rounded-sm overflow-hidden bg-bark-900">
              <iframe
                src={getYouTubeEmbedUrl(v.url) ?? v.url}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="font-serif text-3xl md:text-4xl text-bark-900 leading-tight">
              {publication.titulo}
            </h1>
            <span className={`flex-shrink-0 text-xs font-sans font-bold px-3 py-1 rounded-sm ${
              publication.estado === "agotado"
                ? "bg-bark-900 text-white"
                : "bg-terracotta-500 text-white"
            }`}>
              {publication.estado === "agotado" ? "Agotado" : "Disponible"}
            </span>
          </div>

          <p className="font-sans text-clay-500 text-sm mb-1">Por</p>
          <p className="font-serif text-xl text-bark-900 mb-6">{publication.autor}</p>

          <p className="font-sans text-clay-600 leading-relaxed mb-6">{publication.descripcion}</p>

          {publication.materiales.length > 0 && (
            <div className="mb-8">
              <p className="font-sans text-xs text-clay-400 uppercase tracking-wider font-bold mb-2">
                Materiales utilizados
              </p>
              <div className="flex flex-wrap gap-2">
                {publication.materiales.map((m) => (
                  <span key={m} className="font-sans text-sm bg-clay-100 text-clay-700 px-3 py-1 rounded-sm">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto">
            {publication.estado === "disponible" ? (
              <a
                href={buildWhatsAppUrl(publication.titulo)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white font-sans font-bold py-4 px-6 rounded-sm transition-colors text-lg"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>
            ) : (
              <div className="w-full bg-clay-200 text-clay-500 font-sans font-bold py-4 px-6 rounded-sm text-center text-lg">
                Esta pieza ya no está disponible
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
