"use client";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWeekend,
  isBefore,
  startOfToday,
  getDay,
} from "date-fns";
import { es } from "date-fns/locale";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date) => void;
}

export default function DatePicker({ selected, onChange }: DatePickerProps) {
  const [viewDate, setViewDate] = useState(new Date());
  const today = startOfToday();

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Padding for first week
  const startPad = (getDay(monthStart) + 6) % 7; // 0=Mon

  const isDisabled = (day: Date) => isBefore(day, today) || isWeekend(day);

  return (
    <div className="bg-white border border-linen rounded-sm p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewDate(subMonths(viewDate, 1))}
          className="p-2 hover:bg-clay-100 rounded-sm text-bark-900 transition-colors"
          aria-label="Mes anterior"
        >
          ←
        </button>
        <span className="font-serif text-bark-900 font-semibold capitalize">
          {format(viewDate, "MMMM yyyy", { locale: es })}
        </span>
        <button
          onClick={() => setViewDate(addMonths(viewDate, 1))}
          className="p-2 hover:bg-clay-100 rounded-sm text-bark-900 transition-colors"
          aria-label="Mes siguiente"
        >
          →
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map((d) => (
          <div
            key={d}
            className="text-center font-sans text-xs text-clay-400 font-bold py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {/* Padding */}
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map((day) => {
          const disabled = isDisabled(day);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toISOString()}
              disabled={disabled}
              onClick={() => !disabled && onChange(day)}
              className={`
                aspect-square flex items-center justify-center rounded-sm text-sm font-sans
                transition-colors
                ${disabled ? "text-clay-300 cursor-not-allowed" : "cursor-pointer"}
                ${isSelected ? "bg-terracotta-500 text-white font-bold" : ""}
                ${!isSelected && isToday ? "border border-terracotta-400 text-terracotta-600 font-bold" : ""}
                ${!isSelected && !isToday && !disabled ? "text-bark-900 hover:bg-clay-100" : ""}
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
