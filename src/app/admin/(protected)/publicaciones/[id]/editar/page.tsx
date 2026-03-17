import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PublicationForm from "@/components/admin/PublicationForm";

export default async function EditarPublicacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("publications")
    .select("*, media:publication_media(id, url, type, display_order)")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl text-bark-900 mb-8">Editar publicación</h1>
      <PublicationForm publication={data} />
    </div>
  );
}
