import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("publications")
    .select("*, media:publication_media(id, url, type, display_order)")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Publicación no encontrada" }, { status: 404 });
  return NextResponse.json({ publication: data });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const body = await request.json();
  const { titulo, descripcion, autor, materiales, estado } = body;

  const { data, error } = await supabase
    .from("publications")
    .update({ titulo, descripcion, autor, materiales, estado })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ publication: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("publications").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
