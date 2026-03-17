import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminPublicationsList from "@/components/admin/AdminPublicationsList";

export default async function AdminPublicacionesPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("publications")
    .select("*, media:publication_media(id, url, type, display_order)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-bark-900">Publicaciones</h1>
        <Link
          href="/admin/publicaciones/nueva"
          className="bg-terracotta-500 hover:bg-terracotta-600 text-white font-sans font-bold px-4 py-2 rounded-sm transition-colors text-sm"
        >
          + Nueva publicación
        </Link>
      </div>
      <AdminPublicationsList initialPublications={data ?? []} />
    </div>
  );
}
