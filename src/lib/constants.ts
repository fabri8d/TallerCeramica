import type { TimeSlot } from "@/types";

export const MORNING_SLOTS: TimeSlot[] = [
  { time: "08:00", label: "8:00", period: "morning" },
  { time: "09:00", label: "9:00", period: "morning" },
  { time: "10:00", label: "10:00", period: "morning" },
  { time: "11:00", label: "11:00", period: "morning" },
];

export const AFTERNOON_SLOTS: TimeSlot[] = [
  { time: "15:00", label: "15:00", period: "afternoon" },
  { time: "16:00", label: "16:00", period: "afternoon" },
  { time: "17:00", label: "17:00", period: "afternoon" },
  { time: "18:00", label: "18:00", period: "afternoon" },
  { time: "19:00", label: "19:00", period: "afternoon" },
];

export const ALL_SLOTS: TimeSlot[] = [...MORNING_SLOTS, ...AFTERNOON_SLOTS];

// Days of week: 0=Sunday, 6=Saturday
export const ALLOWED_DAYS = [1, 2, 3, 4, 5]; // Monday–Friday

export const TALLER_NAME = process.env.OWNER_NAME ?? "Taller de Cerámica";
export const TALLER_EMAIL = process.env.OWNER_EMAIL ?? "info@tallercerâmica.com";
