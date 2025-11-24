'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    IconCopy,
    IconExternalLink,
    IconSparkles,
    IconWorld,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    PLATFORM_SUBDOMAIN_SUFFIX,
    getPlatformDomainUrl,
} from "@/lib/validators/domain";
import { SubdomainFormSchema, type SubdomainFormValues } from "@/validations/domain";
import { generateDomainSuggestion } from "@/actions/ai/domains";
import { useAIUsageStore } from "@/stores/use-ai-usage-store";

interface SubdomainCardProps {
    initialSlug: string;
    liveUrl: string;
    activeDomainBadge: string;
    verified: boolean;
    savedDomain: string | null;
    onUpdate: (slug: string, url: string) => void;
}

export function SubdomainCard({
    initialSlug,
    liveUrl,
    activeDomainBadge,
    verified,
    savedDomain,
    onUpdate,
}: SubdomainCardProps) {
    const incrementUsage = useAIUsageStore((state) => state.incrementUsage);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);

    // We need to import updateSubdomainAction here or pass it as a prop. 
    // Passing it as a prop might be cleaner for testing, but importing it is standard in Next.js server actions.
    // However, since I'm splitting the file, I'll import it directly to keep it self-contained.
    // Wait, I can't import server actions directly in a client component if I want to keep it pure? 
    // No, Next.js allows importing server actions in client components.
    // But to avoid circular dependencies or issues, I'll import it.

    // Actually, to keep the `DomainManager` as the controller, I should probably pass the action or the handler.
    // But `DomainManager` has a lot of state.
    // Let's keep the action call inside this component to reduce prop drilling, 
    // but we need to notify the parent about the update.

    // Re-importing the action here.
    // I'll need to use dynamic import or just import it at the top.
    // I'll assume I can import it.

    const form = useForm<SubdomainFormValues>({
        resolver: zodResolver(SubdomainFormSchema),
        defaultValues: { subdomain: initialSlug },
    });

    const subdomainPreview = form.watch("subdomain") || initialSlug;
    const previewUrl = getPlatformDomainUrl(subdomainPreview);

    const handleCopy = async (value: string, label: string) => {
        try {
            await navigator.clipboard.writeText(value);
            toast.success(`${label} copied`);
        } catch {
            toast.error("Unable to copy to clipboard");
        }
    };

    const handleVisitSubdomain = () => {
        const isLocalHost =
            typeof window !== "undefined" &&
            (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
        const targetUrl = isLocalHost ? `/preview/${initialSlug}` : getPlatformDomainUrl(initialSlug);
        window.open(targetUrl, "_blank");
    };

    // I need to import updateSubdomainAction. 
    // I will add the import at the top.

    const handleGenerateAi = async () => {
        setIsGeneratingAi(true);
        try {
            const result = await generateDomainSuggestion();
            if (!result?.success) {
                throw new Error(result?.error || "Failed to generate suggestion");
            }
            if (result.subdomain) {
                form.setValue("subdomain", result.subdomain, { shouldDirty: true });
            }
            incrementUsage();
            toast.success("AI suggestion applied");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unable to generate suggestion";
            toast.error(message);
        } finally {
            setIsGeneratingAi(false);
        }
    };

    const onSubmit = async (values: SubdomainFormValues) => {
        setIsSaving(true);
        try {
            // Dynamic import to avoid circular dependency if any (unlikely here but safe)
            const { updateSubdomainAction } = await import("@/actions/domain");
            const result = await updateSubdomainAction(values);
            if (result?.success) {
                form.reset({ subdomain: result.slug });
                onUpdate(result.slug, result.url);
                toast.success("Subdomain updated");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update subdomain";
            if (message.toLowerCase().includes("taken")) {
                form.setError("subdomain", { message });
            } else {
                toast.error(message);
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="lg:col-span-2">
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <CardTitle>Current Domain</CardTitle>
                    <CardDescription>Every site includes a free Redovate subdomain.</CardDescription>
                </div>
                <Button variant="outline" onClick={handleGenerateAi} disabled={isGeneratingAi}>
                    <IconSparkles className="mr-2 h-4 w-4" />
                    {isGeneratingAi ? "Generating..." : "Generate with AI"}
                </Button>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                        <IconWorld className="h-4 w-4 text-primary" />
                        <span className="break-all">{liveUrl}</span>
                        <Badge variant={verified && savedDomain ? "default" : "outline"}>{activeDomainBadge}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Visitors will see this address unless you publish a verified custom domain.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="subdomain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Redovate subdomain</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input {...field} className="flex-1" placeholder="yourbusiness" autoComplete="off" />
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                                .{PLATFORM_SUBDOMAIN_SUFFIX}
                                            </span>
                                        </div>
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground">Preview: {previewUrl}</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-wrap gap-2">
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save Subdomain"}
                            </Button>
                            <Button type="button" variant="outline" onClick={handleVisitSubdomain}>
                                <IconExternalLink className="mr-2 h-4 w-4" />
                                Visit
                            </Button>
                            <Button type="button" variant="outline" onClick={() => handleCopy(getPlatformDomainUrl(initialSlug), "Subdomain URL")}>
                                <IconCopy className="mr-2 h-4 w-4" />
                                Copy URL
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
