import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient();
  const [{ count: pubCount }, { count: bookingCount }] = await Promise.all([
    supabase.from("publications").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Publicaciones totales", value: pubCount ?? 0 },
    { label: "Reservas totales", value: bookingCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-bark-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-sm p-6 shadow-sm">
            <p className="font-sans text-xs text-clay-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="font-serif text-4xl text-bark-900">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
