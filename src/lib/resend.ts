import { Resend } from "resend";
import { BookingConfirmationEmail } from "../../emails/BookingConfirmation";
import { BookingNotificationEmail } from "../../emails/BookingNotification";
import { formatDateDisplay, formatSlotTime } from "./utils";

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY ?? "placeholder");
}

interface SendEmailsParams {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  booking_date: string;
  slot_time: string;
}

export async function sendBookingEmails(params: SendEmailsParams) {
  const { nombre, apellido, email, telefono, booking_date, slot_time } = params;
  const formattedDate = formatDateDisplay(booking_date);
  const formattedTime = formatSlotTime(slot_time);
  const fullName = `${nombre} ${apellido}`;
  const ownerEmail = process.env.OWNER_EMAIL!;
  const ownerName = process.env.OWNER_NAME ?? "Taller de Cerámica";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taller-ceramica.vercel.app";

  const resend = getResendClient();

  const results = await Promise.allSettled([
    // Email to client
    resend.emails.send({
      from: `${ownerName} <onboarding@resend.dev>`,
      to: email,
      subject: `Confirmación de reserva — ${formattedDate} a las ${formattedTime}`,
      react: BookingConfirmationEmail({
        nombre,
        apellido,
        booking_date: formattedDate,
        slot_time: formattedTime,
        tallerName: ownerName,
        siteUrl,
      }),
    }),
    // Email to owner
    resend.emails.send({
      from: `Sistema de Reservas <onboarding@resend.dev>`,
      to: ownerEmail,
      subject: `Nueva reserva: ${fullName} — ${formattedDate} ${formattedTime}`,
      react: BookingNotificationEmail({
        nombre,
        apellido,
        email,
        telefono,
        booking_date: formattedDate,
        slot_time: formattedTime,
        tallerName: ownerName,
      }),
    }),
  ]);

  return results;
}
