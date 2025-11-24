'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import {
    IconCheck,
    IconCopy,
    IconRefresh,
    IconRocket,
    IconSparkles,
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
import { CustomDomainFormSchema, type CustomDomainFormValues } from "@/validations/domain";
import { updateCustomDomainAction, generateDnsTokenAction, verifyDomainAction } from "@/actions/domain";

interface CustomDomainCardProps {
    canUseCustomDomain: boolean;
    savedDomain: string | null;
    dnsToken: string | null;
    verified: boolean;
    verifiedDate: string | null;
    onUpdate: (domain: string | null) => void;
    onDnsGenerated: (token: string) => void;
    onVerified: (date: string) => void;
    onOpenHelp: () => void;
}

export function CustomDomainCard({
    canUseCustomDomain,
    savedDomain,
    dnsToken,
    verified,
    verifiedDate,
    onUpdate,
    onDnsGenerated,
    onVerified,
    onOpenHelp,
}: CustomDomainCardProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingDns, setIsGeneratingDns] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const form = useForm<CustomDomainFormValues>({
        resolver: zodResolver(CustomDomainFormSchema),
        defaultValues: { domain: savedDomain ?? "" },
    });

    const txtRecordHost = savedDomain ? `_redovate.${savedDomain}` : "_redovate";

    const handleCopy = async (value: string, label: string) => {
        try {
            await navigator.clipboard.writeText(value);
            toast.success(`${label} copied`);
        } catch {
            toast.error("Unable to copy to clipboard");
        }
    };

    const onSubmit = async (values: CustomDomainFormValues) => {
        if (!canUseCustomDomain) return;
        setIsSaving(true);
        try {
            const result = await updateCustomDomainAction({
                domain: values.domain.length === 0 ? null : values.domain,
            });
            if (result?.success) {
                const domainValue = result.domain ?? "";
                onUpdate(domainValue || null);
                form.reset({ domain: domainValue });
                toast.success(domainValue ? "Custom domain saved" : "Custom domain removed");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to save custom domain";
            if (message.toLowerCase().includes("upgrade")) {
                toast.error(message);
            } else {
                form.setError("domain", { message });
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateDnsToken = async () => {
        if (!savedDomain) {
            toast.warning("Add a custom domain first.");
            return;
        }
        setIsGeneratingDns(true);
        try {
            const result = await generateDnsTokenAction();
            if (result?.success) {
                onDnsGenerated(result.token);
                toast.success("DNS TXT record generated");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to generate DNS token";
            toast.error(message);
        } finally {
            setIsGeneratingDns(false);
        }
    };

    const handleVerifyDomain = async () => {
        if (!savedDomain || !dnsToken) return;
        setIsVerifying(true);
        try {
            const result = await verifyDomainAction();
            if (result?.success && result.verified) {
                onVerified(result.verifiedDate);
                toast.success("Domain verified successfully!");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Verification failed";
            toast.error(message);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <CardTitle>Custom Domain</CardTitle>
                    <CardDescription>
                        {canUseCustomDomain
                            ? "Connect your own domain and verify ownership."
                            : "Upgrade to unlock custom domains and remove Redovate branding."}
                    </CardDescription>
                </div>
                {canUseCustomDomain && (
                    <Button variant="outline" size="sm" onClick={onOpenHelp}>
                        <IconSparkles className="mr-2 h-4 w-4" />
                        Setup Guide
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {canUseCustomDomain ? (
                    <>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="domain"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Domain</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="www.yourdomain.com" autoComplete="off" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-wrap gap-2">
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving ? "Saving..." : "Save Domain"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isGeneratingDns || !savedDomain}
                                        onClick={handleGenerateDnsToken}
                                    >
                                        <IconRefresh className="mr-2 h-4 w-4" />
                                        {isGeneratingDns ? "Generating..." : "Generate DNS TXT"}
                                    </Button>
                                    {dnsToken && !verified && (
                                        <Button
                                            type="button"
                                            variant="default"
                                            disabled={isVerifying}
                                            onClick={handleVerifyDomain}
                                        >
                                            <IconCheck className="mr-2 h-4 w-4" />
                                            {isVerifying ? "Verifying..." : "Verify Domain"}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </Form>

                        <div className="space-y-2 rounded-lg border p-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Badge variant={verified ? "default" : "outline"}>
                                    {verified ? "Verified" : "Awaiting verification"}
                                </Badge>
                                {verified && verifiedDate && (
                                    <span className="text-muted-foreground">
                                        Verified on {new Date(verifiedDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            {dnsToken ? (
                                <div className="space-y-2">
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">DNS TXT record</p>
                                    <div className="rounded-md bg-muted/50 p-3">
                                        <p className="font-mono text-xs">Host: {txtRecordHost}</p>
                                        <p className="font-mono text-xs break-all">Value: {dnsToken}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="px-2" onClick={() => handleCopy(dnsToken, "DNS token")}>
                                        <IconCopy className="mr-2 h-4 w-4" />
                                        Copy Token
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Generate a DNS record after saving your domain to verify ownership.
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm">
                        <p>Custom domains are available on Starter and Business plans.</p>
                        <Button asChild className="mt-3">
                            <Link href="/plans">
                                <IconRocket className="mr-2 h-4 w-4" />
                                Upgrade Plan
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
