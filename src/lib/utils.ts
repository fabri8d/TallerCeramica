import { format, parseISO, isWeekend, isBefore, startOfToday } from "date-fns";
import { es } from "date-fns/locale";

export function isWeekday(date: Date): boolean {
  return !isWeekend(date);
}

export function isPastDate(date: Date): boolean {
  return isBefore(date, startOfToday());
}

export function formatDateDisplay(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatDateShort(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, "dd/MM/yyyy");
}

export function formatSlotTime(time: string): string {
  // "08:00:00" → "8:00 hs" or "08:00" → "8:00 hs"
  const [h, m] = time.split(":");
  return `${parseInt(h, 10)}:${m} hs`;
}

export function toDateInputValue(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function normalizeSlotTime(time: string): string {
  // Normalize "08:00:00" → "08:00"
  return time.substring(0, 5);
}
