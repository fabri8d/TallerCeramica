export default function AboutSection() {
  return (
    <section id="nosotros" className="py-20 bg-parchment">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <span className="inline-block font-sans text-terracotta-500 text-sm tracking-widest uppercase mb-4">
              Sobre nosotros
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-bark-900 mb-6 leading-tight">
              Un espacio para crear con las manos
            </h2>
            <p className="font-sans text-clay-600 text-lg leading-relaxed mb-4">
              Nuestro taller nació de la pasión por la cerámica artesanal.
              Ofrecemos un ambiente cálido y acogedor donde cada persona puede
              explorar su creatividad a su propio ritmo.
            </p>
            <p className="font-sans text-clay-600 leading-relaxed mb-6">
              Desde principiantes hasta artistas experimentados, adaptamos cada
              clase a tus necesidades. Trabajamos con arcilla natural, técnicas
              tradicionales y métodos contemporáneos.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-linen">
              {[
                { num: "+5 años", label: "de experiencia" },
                { num: "+200", label: "alumnos formados" },
                { num: "9 turnos", label: "diarios disponibles" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-2xl text-terracotta-500 font-semibold">
                    {stat.num}
                  </div>
                  <div className="font-sans text-xs text-clay-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative block */}
          <div className="relative">
            <div className="aspect-square rounded-sm bg-clay-100 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-8xl mb-4">🏺</div>
                <p className="font-serif text-xl text-bark-900 italic">
                  &quot;La arcilla es el material más honesto del mundo&quot;
                </p>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-terracotta-300 rounded-sm" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-terracotta-300 rounded-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
