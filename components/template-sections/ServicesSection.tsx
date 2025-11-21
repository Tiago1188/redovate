export function ServicesSection({ data }: { data?: any }) {
  const services = data?.services || [
    {
      title: "Professional Consultation",
      description: "Expert advice tailored to your specific needs and goals.",
      icon: "💼"
    },
    {
      title: "Quality Service",
      description: "Dedicated to delivering excellence in every interaction.",
      icon: "⭐"
    },
    {
      title: "Ongoing Support",
      description: "We're here for you every step of the way, even after completion.",
      icon: "🤝"
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions designed to meet your unique requirements
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service: any, idx: number) => (
            <div
              key={idx}
              className="group p-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {service.icon || "✨"}
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

