import Link from "next/link";
import { IconWorld } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPlatformDomainUrl } from "@/lib/validators/domain";

interface DomainCardProps {
  slug: string;
  domain: string | null;
  verified: boolean;
  canUseCustomDomain: boolean;
}

export function DomainCard({ slug, domain, verified, canUseCustomDomain }: DomainCardProps) {
  const hasLiveCustomDomain = Boolean(domain && verified);
  const activeUrl = hasLiveCustomDomain ? `https://${domain}` : getPlatformDomainUrl(slug);
  const statusLabel = hasLiveCustomDomain
    ? "Custom domain live"
    : canUseCustomDomain
    ? domain
      ? "Verification pending"
      : "Redovate subdomain"
    : "Upgrade required";

  const helperText = hasLiveCustomDomain
    ? "Visitors reach your verified custom domain."
    : canUseCustomDomain
    ? domain
      ? "Add the DNS record we provided to finish verification."
      : "Connect your own domain to build trust."
    : "Starter and Business plans unlock custom domains.";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Domain</span>
          <Badge variant={hasLiveCustomDomain ? "default" : "outline"}>{statusLabel}</Badge>
        </CardTitle>
        <CardDescription>{helperText}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconWorld className="h-4 w-4" />
            <span className="font-mono break-all text-foreground">{activeUrl}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/dashboard/domain">Manage domain</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

