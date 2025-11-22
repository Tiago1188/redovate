export function AboutSection({ data }: { data?: any }) {
  const aboutImage =
    data?.clinic_photo ||
    data?.agent_photo ||
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&auto=format&fit=crop&w=1200&h=800";

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* TEXT SIDE */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                About Us
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">
                We're Here to Help
              </h2>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              {data?.about ||
                "We take pride in offering professional, reliable and high-quality services tailored to your needs. With years of experience and a commitment to excellence, we've built a reputation for delivering outstanding results."}
            </p>

            {/* Stats or Features */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div>
                <p className="text-3xl font-bold text-blue-600">10+</p>
                <p className="text-sm text-gray-600 mt-1">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">500+</p>
                <p className="text-sm text-gray-600 mt-1">Happy Clients</p>
              </div>
            </div>
          </div>

          {/* IMAGE SIDE */}
          <div className="relative">
            <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
              <img
                src={aboutImage}
                className="w-full h-full object-cover"
                alt="About section image"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-2xl opacity-10 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
