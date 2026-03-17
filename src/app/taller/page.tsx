import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import BookingSection from "@/components/sections/BookingSection";

export const metadata = {
  title: "El Taller — Susana Biondi Cerámica",
  description: "Conocé el taller, los precios y reservá tu turno online.",
};

export default function TallerPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <BookingSection />
      </main>
      <Footer />
    </>
  );
}
