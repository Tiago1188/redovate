import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTemplateBySlug } from "@/app/onboarding/actions/getTemplateBySlug";
import RenderTemplate from "@/components/template-renderer/RenderTemplate";
import { UseTemplateButton } from "../use-template-button";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function TemplatePreviewPage({ params }: PageProps) {
    const { slug } = await params;

    const template = await getTemplateBySlug(slug);
    console.log(template);
    if (!template) notFound();

    // FIX: Ensure JSON from DB is parsed
    const components = Array.isArray(template.components)
        ? template.components
        : JSON.parse(template.components || "[]");

    const fakeContent = typeof template.fake_content === "object"
        ? template.fake_content
        : JSON.parse(template.fake_content || "{}");

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
            {/* Top Bar */}
            <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/onboarding/template">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to templates
                            </Link>
                        </Button>

                        <div className="h-6 w-px bg-border" />

                        <span className="font-medium text-sm hidden sm:inline-block">
                            Previewing: {template.name}
                        </span>
                    </div>

                    <UseTemplateButton templateId={template.id} />
                </div>
            </div>

            {/* Template Preview */}
            <div className="flex-1">
                <RenderTemplate
                    components={components}
                    data={fakeContent}
                    showBranding={true}
                />
            </div>
        </div>
    );
}
