import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicationsLanding from "@/components/sections/PublicationsLanding";

export const metadata = {
  title: "Galería — Taller de Cerámica de Susana Biondi",
  description: "Obras de cerámica artesanal creadas en el taller. Explorá y consultá por tus favoritas.",
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <PublicationsLanding />
      </main>
      <Footer />
    </>
  );
}
