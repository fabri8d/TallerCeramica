"use client";

import { formatDateDisplay, formatSlotTime } from "@/lib/utils";
import type { BookingFormData } from "@/types";

interface BookingSuccessProps {
  data: BookingFormData;
  onReset: () => void;
}

export default function BookingSuccess({ data, onReset }: BookingSuccessProps) {
  return (
    <div className="text-center py-8 px-4">
      <div className="text-6xl mb-6">🏺</div>
      <h3 className="font-serif text-3xl text-bark-900 mb-3">
        ¡Reserva confirmada!
      </h3>
      <p className="font-sans text-clay-500 mb-6 max-w-sm mx-auto">
        Te enviamos un email de confirmación a{" "}
        <span className="font-bold text-bark-900">{data.email}</span>
      </p>

      <div className="bg-clay-100 rounded-sm p-6 text-left max-w-sm mx-auto mb-8">
        <div className="space-y-3">
          <div>
            <span className="font-sans text-xs text-clay-400 uppercase tracking-wider">
              Alumno/a
            </span>
            <p className="font-sans text-bark-900 font-bold">
              {data.nombre} {data.apellido}
            </p>
          </div>
          <div>
            <span className="font-sans text-xs text-clay-400 uppercase tracking-wider">
              Fecha
            </span>
            <p className="font-sans text-bark-900 font-bold capitalize">
              {formatDateDisplay(data.booking_date)}
            </p>
          </div>
          <div>
            <span className="font-sans text-xs text-clay-400 uppercase tracking-wider">
              Horario
            </span>
            <p className="font-sans text-bark-900 font-bold">
              {formatSlotTime(data.slot_time)}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="font-sans text-sm text-terracotta-500 hover:text-terracotta-600 underline transition-colors"
      >
        Hacer otra reserva
      </button>
    </div>
  );
}
