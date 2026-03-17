import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/publications?search=...&estado=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const estado = searchParams.get("estado") ?? "";

  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("publications")
    .select("*, media:publication_media(id, url, type, display_order)")
    .order("created_at", { ascending: false });

  if (estado && (estado === "disponible" || estado === "agotado")) {
    query = query.eq("estado", estado);
  }
  if (search) {
    query = query.or(`titulo.ilike.%${search}%,autor.ilike.%${search}%,descripcion.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ publications: data ?? [] });
}

// POST /api/publications (admin only — auth checked in middleware)
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const body = await request.json();
  const { titulo, descripcion, autor, materiales, estado } = body;

  if (!titulo || !descripcion || !autor) {
    return NextResponse.json({ error: "titulo, descripcion y autor son requeridos" }, { status: 422 });
  }

  const { data, error } = await supabase
    .from("publications")
    .insert({ titulo, descripcion, autor, materiales: materiales ?? [], estado: estado ?? "disponible" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ publication: data }, { status: 201 });
}
