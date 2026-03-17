export interface Booking {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  booking_date: string; // YYYY-MM-DD
  slot_time: string;    // HH:MM:SS
  status: "confirmed" | "cancelled";
  created_at: string;
}

export interface BookingFormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  booking_date: string;
  slot_time: string;
}

export interface AvailabilityResponse {
  occupied_slots: string[];
}

export interface BookingResponse {
  success: boolean;
  booking?: Booking;
  error?: string;
}

export interface TimeSlot {
  time: string;       // "08:00"
  label: string;      // "8:00 AM"
  period: "morning" | "afternoon";
}

export interface Publication {
  id: string;
  titulo: string;
  descripcion: string;
  autor: string;
  materiales: string[];
  estado: "disponible" | "agotado";
  created_at: string;
  media?: PublicationMedia[];
}

export interface PublicationMedia {
  id: string;
  publication_id: string;
  url: string;
  type: "image" | "video";
  display_order: number;
}
