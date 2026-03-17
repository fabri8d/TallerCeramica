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
  booking_date: string;
  slot_time: string;
  tallerName: string;
  siteUrl: string;
}

export function BookingConfirmationEmail({
  nombre,
  apellido,
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
          <Section style={{ backgroundColor: "#c9613a", padding: "32px 40px" }}>
            <Heading
              style={{ color: "#ffffff", fontSize: "24px", margin: 0 }}
            >
              {tallerName}
            </Heading>
          </Section>
          <Section style={{ padding: "40px" }}>
            <Heading
              style={{ fontSize: "20px", color: "#2d1b0e", marginBottom: "8px" }}
            >
              ¡Reserva confirmada!
            </Heading>
            <Text style={{ color: "#555", lineHeight: "1.6" }}>
              Hola {nombre} {apellido},
            </Text>
            <Text style={{ color: "#555", lineHeight: "1.6" }}>
              Tu reserva ha sido confirmada con éxito. Te esperamos en el taller.
            </Text>
            <Hr style={{ borderColor: "#ede8df", margin: "24px 0" }} />
            <Section
              style={{
                backgroundColor: "#f5ede4",
                borderRadius: "6px",
                padding: "20px 24px",
              }}
            >
              <Text style={{ margin: "4px 0", color: "#2d1b0e", fontWeight: "bold" }}>
                Detalles de tu reserva
              </Text>
              <Text style={{ margin: "4px 0", color: "#555" }}>
                📅 Fecha: {booking_date}
              </Text>
              <Text style={{ margin: "4px 0", color: "#555" }}>
                🕐 Hora: {slot_time}
              </Text>
              <Text style={{ margin: "4px 0", color: "#555" }}>
                ⏱ Duración: 1 hora
              </Text>
            </Section>
            <Text style={{ color: "#555", lineHeight: "1.6", marginTop: "24px" }}>
              Si necesitás cancelar o modificar tu reserva, comunicate con nosotros
              con al menos 24 horas de anticipación.
            </Text>
            <Text style={{ color: "#555", lineHeight: "1.6" }}>
              ¡Nos vemos pronto!
            </Text>
            <Text style={{ color: "#c9613a", fontWeight: "bold" }}>
              El equipo de {tallerName}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingConfirmationEmail;
