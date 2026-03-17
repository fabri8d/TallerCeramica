import Link from "next/link";
import Image from "next/image";
import type { Publication } from "@/types";

interface Props {
  publication: Publication;
}

export default function PublicationCard({ publication }: Props) {
  const firstImage = publication.media?.find((m) => m.type === "image");

  return (
    <Link
      href={`/publicaciones/${publication.id}`}
      className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="aspect-square bg-clay-100 relative overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={publication.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
            🏺
          </div>
        )}
        {/* Estado badge */}
        <span
          className={`absolute top-2 right-2 text-xs font-sans font-bold px-2 py-1 rounded-sm ${
            publication.estado === "agotado"
              ? "bg-bark-900 text-white"
              : "bg-terracotta-500 text-white"
          }`}
        >
          {publication.estado === "agotado" ? "Agotado" : "Disponible"}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-serif text-lg text-bark-900 leading-snug group-hover:text-terracotta-600 transition-colors">
          {publication.titulo}
        </h3>
        <p className="font-sans text-sm text-clay-500">Por {publication.autor}</p>
        {publication.materiales.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {publication.materiales.slice(0, 3).map((m) => (
              <span key={m} className="text-xs font-sans bg-clay-100 text-clay-600 px-2 py-0.5 rounded-sm">
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
