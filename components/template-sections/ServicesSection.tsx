import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ServicesSection({ data }: { data: any }) {
    const services = data?.items || [
        { title: "Service 1", description: "Description of service 1" },
        { title: "Service 2", description: "Description of service 2" },
        { title: "Service 3", description: "Description of service 3" },
    ];

    return (
        <section className="py-16 px-4 md:px-8 bg-zinc-50 dark:bg-zinc-900">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center text-zinc-900 dark:text-white">
                    {data?.title || "Our Services"}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {services.map((service: any, index: number) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    {service.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

