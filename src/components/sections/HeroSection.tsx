export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center bg-bark-900 overflow-hidden pt-16"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bark-900 via-bark-800 to-terracotta-900 opacity-90" />

      {/* Decorative circle */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-terracotta-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-clay-500/10 blur-3xl" />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <span className="inline-block font-sans text-terracotta-400 text-sm tracking-[0.25em] uppercase mb-6">
          Bienvenidos al taller
        </span>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-white leading-tight mb-6">
          El arte de dar<br />
          <em className="text-terracotta-400">forma a la arcilla</em>
        </h1>
        <p className="font-sans text-clay-200 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Clases individuales y grupales para todos los niveles. Descubrí la
          meditación del trabajo con tus manos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#reservas"
            className="bg-terracotta-500 hover:bg-terracotta-400 text-white font-sans font-bold px-8 py-4 rounded-sm transition-colors text-lg"
          >
            Reservar un turno
          </a>
          <a
            href="#nosotros"
            className="border border-clay-400 text-clay-200 hover:bg-white/10 font-sans font-bold px-8 py-4 rounded-sm transition-colors text-lg"
          >
            Conocer más
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-clay-400">
        <span className="font-sans text-xs tracking-widest uppercase">Deslizá</span>
        <div className="w-px h-10 bg-clay-400/50 animate-pulse" />
      </div>
    </section>
  );
}
