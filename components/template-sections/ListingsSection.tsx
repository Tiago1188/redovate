export function ListingsSection({ data }: { data?: any }) {
  const listings = data?.listings || [];

  // Default placeholder listings with Unsplash images
  const defaultListings = [
    {
      title: "Modern Family Home",
      location: "Sydney, NSW",
      price: "$850,000",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Luxury Apartment",
      location: "Melbourne, VIC",
      price: "$650,000",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Beachside Property",
      location: "Gold Coast, QLD",
      price: "$1,200,000",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&auto=format&fit=crop&w=800&h=600"
    }
  ];

  const displayListings = listings.length > 0 ? listings : defaultListings;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">
            Featured Listings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayListings.map((listing: any, idx: number) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                <img
                  src={
                    listing.image ||
                    `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&auto=format&fit=crop&w=800&h=600&ixlib=rb-4.0.3&ixid=${idx}`
                  }
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-gray-900">Featured</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {listing.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-sm">{listing.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-2xl font-bold text-gray-900">{listing.price}</p>
                  <a
                    href={listing.url || "#"}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

