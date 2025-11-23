import React from "react";
import { Phone, MapPin, FileText } from "lucide-react";

interface ContactData {
  phone?: string;
  mobile?: string;
  location?: string;
  address?: string;
  abn?: string;
}

export function ContactSection({ data, theme }: { data?: ContactData; theme?: any }) {
  const primaryColor = theme?.primary || "#0ea5e9";

  return (
    <section id="contact" className="py-24 px-6 bg-zinc-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px)`, backgroundSize: '30px 30px' }}>
        </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-10">
            <div className="space-y-4">
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-400">
                Contact Us
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Get In Touch
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 justify-center text-left max-w-2xl mx-auto">
              {/* Phone/Mobile */}
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 text-white"
                    style={{ color: primaryColor }}
                >
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400 mb-1">Call Us</p>
                  <p className="text-lg font-semibold text-white">
                    {data?.mobile || data?.phone || "0000 000 000"}
                  </p>
                </div>
              </div>
              
              {/* Location */}
               <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 text-white"
                        style={{ color: primaryColor }}
                    >
                    <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                    <p className="text-sm font-medium text-zinc-400 mb-1">Location</p>
                    <p className="text-lg font-semibold text-white">
                        {data?.location || data?.address || "City, State"}
                    </p>
                    </div>
                </div>
            </div>

            {/* ABN */}
            {data?.abn && (
                <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
                    <FileText className="w-4 h-4" />
                    <span>ABN: {data.abn}</span>
                </div>
            )}
        </div>
      </div>
    </section>
  );
}
