import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

// GET /api/admin/settings — returns slot_capacity
export async function GET() {
  const { supabase, user } = await requireAuth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "slot_capacity")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slot_capacity: parseInt(data.value, 10) });
}

// PUT /api/admin/settings — updates slot_capacity
export async function PUT(request: NextRequest) {
  const { supabase, user } = await requireAuth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  let body: { slot_capacity: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const capacity = Number(body.slot_capacity);
  if (!Number.isInteger(capacity) || capacity < 1) {
    return NextResponse.json({ error: "Capacidad inválida" }, { status: 422 });
  }

  const { error } = await supabase
    .from("settings")
    .upsert({ key: "slot_capacity", value: String(capacity) });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slot_capacity: capacity });
}
