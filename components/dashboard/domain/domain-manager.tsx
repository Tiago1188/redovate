'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  IconCopy,
  IconExternalLink,
  IconRefresh,
  IconRocket,
  IconSparkles,
  IconWorld,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  CustomDomainSchema,
  SubdomainSchema,
  PLATFORM_SUBDOMAIN_SUFFIX,
  getPlatformDomainUrl,
  normalizeDomain,
  normalizeSubdomain,
} from "@/lib/validators/domain";
import { updateSubdomainAction, updateCustomDomainAction, generateDnsTokenAction, publishSiteAction } from "@/actions/domain";
import { generateDomainSuggestion } from "@/actions/ai/domains";
import { useAIUsageStore } from "@/stores/use-ai-usage-store";

const SubdomainFormSchema = z.object({
  subdomain: z
    .string()
    .transform((value) => normalizeSubdomain(value))
    .pipe(SubdomainSchema),
});

const CustomDomainFormSchema = z.object({
  domain: z
    .string()
    .transform((value) => {
      const normalized = normalizeDomain(value);
      return normalized.length === 0 ? "" : normalized;
    })
    .pipe(z.union([CustomDomainSchema, z.literal("")])),
});

const publishedDateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "short",
  timeStyle: "medium",
  hour12: false,
  timeZone: "UTC",
});

type SubdomainFormValues = z.infer<typeof SubdomainFormSchema>;
type CustomDomainFormValues = z.infer<typeof CustomDomainFormSchema>;

interface DomainManagerProps {
  planType: string;
  canUseCustomDomain: boolean;
  business: {
    id: string;
    name: string;
    slug: string;
    domain: string | null;
    verified: boolean;
    verifiedDate: string | null;
    dnsVerificationToken: string | null;
    websiteUrl: string | null;
    updatedAt: string | null;
  };
}

