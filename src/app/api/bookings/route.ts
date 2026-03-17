import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendBookingEmails } from "@/lib/resend";
import { isWeekend, isBefore, startOfToday, parseISO } from "date-fns";
import { ALL_SLOTS } from "@/lib/constants";
import type { BookingFormData } from "@/types";

async function getSlotCapacity(supabase: ReturnType<typeof createServerSupabaseClient>): Promise<number> {
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "slot_capacity")
    .single();
  return data ? parseInt(data.value, 10) : 5;
}

// GET /api/bookings?date=YYYY-MM-DD
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Parámetro date inválido" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  const [capacityResult, bookingsResult] = await Promise.all([
    getSlotCapacity(supabase),
    supabase
      .from("bookings")
      .select("slot_time")
      .eq("booking_date", date)
      .eq("status", "confirmed"),
  ]);

  if (bookingsResult.error) {
    console.error("Supabase GET error:", bookingsResult.error);
    return NextResponse.json({ error: "Error al consultar disponibilidad" }, { status: 500 });
  }

  const capacity = capacityResult;
  const bookings = bookingsResult.data ?? [];

  // Count bookings per slot
  const countsBySlot: Record<string, number> = {};
  for (const row of bookings) {
    const slot = row.slot_time.substring(0, 5);
    countsBySlot[slot] = (countsBySlot[slot] ?? 0) + 1;
  }

  // A slot is "occupied" when it reaches capacity
  const occupied_slots = Object.entries(countsBySlot)
    .filter(([, count]) => count >= capacity)
    .map(([slot]) => slot);

  return NextResponse.json({ occupied_slots });
}

// POST /api/bookings
export async function POST(request: NextRequest) {
  let body: BookingFormData;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { nombre, apellido, email, telefono, booking_date, slot_time } = body;

  // Validate required fields
  if (!nombre || !apellido || !email || !telefono || !booking_date || !slot_time) {
    return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 422 });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 422 });
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(booking_date)) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 422 });
  }

  // Validate date is not in the past
  const parsedDate = parseISO(booking_date);
  if (isBefore(parsedDate, startOfToday())) {
    return NextResponse.json(
      { error: "No se pueden reservar turnos en fechas pasadas" },
      { status: 422 }
    );
  }

  // Validate weekday only
  if (isWeekend(parsedDate)) {
    return NextResponse.json(
      { error: "Solo se pueden reservar turnos de lunes a viernes" },
      { status: 422 }
    );
  }

  // Validate slot is one of the allowed slots
  const validSlotTimes = ALL_SLOTS.map((s) => s.time);
  if (!validSlotTimes.includes(slot_time)) {
    return NextResponse.json({ error: "Horario no válido" }, { status: 422 });
  }

  const supabase = createServerSupabaseClient();

  // Check capacity
  const [capacity, { count, error: countError }] = await Promise.all([
    getSlotCapacity(supabase),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("booking_date", booking_date)
      .eq("slot_time", slot_time)
      .eq("status", "confirmed"),
  ]);

  if (countError) {
    console.error("Supabase count error:", countError);
    return NextResponse.json({ error: "Error al verificar disponibilidad" }, { status: 500 });
  }

  if ((count ?? 0) >= capacity) {
    return NextResponse.json(
      { error: "Este turno ya está completo. Por favor elegí otro horario." },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({ nombre, apellido, email, telefono, booking_date, slot_time })
    .select()
    .single();

  if (error) {
    console.error("Supabase POST error:", error);
    return NextResponse.json({ error: "Error al crear la reserva" }, { status: 500 });
  }

  // Send emails (non-blocking — don't fail the booking if email fails)
  try {
    await sendBookingEmails({ nombre, apellido, email, telefono, booking_date, slot_time });
  } catch (emailErr) {
    console.error("Email send error:", emailErr);
  }

  return NextResponse.json({ success: true, booking: data }, { status: 201 });
}
