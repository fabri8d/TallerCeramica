export default function Footer() {
  return (
    <footer id="contacto" className="py-20 bg-bark-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="inline-block font-sans text-terracotta-400 text-sm tracking-widest uppercase mb-4">
              Contacto
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
              ¿Tenés preguntas?
            </h2>
            <p className="font-sans text-clay-300 text-lg leading-relaxed mb-8">
              Escribinos y te respondemos a la brevedad. También podés reservar
              tu turno directamente desde la sección de reservas.
            </p>
            <div className="space-y-4">
              {[
                { icon: "📧", label: "Email", value: "info@tallercerâmica.com" },
                { icon: "📱", label: "WhatsApp", value: "+54 11 0000-0000" },
                { icon: "📍", label: "Dirección", value: "Buenos Aires, Argentina" },
                { icon: "🕐", label: "Horarios", value: "Lun–Vie: 8–12 hs y 15–20 hs" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-sans text-xs text-clay-500 uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="font-sans text-clay-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bark-800 rounded-sm p-8 border border-bark-700">
            <h3 className="font-serif text-2xl text-white mb-3">
              ¿Listo para empezar?
            </h3>
            <p className="font-sans text-clay-300 mb-6">
              Reservá tu primer turno online en segundos. Sin llamadas, sin esperas.
            </p>
            <a
              href="#reservas"
              className="block text-center bg-terracotta-500 hover:bg-terracotta-400 text-white font-sans font-bold px-6 py-4 rounded-sm transition-colors"
            >
              Reservar mi primer clase
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
