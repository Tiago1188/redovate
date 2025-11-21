import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactSection({ data }: { data: any }) {
    return (
        <section className="py-16 px-4 md:px-8 bg-white dark:bg-zinc-950">
            <div className="max-w-xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center text-zinc-900 dark:text-white">
                    {data?.title || "Contact Us"}
                </h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Name" />
                        <Input placeholder="Email" />
                    </div>
                    <Input placeholder="Subject" />
                    <Textarea placeholder="Message" className="min-h-[120px]" />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Send Message
                    </Button>
                </div>
                <div className="mt-8 text-center text-zinc-600 dark:text-zinc-400">
                    <p>{data?.address || "123 Business St, City, Country"}</p>
                    <p>{data?.phone || "+1 234 567 890"}</p>
                    <p>{data?.email || "contact@example.com"}</p>
                </div>
            </div>
        </section>
    );
}

