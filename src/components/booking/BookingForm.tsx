"use client";

import { useState } from "react";
import type { BookingFormData } from "@/types";

interface BookingFormProps {
  prefill: { booking_date: string; slot_time: string };
  onSuccess: (data: BookingFormData) => void;
}

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}

function Field({ label, id, type = "text", value, onChange, placeholder, required }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block font-sans text-sm font-bold text-bark-900 mb-1">
        {label} {required && <span className="text-terracotta-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border border-linen rounded-sm px-3 py-2 font-sans text-sm text-bark-900 bg-white focus:outline-none focus:border-terracotta-400 transition-colors"
      />
    </div>
  );
}

export default function BookingForm({ prefill, onSuccess }: BookingFormProps) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (field: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setServerError(null);

    try {
      const payload: BookingFormData = { ...form, ...prefill };
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Error al procesar la reserva");
        return;
      }

      onSuccess(payload);
    } catch {
      setServerError("Error de conexión. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Nombre"
          id="nombre"
          value={form.nombre}
          onChange={set("nombre")}
          placeholder="María"
          required
        />
        <Field
          label="Apellido"
          id="apellido"
          value={form.apellido}
          onChange={set("apellido")}
          placeholder="García"
          required
        />
      </div>
      <Field
        label="Email"
        id="email"
        type="email"
        value={form.email}
        onChange={set("email")}
        placeholder="maria@ejemplo.com"
        required
      />
      <Field
        label="Teléfono"
        id="telefono"
        type="tel"
        value={form.telefono}
        onChange={set("telefono")}
        placeholder="+54 11 0000-0000"
        required
      />

      {serverError && (
        <p className="font-sans text-sm text-terracotta-600 bg-terracotta-50 border border-terracotta-200 rounded-sm px-4 py-3">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white font-sans font-bold py-3 rounded-sm transition-colors"
      >
        {submitting ? "Enviando..." : "Confirmar reserva"}
      </button>
    </form>
  );
}
