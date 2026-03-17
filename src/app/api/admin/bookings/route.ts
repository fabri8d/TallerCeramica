import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

// GET /api/admin/bookings — returns all bookings
export async function GET() {
  const { supabase, user } = await requireAuth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("booking_date", { ascending: false })
    .order("slot_time", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data ?? [] });
}

// POST /api/admin/bookings — create booking (no date/weekend restrictions, no emails)
export async function POST(request: NextRequest) {
  const { supabase, user } = await requireAuth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { nombre, apellido, email, telefono, booking_date, slot_time, status } = body;

  if (!nombre || !apellido || !email || !telefono || !booking_date || !slot_time) {
    return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 422 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({ nombre, apellido, email, telefono, booking_date, slot_time, status: status ?? "confirmed" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ booking: data }, { status: 201 });
}
