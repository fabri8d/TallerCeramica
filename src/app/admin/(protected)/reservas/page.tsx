import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminReservasList from "@/components/admin/AdminReservasList";
import type { Booking } from "@/types";

export default async function AdminReservasPage() {
  const supabase = createServerSupabaseClient();

  const [bookingsResult, settingsResult] = await Promise.all([
    supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: false })
      .order("slot_time", { ascending: true }),
    supabase
      .from("settings")
      .select("value")
      .eq("key", "slot_capacity")
      .single(),
  ]);

  const bookings = (bookingsResult.data ?? []) as Booking[];
  const capacity = settingsResult.data ? parseInt(settingsResult.data.value, 10) : 5;

  return (
    <AdminReservasList initialBookings={bookings} initialCapacity={capacity} />
  );
}
