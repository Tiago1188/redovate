import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Redovate
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-12">
            Build a professional website for your trade or service business in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-white text-zinc-900 rounded-lg font-semibold text-lg hover:bg-zinc-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-4 border border-zinc-600 text-white rounded-lg font-semibold text-lg hover:bg-zinc-800 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

