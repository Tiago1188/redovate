import { Button } from "@/components/ui/button";

export function HeroSection({ data }: { data: any }) {
    return (
        <section className="relative bg-zinc-900 text-white py-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">{data?.headline || "Welcome to our Business"}</h1>
                <p className="text-xl md:text-2xl text-zinc-300 mb-8">{data?.subheadline || "We provide excellent services."}</p>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    {data?.ctaText || "Get a Quote"}
                </Button>
            </div>
        </section>
    );
}

