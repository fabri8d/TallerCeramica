import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const { id, mediaId } = await params;
  const supabase = createServerSupabaseClient();

  // Get the media to find storage path for images
  const { data: media } = await supabase
    .from("publication_media")
    .select("url, type")
    .eq("id", mediaId)
    .eq("publication_id", id)
    .single();

  if (media?.type === "image") {
    // Extract path from URL and delete from storage
    const url = new URL(media.url);
    const path = url.pathname.split("/object/public/publication-media/")[1];
    if (path) {
      await supabase.storage.from("publication-media").remove([path]);
    }
  }

  const { error } = await supabase.from("publication_media").delete().eq("id", mediaId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
