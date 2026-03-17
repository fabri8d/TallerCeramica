import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// POST — upload image (multipart) or add video URL (json)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    // Image upload
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 422 });

    const ext = file.name.split(".").pop();
    const path = `publications/${id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("publication-media")
      .upload(path, file, { contentType: file.type });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: urlData } = supabase.storage.from("publication-media").getPublicUrl(path);

    // Get current max order
    const { data: existing } = await supabase
      .from("publication_media")
      .select("display_order")
      .eq("publication_id", id)
      .order("display_order", { ascending: false })
      .limit(1);
    const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

    const { data, error } = await supabase
      .from("publication_media")
      .insert({ publication_id: id, url: urlData.publicUrl, type: "image", display_order: nextOrder })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ media: data }, { status: 201 });
  } else {
    // Video URL
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "url requerida" }, { status: 422 });

    const { data: existing } = await supabase
      .from("publication_media")
      .select("display_order")
      .eq("publication_id", id)
      .order("display_order", { ascending: false })
      .limit(1);
    const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

    const { data, error } = await supabase
      .from("publication_media")
      .insert({ publication_id: id, url, type: "video", display_order: nextOrder })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ media: data }, { status: 201 });
  }
}
