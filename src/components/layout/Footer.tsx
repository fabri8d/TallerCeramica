export default function Footer() {
  return (
    <footer className="bg-bark-900 text-clay-200 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl text-white mb-3">Taller de Cerámica</h3>
            <p className="font-sans text-sm leading-relaxed text-clay-300">
              Un espacio para crear, aprender y conectar con el arte de la cerámica.
            </p>
          </div>
          <div>
            <h4 className="font-sans font-bold text-white mb-3 uppercase text-xs tracking-wider">
              Horarios
            </h4>
            <p className="font-sans text-sm text-clay-300">Lunes a Viernes</p>
            <p className="font-sans text-sm text-clay-300">Mañana: 8:00 — 12:00</p>
            <p className="font-sans text-sm text-clay-300">Tarde: 15:00 — 20:00</p>
          </div>
          <div>
            <h4 className="font-sans font-bold text-white mb-3 uppercase text-xs tracking-wider">
              Navegación
            </h4>
            <nav className="flex flex-col gap-2">
              {["#nosotros", "#galeria", "#precios", "#reservas", "#contacto"].map((href) => (
                <a
                  key={href}
                  href={href}
                  className="font-sans text-sm text-clay-300 hover:text-terracotta-400 transition-colors capitalize"
                >
                  {href.replace("#", "")}
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-bark-700 text-center">
          <p className="font-sans text-xs text-clay-500">
            © {new Date().getFullYear()} Taller de Cerámica. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
