export function ContactSection({ data }: { data?: any }) {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Get In Touch</h2>
            <p className="text-lg text-gray-600">
              We'd love to hear from you. Reach out and let's start a conversation.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <a
                    href={`mailto:${data?.email || "info@example.com"}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {data?.email || "info@example.com"}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                  <a
                    href={`tel:${data?.phone || "+61 400 000 000"}`}
                    className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors"
                  >
                    {data?.phone || "+61 400 000 000"}
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8 border-t border-gray-100">
              <a
                href={`mailto:${data?.email || "info@example.com"}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Send Us a Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

