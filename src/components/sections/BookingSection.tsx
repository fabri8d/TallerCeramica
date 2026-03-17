"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DatePicker from "@/components/booking/DatePicker";
import SlotGrid from "@/components/booking/SlotGrid";
import BookingForm from "@/components/booking/BookingForm";
import BookingSuccess from "@/components/booking/BookingSuccess";
import type { BookingFormData } from "@/types";

type Step = "date" | "slot" | "form" | "success";

export default function BookingSection() {
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<BookingFormData | null>(null);

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep("slot");
  }

  function handleSlotSelect(slot: string) {
    setSelectedSlot(slot);
    setStep("form");
  }

  function handleSuccess(data: BookingFormData) {
    setSuccessData(data);
    setStep("success");
  }

  function handleReset() {
    setStep("date");
    setSelectedDate(null);
    setSelectedSlot(null);
    setSuccessData(null);
  }

  const steps: { key: Step; label: string }[] = [
    { key: "date", label: "Elegí fecha" },
    { key: "slot", label: "Elegí horario" },
    { key: "form", label: "Tus datos" },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <section id="reservas" className="py-20 bg-clay-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block font-sans text-terracotta-500 text-sm tracking-widest uppercase mb-4">
            Reservas
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-bark-900 mb-4">
            Reservá tu turno
          </h2>
          <p className="font-sans text-clay-600 text-lg">
            Lunes a viernes · Mañana 8–12 hs · Tarde 15–20 hs · Turnos de 1 hora
          </p>
        </div>

        {step !== "success" && (
          <div className="flex items-center justify-center mb-10 gap-2">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 font-sans text-sm ${
                    i <= stepIndex ? "text-terracotta-500" : "text-clay-300"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < stepIndex
                        ? "bg-terracotta-500 text-white"
                        : i === stepIndex
                        ? "border-2 border-terracotta-500 text-terracotta-500"
                        : "border-2 border-clay-200 text-clay-300"
                    }`}
                  >
                    {i < stepIndex ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-8 h-px ${
                      i < stepIndex ? "bg-terracotta-400" : "bg-clay-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-parchment rounded-sm shadow-sm p-6 sm:p-8">
          {step === "date" && (
            <div>
              <h3 className="font-serif text-xl text-bark-900 mb-4">
                Seleccioná una fecha
              </h3>
              <DatePicker selected={selectedDate} onChange={handleDateSelect} />
            </div>
          )}

          {step === "slot" && selectedDate && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setStep("date")}
                  className="font-sans text-sm text-terracotta-500 hover:text-terracotta-600 transition-colors"
                >
                  ← Cambiar fecha
                </button>
                <span className="font-sans text-sm text-clay-400">·</span>
                <span className="font-sans text-sm font-bold text-bark-900 capitalize">
                  {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                </span>
              </div>
              <h3 className="font-serif text-xl text-bark-900 mb-4">
                Elegí un horario
              </h3>
              <SlotGrid
                date={selectedDate}
                selected={selectedSlot}
                onSelect={handleSlotSelect}
              />
            </div>
          )}

          {step === "form" && selectedDate && selectedSlot && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setStep("slot")}
                  className="font-sans text-sm text-terracotta-500 hover:text-terracotta-600 transition-colors"
                >
                  ← Cambiar horario
                </button>
                <span className="font-sans text-sm text-clay-400">·</span>
                <span className="font-sans text-sm font-bold text-bark-900">
                  {format(selectedDate, "dd/MM/yyyy")} — {selectedSlot} hs
                </span>
              </div>
              <h3 className="font-serif text-xl text-bark-900 mb-4">
                Completá tus datos
              </h3>
              <BookingForm
                prefill={{
                  booking_date: format(selectedDate, "yyyy-MM-dd"),
                  slot_time: selectedSlot,
                }}
                onSuccess={handleSuccess}
              />
            </div>
          )}

          {step === "success" && successData && (
            <BookingSuccess data={successData} onReset={handleReset} />
          )}
        </div>
      </div>
    </section>
  );
}
