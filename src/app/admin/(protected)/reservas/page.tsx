import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatDateShort, formatSlotTime } from "@/lib/utils";
import type { Booking } from "@/types";

export default async function AdminReservasPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .order("booking_date", { ascending: false })
    .order("slot_time", { ascending: true });

  const bookings = (data ?? []) as Booking[];

  return (
    <div>
      <h1 className="font-serif text-3xl text-bark-900 mb-8">Reservas</h1>
      {bookings.length === 0 ? (
        <div className="bg-white rounded-sm p-12 text-center shadow-sm">
          <p className="font-serif text-xl text-bark-900">No hay reservas aún</p>
        </div>
      ) : (
        <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead className="bg-clay-100 border-b border-linen">
              <tr>
                {["Fecha", "Hora", "Alumno", "Email", "Teléfono", "Estado"].map((h) => (
                  <th key={h} className="font-sans text-xs text-clay-400 uppercase tracking-wider text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-linen">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-clay-100 transition-colors">
                  <td className="px-4 py-3 font-sans text-sm text-bark-900">{formatDateShort(b.booking_date)}</td>
                  <td className="px-4 py-3 font-sans text-sm text-bark-900">{formatSlotTime(b.slot_time)}</td>
                  <td className="px-4 py-3 font-sans text-sm font-bold text-bark-900">{b.nombre} {b.apellido}</td>
                  <td className="px-4 py-3 font-sans text-sm text-clay-500">{b.email}</td>
                  <td className="px-4 py-3 font-sans text-sm text-clay-500">{b.telefono}</td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-xs font-bold px-2 py-1 rounded-sm ${
                      b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-clay-200 text-clay-500"
                    }`}>
                      {b.status === "confirmed" ? "Confirmada" : "Cancelada"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
