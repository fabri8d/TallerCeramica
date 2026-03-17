const galleryItems = [
  { id: 1, title: "Tazas artesanales", description: "Piezas únicas para el café cotidiano" },
  { id: 2, title: "Jarrones decorativos", description: "Formas orgánicas con texturas naturales" },
  { id: 3, title: "Cuencos de arcilla", description: "Funcionalidad y estética en equilibrio" },
  { id: 4, title: "Platos de diseño", description: "La mesa como lienzo artístico" },
  { id: 5, title: "Esculturas pequeñas", description: "Expresión libre en tres dimensiones" },
  { id: 6, title: "Macetas cerámicas", description: "Para plantas que merecen un hogar hermoso" },
];

export default function GallerySection() {
  return (
    <section id="galeria" className="py-20 bg-clay-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block font-sans text-terracotta-500 text-sm tracking-widest uppercase mb-4">
            Galería
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-bark-900 mb-4">
            Lo que creamos juntos
          </h2>
          <p className="font-sans text-clay-600 text-lg max-w-2xl mx-auto">
            Cada pieza cuenta una historia. Estas son algunas de las creaciones
            de nuestros alumnos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group bg-parchment rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gradient-to-br from-clay-200 to-terracotta-200 flex items-center justify-center">
                <span className="text-6xl opacity-40">🏺</span>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-bark-900">{item.title}</h3>
                <p className="font-sans text-sm text-clay-500 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
