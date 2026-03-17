"use client";

import { useState } from "react";
import { ALL_SLOTS } from "@/lib/constants";
import type { Booking } from "@/types";

interface Props {
  booking?: Booking;
  onClose: () => void;
  onSaved: (booking: Booking) => void;
}

type FormFields = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  booking_date: string;
  slot_time: string;
  status: "confirmed" | "cancelled";
};

export default function ReservaFormModal({ booking, onClose, onSaved }: Props) {
  const isEdit = !!booking;
  const [fields, setFields] = useState<FormFields>({
    nombre: booking?.nombre ?? "",
    apellido: booking?.apellido ?? "",
    email: booking?.email ?? "",
    telefono: booking?.telefono ?? "",
    booking_date: booking?.booking_date ?? "",
    slot_time: booking?.slot_time ? booking.slot_time.substring(0, 5) : ALL_SLOTS[0].time,
    status: booking?.status ?? "confirmed",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof FormFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const url = isEdit ? `/api/admin/bookings/${booking!.id}` : "/api/admin/bookings";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    const json = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(json.error ?? "Error al guardar");
      return;
    }

    onSaved(json.booking);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-linen">
          <h2 className="font-serif text-xl text-bark-900">
            {isEdit ? "Editar reserva" : "Nueva reserva"}
          </h2>
          <button onClick={onClose} className="text-clay-400 hover:text-bark-900 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-xs text-clay-400 mb-1">Nombre</label>
              <input
                required
                value={fields.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                className="w-full font-sans text-sm border border-linen rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-clay-400 mb-1">Apellido</label>
              <input
                required
                value={fields.apellido}
                onChange={(e) => set("apellido", e.target.value)}
                className="w-full font-sans text-sm border border-linen rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs text-clay-400 mb-1">Email</label>
            <input
              required
              type="email"
              value={fields.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full font-sans text-sm border border-linen rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
            />
          </div>

          <div>
            <label className="block font-sans text-xs text-clay-400 mb-1">Teléfono</label>
            <input
              required
              value={fields.telefono}
              onChange={(e) => set("telefono", e.target.value)}
              className="w-full font-sans text-sm border border-linen rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-xs text-clay-400 mb-1">Fecha</label>
              <input
                required
                type="date"
                value={fields.booking_date}
                onChange={(e) => set("booking_date", e.target.value)}
                className="w-full font-sans text-sm border border-linen rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-clay-400 mb-1">Horario</label>
              <select
                value={fields.slot_time}
                onChange={(e) => set("slot_time", e.target.value)}
                className="w-full font-sans text-sm border border-linen rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
              >
                {ALL_SLOTS.map((s) => (
                  <option key={s.time} value={s.time}>{s.label} hs</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs text-clay-400 mb-1">Estado</label>
            <select
              value={fields.status}
              onChange={(e) => set("status", e.target.value as "confirmed" | "cancelled")}
              className="w-full font-sans text-sm border border-linen rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
            >
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          {error && (
            <p className="font-sans text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="font-sans text-sm text-clay-500 hover:text-bark-900 px-4 py-2 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="font-sans text-sm font-bold bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white px-5 py-2 rounded-sm transition-colors"
            >
              {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
