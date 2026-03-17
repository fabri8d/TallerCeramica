import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicationDetail from "@/components/publications/PublicationDetail";
import type { Publication } from "@/types";

export default async function PublicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("publications")
    .select("*, media:publication_media(id, url, type, display_order)")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const publication = data as Publication;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-parchment pt-16">
        <PublicationDetail publication={publication} />
      </main>
      <Footer />
    </>
  );
}
