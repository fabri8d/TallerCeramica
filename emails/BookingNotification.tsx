import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Section,
} from "@react-email/components";

interface Props {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  booking_date: string;
  slot_time: string;
  tallerName: string;
}

export function BookingNotificationEmail({
  nombre,
  apellido,
  email,
  telefono,
  booking_date,
  slot_time,
  tallerName,
}: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f9f3ec", fontFamily: "sans-serif" }}>
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Section style={{ backgroundColor: "#2d1b0e", padding: "32px 40px" }}>
            <Heading
              style={{ color: "#c9613a", fontSize: "20px", margin: 0 }}
            >
              Nueva reserva — {tallerName}
            </Heading>
          </Section>
          <Section style={{ padding: "40px" }}>
            <Heading
              style={{ fontSize: "18px", color: "#2d1b0e", marginBottom: "16px" }}
            >
              Detalle de la reserva
            </Heading>
            <Section
              style={{
                backgroundColor: "#f5ede4",
                borderRadius: "6px",
                padding: "20px 24px",
              }}
            >
              <Text style={{ margin: "4px 0", color: "#2d1b0e", fontWeight: "bold" }}>
                Cliente
              </Text>
              <Text style={{ margin: "4px 0", color: "#555" }}>
                👤 Nombre: {nombre} {apellido}
              </Text>
              <Text style={{ margin: "4px 0", color: "#555" }}>
                📧 Email: {email}
              </Text>
              <Text style={{ margin: "4px 0", color: "#555" }}>
                📱 Teléfono: {telefono}
              </Text>
              <Hr style={{ borderColor: "#ede8df", margin: "16px 0" }} />
              <Text style={{ margin: "4px 0", color: "#2d1b0e", fontWeight: "bold" }}>
                Turno
              </Text>
              <Text style={{ margin: "4px 0", color: "#555" }}>
                📅 Fecha: {booking_date}
              </Text>
              <Text style={{ margin: "4px 0", color: "#555" }}>
                🕐 Hora: {slot_time}
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingNotificationEmail;
