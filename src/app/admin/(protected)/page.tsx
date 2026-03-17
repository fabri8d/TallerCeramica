import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatSlotTime } from "@/lib/utils";
import SlotPieChart from "@/components/admin/SlotPieChart";
import type { Booking } from "@/types";

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().split("T")[0];

  const [
    { count: pubCount },
    { count: bookingCount },
    { data: todayData },
  ] = await Promise.all([
    supabase.from("publications").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("*")
      .eq("booking_date", today)
      .eq("status", "confirmed")
      .order("slot_time", { ascending: true }),
  ]);

  const todayBookings = (todayData ?? []) as Booking[];

  // Count per slot for pie chart
  const slotCounts: Record<string, number> = {};
  for (const b of todayBookings) {
    const slot = b.slot_time.substring(0, 5);
    slotCounts[slot] = (slotCounts[slot] ?? 0) + 1;
  }
  const pieData = Object.entries(slotCounts).map(([label, value]) => ({ label, value }));

  const stats = [
    { label: "Publicaciones totales", value: pubCount ?? 0 },
    { label: "Reservas totales", value: bookingCount ?? 0 },
  ];

  return (
    <div className="space-y-10">
      {/* Summary cards */}
      <div>
        <h1 className="font-serif text-3xl text-bark-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-sm p-6 shadow-sm">
              <p className="font-sans text-xs text-clay-400 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="font-serif text-4xl text-bark-900">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's bookings */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-2xl text-bark-900">Reservas de hoy</h2>
          <span className="font-sans text-sm font-bold bg-terracotta-100 text-terracotta-700 px-2.5 py-1 rounded-sm">
            {todayBookings.length} confirmada{todayBookings.length !== 1 ? "s" : ""}
          </span>
        </div>

        {todayBookings.length === 0 ? (
          <div className="bg-white rounded-sm p-10 text-center shadow-sm">
            <p className="font-serif text-lg text-clay-400">No hay reservas confirmadas para hoy.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-clay-100 border-b border-linen">
                  <tr>
                    {["Hora", "Alumno", "Estado"].map((h) => (
                      <th key={h} className="font-sans text-xs text-clay-400 uppercase tracking-wider text-left px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-linen">
                  {todayBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-clay-100 transition-colors">
                      <td className="px-4 py-3 font-sans text-sm font-bold text-bark-900">
                        {formatSlotTime(b.slot_time)}
                      </td>
                      <td className="px-4 py-3 font-sans text-sm text-bark-900">
                        {b.nombre} {b.apellido}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-sans text-xs font-bold px-2 py-1 rounded-sm bg-green-100 text-green-700">
                          Confirmada
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pie chart */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <p className="font-sans text-xs text-clay-400 uppercase tracking-wider mb-4">
                Distribución por horario
              </p>
              <SlotPieChart data={pieData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