export function DomainManager({ planType, canUseCustomDomain, business }: DomainManagerProps) {
  const incrementUsage = useAIUsageStore((state) => state.incrementUsage);

  const [savedSlug, setSavedSlug] = useState(business.slug);
  const [savedDomain, setSavedDomain] = useState(business.domain ?? "");
  const [dnsToken, setDnsToken] = useState<string | null>(business.dnsVerificationToken);
  const [verified, setVerified] = useState<boolean>(business.verified);
  const [verifiedDate, setVerifiedDate] = useState<string | null>(business.verifiedDate);
  const [liveUrl, setLiveUrl] = useState(
    business.websiteUrl ||
      (business.domain && business.verified ? `https://${business.domain}` : getPlatformDomainUrl(business.slug))
  );
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(business.websiteUrl ? business.updatedAt : null);

  const [isSavingSubdomain, setIsSavingSubdomain] = useState(false);
  const [isSavingCustomDomain, setIsSavingCustomDomain] = useState(false);
  const [isGeneratingDns, setIsGeneratingDns] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const subdomainForm = useForm<SubdomainFormValues>({
    resolver: zodResolver(SubdomainFormSchema),
    defaultValues: { subdomain: business.slug },
  });

  const customDomainForm = useForm<CustomDomainFormValues>({
    resolver: zodResolver(CustomDomainFormSchema),
    defaultValues: { domain: business.domain ?? "" },
  });

  const subdomainPreview = subdomainForm.watch("subdomain") || savedSlug;
  const previewUrl = getPlatformDomainUrl(subdomainPreview);
  const txtRecordHost = savedDomain ? `_redovate.${savedDomain}` : "_redovate";

  const activeDomainBadge = verified && savedDomain ? "Custom domain live" : "Redovate subdomain active";

  const lastPublishedText = useMemo(() => {
    if (!lastPublishedAt) return "Not published yet";
    try {
      const date = new Date(lastPublishedAt);
      if (Number.isNaN(date.getTime())) {
        return lastPublishedAt;
      }
      return `${publishedDateFormatter.format(date)} UTC`;
    } catch {
      return lastPublishedAt;
    }
  }, [lastPublishedAt]);

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
    const targetUrl = isLocalHost ? `/preview/${savedSlug}` : getPlatformDomainUrl(savedSlug);
    window.open(targetUrl, "_blank");
  };

  const handleSubdomainSubmit = async (values: SubdomainFormValues) => {
    setIsSavingSubdomain(true);
    try {
      const result = await updateSubdomainAction(values);
      if (result?.success) {
        setSavedSlug(result.slug);
        subdomainForm.reset({ subdomain: result.slug });
        if (!savedDomain || !verified) {
          setLiveUrl(result.url);
        }
        toast.success("Subdomain updated");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update subdomain";
      toast.error(message);
    } finally {
      setIsSavingSubdomain(false);
    }
  };

  const handleCustomDomainSubmit = async (values: CustomDomainFormValues) => {
    if (!canUseCustomDomain) return;
    setIsSavingCustomDomain(true);
    try {
      const result = await updateCustomDomainAction({
        domain: values.domain.length === 0 ? null : values.domain,
      });
      if (result?.success) {
        const domainValue = result.domain ?? "";
        setSavedDomain(domainValue);
        setVerified(false);
        setVerifiedDate(null);
        setDnsToken(null);
        if (!domainValue) {
          setLiveUrl(getPlatformDomainUrl(savedSlug));
        }
        customDomainForm.reset({ domain: domainValue });
        toast.success(domainValue ? "Custom domain saved" : "Custom domain removed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save custom domain";
      toast.error(message);
    } finally {
      setIsSavingCustomDomain(false);
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
        setDnsToken(result.token);
        toast.success("DNS TXT record generated");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate DNS token";
      toast.error(message);
    } finally {
      setIsGeneratingDns(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const result = await publishSiteAction();
      if (result?.success) {
        setLiveUrl(result.url);
        if (result.publishedAt) {
          setLastPublishedAt(result.publishedAt);
        }
        toast.success("Website published");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to publish website";
      toast.error(message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleGenerateAi = async () => {
    setIsGeneratingAi(true);
    try {
      const result = await generateDomainSuggestion();
      if (!result?.success) {
        throw new Error(result?.error || "Failed to generate suggestion");
      }
      if (result.subdomain) {
        subdomainForm.setValue("subdomain", result.subdomain, { shouldDirty: true });
      }
      if (result.customDomain) {
        customDomainForm.setValue("domain", result.customDomain, { shouldDirty: true });
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

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Domain Settings</h1>
        <p className="text-muted-foreground">
          Set up your Redovate subdomain, connect a custom domain, and publish your site live.
        </p>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Plan: {planType}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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

            <Form {...subdomainForm}>
              <form onSubmit={subdomainForm.handleSubmit(handleSubdomainSubmit)} className="space-y-4">
                <FormField
                  control={subdomainForm.control}
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
                  <Button type="submit" disabled={isSavingSubdomain}>
                    {isSavingSubdomain ? "Saving..." : "Save Subdomain"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleVisitSubdomain}>
                    <IconExternalLink className="mr-2 h-4 w-4" />
                    Visit
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleCopy(getPlatformDomainUrl(savedSlug), "Subdomain URL")}>
                    <IconCopy className="mr-2 h-4 w-4" />
                    Copy URL
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Domain</CardTitle>
            <CardDescription>
              {canUseCustomDomain
                ? "Connect your own domain and verify ownership."
                : "Upgrade to unlock custom domains and remove Redovate branding."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {canUseCustomDomain ? (
              <>
                <Form {...customDomainForm}>
                  <form onSubmit={customDomainForm.handleSubmit(handleCustomDomainSubmit)} className="space-y-4">
                    <FormField
                      control={customDomainForm.control}
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
                      <Button type="submit" disabled={isSavingCustomDomain}>
                        {isSavingCustomDomain ? "Saving..." : "Save Domain"}
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

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>Make your latest changes live for visitors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs uppercase text-muted-foreground">Website status</p>
              <div className="mt-1 font-medium">{liveUrl}</div>
              <p className="text-xs text-muted-foreground mt-2">Last published: {lastPublishedText}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1" onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish Now"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => window.open(liveUrl, "_blank")}
            >
              <IconExternalLink className="mr-2 h-4 w-4" />
              Visit Site
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

