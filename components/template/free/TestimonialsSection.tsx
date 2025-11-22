import Image from "next/image";

export function TestimonialsSection({ data }: { data?: any }) {
  const testimonials = data?.testimonials || [
    {
      name: "Sarah Johnson",
      quote: "Exceptional service and attention to detail. Highly recommend!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&auto=format&fit=crop&w=150&h=150"
    },
    {
      name: "Michael Chen",
      quote: "Professional, reliable, and exceeded all expectations. Outstanding work!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&auto=format&fit=crop&w=150&h=150"
    },
    {
      name: "Emily Rodriguez",
      quote: "The best experience I've had. They truly care about their clients.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&auto=format&fit=crop&w=150&h=150"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t: any, idx: number) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    width={48}
                    height={48}
                    fill
                    src={t.image || `headImages/electrician.png`}
                    alt={t.name}
                    className="object-cover"
                    priority
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">Verified Client</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

