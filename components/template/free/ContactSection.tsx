import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export function ContactSection({ data, theme }: { data?: any; theme?: any }) {
  const primaryColor = theme?.primary || "#0ea5e9";

  return (
    <section id="contact" className="py-24 px-6 bg-zinc-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px)`, backgroundSize: '30px 30px' }}>
        </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info */}
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-400">
                Contact Us
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Let's Make Your Space Shine
              </h2>
              <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
                Ready to experience the difference? Get in touch with us today for a free quote or to schedule your first clean.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Email */}
              <a 
                href={`mailto:${data?.email || "hello@sparkleclean.com"}`}
                className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
              >
                <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 text-white group-hover:scale-110 transition-transform"
                    style={{ color: primaryColor }}
                >
                  <Mail className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-zinc-400 mb-1">Email Us</p>
                  <p className="text-lg md:text-xl font-semibold text-white group-hover:text-blue-400 transition-colors break-all">
                    {data?.email || "hello@sparkleclean.com"}
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a 
                href={`tel:${data?.phone || "0400 123 456"}`}
                className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
              >
                <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 text-white group-hover:scale-110 transition-transform"
                    style={{ color: primaryColor }}
                >
                  <Phone className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-zinc-400 mb-1">Call Us</p>
                  <p className="text-lg md:text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {data?.phone || "0400 123 456"}
                  </p>
                </div>
              </a>
              
              {/* Location (Optional) */}
               {data?.address && (
                <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 text-white"
                        style={{ color: primaryColor }}
                    >
                    <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                    <p className="text-xs md:text-sm font-medium text-zinc-400 mb-1">Location</p>
                    <p className="text-lg md:text-xl font-semibold text-white">
                        {data.address}
                    </p>
                    </div>
                </div>
               )}
            </div>
          </div>

          {/* Simple Form Placeholder */}
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl text-zinc-900">
             <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Send us a Message</h3>
             <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">First Name</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Last Name</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50" placeholder="Doe" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Message</label>
                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50" placeholder="How can we help you?" />
                </div>
                <button 
                    className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                >
                    <Send className="w-5 h-5" />
                    Send Message
                </button>
             </form>
          </div>
        </div>
      </div>
    </section>
  );
}
