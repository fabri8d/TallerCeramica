const plans = [
  {
    name: "Clase Individual",
    price: "$3.500",
    duration: "1 hora",
    features: [
      "Atención personalizada",
      "Materiales incluidos",
      "Acceso al horno",
      "Llevate tu pieza terminada",
    ],
    highlighted: false,
    cta: "Reservar",
  },
  {
    name: "Pack 4 clases",
    price: "$12.000",
    duration: "4 horas en total",
    features: [
      "Todo lo del plan individual",
      "Seguimiento del progreso",
      "Técnicas progresivas",
      "Descuento del 14%",
    ],
    highlighted: true,
    cta: "Reservar pack",
  },
  {
    name: "Pack 8 clases",
    price: "$22.000",
    duration: "8 horas en total",
    features: [
      "Todo lo del pack 4",
      "Proyecto personal guiado",
      "Acceso libre entre clases",
      "Descuento del 21%",
    ],
    highlighted: false,
    cta: "Reservar pack",
  },
];

export default function PricingSection() {
  return (
    <section id="precios" className="py-20 bg-parchment">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block font-sans text-terracotta-500 text-sm tracking-widest uppercase mb-4">
            Precios
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-bark-900 mb-4">
            Planes para todos
          </h2>
          <p className="font-sans text-clay-600 text-lg max-w-2xl mx-auto">
            Empezá con una clase y descubrí tu pasión por la cerámica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-sm p-8 flex flex-col ${
                plan.highlighted
                  ? "bg-terracotta-500 text-white shadow-lg scale-105"
                  : "bg-clay-100 text-bark-900"
              }`}
            >
              <div className="mb-6">
                <h3
                  className={`font-serif text-2xl mb-1 ${
                    plan.highlighted ? "text-white" : "text-bark-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`font-sans text-sm ${
                    plan.highlighted ? "text-terracotta-100" : "text-clay-500"
                  }`}
                >
                  {plan.duration}
                </p>
              </div>
              <div className="mb-6">
                <span
                  className={`font-serif text-4xl font-bold ${
                    plan.highlighted ? "text-white" : "text-bark-900"
                  }`}
                >
                  {plan.price}
                </span>
              </div>
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-sans text-sm">
                    <span
                      className={`mt-0.5 ${
                        plan.highlighted ? "text-terracotta-200" : "text-terracotta-500"
                      }`}
                    >
                      ✓
                    </span>
                    <span className={plan.highlighted ? "text-white/90" : "text-clay-600"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#reservas"
                className={`text-center font-sans font-bold py-3 rounded-sm transition-colors ${
                  plan.highlighted
                    ? "bg-white text-terracotta-500 hover:bg-clay-100"
                    : "bg-terracotta-500 text-white hover:bg-terracotta-600"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
