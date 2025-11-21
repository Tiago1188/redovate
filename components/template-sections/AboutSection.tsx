export function AboutSection({ data }: { data: any }) {
    return (
        <section className="py-16 px-4 md:px-8 bg-white dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">{data?.title || "About Us"}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {data?.content || "We are a dedicated team of professionals..."}
                    </p>
                </div>
                <div className="bg-zinc-200 dark:bg-zinc-800 h-64 rounded-lg flex items-center justify-center">
                    <span className="text-zinc-400">About Image</span>
                </div>
            </div>
        </section>
    );
}

