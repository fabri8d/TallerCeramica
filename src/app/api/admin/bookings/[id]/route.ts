import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

// PUT /api/admin/bookings/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireAuth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { nombre, apellido, email, telefono, booking_date, slot_time, status } = body;

  const { data, error } = await supabase
    .from("bookings")
    .update({ nombre, apellido, email, telefono, booking_date, slot_time, status })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ booking: data });
}

// DELETE /api/admin/bookings/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireAuth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
