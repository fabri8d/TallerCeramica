import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendBookingEmails } from "@/lib/resend";
import { isWeekend, isBefore, startOfToday, parseISO } from "date-fns";
import { ALL_SLOTS } from "@/lib/constants";
import type { BookingFormData } from "@/types";

// GET /api/bookings?date=YYYY-MM-DD
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Parámetro date inválido" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("slot_time")
    .eq("booking_date", date)
    .eq("status", "confirmed");

  if (error) {
    console.error("Supabase GET error:", error);
    return NextResponse.json({ error: "Error al consultar disponibilidad" }, { status: 500 });
  }

  const occupied_slots = (data ?? []).map((row: { slot_time: string }) =>
    row.slot_time.substring(0, 5)
  );

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

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      nombre,
      apellido,
      email,
      telefono,
      booking_date,
      slot_time,
    })
    .select()
    .single();

  if (error) {
    // Unique constraint violation → slot already taken
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Este turno ya está reservado. Por favor elegí otro horario." },
        { status: 409 }
      );
    }
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
