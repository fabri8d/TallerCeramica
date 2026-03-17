"use client";

import { useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import { MORNING_SLOTS, AFTERNOON_SLOTS } from "@/lib/constants";
import type { TimeSlot } from "@/types";

interface SlotGridProps {
  date: Date;
  selected: string | null;
  onSelect: (slot: string) => void;
}

export default function SlotGrid({ date, selected, onSelect }: SlotGridProps) {
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateStr = format(date, "yyyy-MM-dd");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/bookings?date=${dateStr}`)
      .then((r) => r.json())
      .then((data) => {
        setOccupiedSlots(data.occupied_slots ?? []);
      })
      .catch(() => setError("No se pudo cargar la disponibilidad"))
      .finally(() => setLoading(false));
  }, [dateStr]);

  if (loading) {
    return (
      <div className="py-8 text-center font-sans text-clay-400">
        Cargando disponibilidad...
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-4 text-center font-sans text-terracotta-600 text-sm">
        {error}
      </div>
    );
  }

  const todayDate = isToday(date);
  const nowMinutes = todayDate
    ? new Date().getHours() * 60 + new Date().getMinutes()
    : -1;

  function isPastSlot(slotTime: string) {
    if (!todayDate) return false;
    const [h, m] = slotTime.split(":").map(Number);
    return h * 60 + m <= nowMinutes;
  }

  const renderSlots = (slots: TimeSlot[], title: string) => (
    <div>
      <p className="font-sans text-xs text-clay-400 uppercase tracking-wider font-bold mb-2">
        {title}
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => {
          const occupied = occupiedSlots.includes(slot.time) || isPastSlot(slot.time);
          const isSelected = selected === slot.time;
          return (
            <button
              key={slot.time}
              disabled={occupied}
              onClick={() => !occupied && onSelect(slot.time)}
              className={`
                py-2 px-3 rounded-sm text-sm font-sans font-bold transition-colors
                ${occupied ? "bg-clay-100 text-clay-300 cursor-not-allowed line-through" : "cursor-pointer"}
                ${isSelected ? "bg-terracotta-500 text-white" : ""}
                ${!isSelected && !occupied ? "bg-white border border-linen text-bark-900 hover:border-terracotta-400 hover:text-terracotta-500" : ""}
              `}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderSlots(MORNING_SLOTS, "Mañana")}
      {renderSlots(AFTERNOON_SLOTS, "Tarde")}
    </div>
  );
}
