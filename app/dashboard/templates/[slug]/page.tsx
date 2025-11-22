import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTemplateBySlug } from "@/actions/templates";
import RenderTemplate from "@/components/template-renderer/RenderTemplate";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function DashboardTemplatePreviewPage({ params }: PageProps) {
    const { slug } = await params;

    const template = await getTemplateBySlug(slug);
    if (!template) notFound();

    // Parse components array (fallback for old templates)
    const components = Array.isArray(template.components)
        ? template.components
        : JSON.parse(template.components || "[]");

    // Parse fake content (preview props)
    const fakeContent = typeof template.fake_content === "object"
        ? template.fake_content
        : JSON.parse(template.fake_content || "{}");

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
            <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/dashboard/templates">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to templates
                            </Link>
                        </Button>

                        <div className="h-6 w-px bg-border" />

                        <span className="font-medium text-sm hidden sm:inline-block">
                            Previewing: {template.name}
                        </span>
                    </div>
                </div>
            </div>

            <div 
                className="flex-1"
                style={{
                    // @ts-ignore
                    "--header-offset": "3.5rem",
                } as React.CSSProperties}
            >
                <RenderTemplate
                    components={components}
                    data={fakeContent}
                    showBranding={true}
                    templateSlug={template.slug}
                />
            </div>
        </div>
    );
}

