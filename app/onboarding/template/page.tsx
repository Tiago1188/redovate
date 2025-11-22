import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getTemplatesByPlan } from "@/actions/templates";
import { hasActiveTemplate } from "@/actions/dashboard/hasActiveTemplate";
import { UseTemplateButton } from "./use-template-button";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

// Helper function to get fallback Unsplash images based on template name/slug
function getFallbackThumbnail(templateName: string, slug: string): string {
  const name = (templateName || slug || "").toLowerCase();
  
  // Map common template types to relevant Unsplash images
  if (name.includes("law") || name.includes("legal")) {
    return "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&auto=format&fit=crop&w=1200&h=675";
  }
  if (name.includes("dentist") || name.includes("dental")) {
    return "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&auto=format&fit=crop&w=1200&h=675";
  }
  if (name.includes("real estate") || name.includes("property")) {
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&auto=format&fit=crop&w=1200&h=675";
  }
  if (name.includes("restaurant") || name.includes("food")) {
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&auto=format&fit=crop&w=1200&h=675";
  }
  if (name.includes("fitness") || name.includes("gym")) {
    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&auto=format&fit=crop&w=1200&h=675";
  }
  
  // Default professional business image
  return "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&auto=format&fit=crop&w=1200&h=675";
}

export default async function TemplateSelectionPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // Check if user already has an active template and redirect to dashboard if so
    const hasTemplate = await hasActiveTemplate();
    if (hasTemplate) {
        redirect("/dashboard");
    }

    const templates = await getTemplatesByPlan();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
                        Choose Your Website Template
                    </h1>
                    <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                        Select a professional design to get started. You can customize it later.
                    </p>
                </div>

                {templates.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-zinc-500">No templates found for your plan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {templates.map((template: any) => {
                            // Replace broken Cloudinary demo URLs with Unsplash fallbacks
                            const thumbnailUrl = template.thumbnail && 
                                !template.thumbnail.includes('cloudinary.com/demo') 
                                ? template.thumbnail 
                                : getFallbackThumbnail(template.name, template.slug);
                            
                            return (
                            <Card
                                key={template.id}
                                className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg hover:border-blue-500/50"
                            >
                                <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800">
                                    <Image
                                        src={thumbnailUrl}
                                        alt={template.name}
                                        fill
                                        className="object-cover"
                                    />

                                    <div className="absolute top-2 right-2">
                                        <Badge
                                            variant={template.plan_level === "free" ? "secondary" : "default"}
                                            className="capitalize"
                                        >
                                            {template.plan_level}
                                        </Badge>
                                    </div>
                                </div>

                                <CardHeader>
                                    <CardTitle>{template.name}</CardTitle>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                        {template.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="grow" />

                                <CardFooter className="grid grid-cols-2 gap-3">
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href={`/onboarding/template/${template.slug}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Preview
                                        </Link>
                                    </Button>

                                    <UseTemplateButton templateId={template.id} />
                                </CardFooter>
                            </Card>
                            );
                        })}

                    </div>
                )}
            </div>
        </div>
    );
}
