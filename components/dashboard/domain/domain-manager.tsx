'use client';

import { useState } from "react";
import { getPlatformDomainUrl } from "@/lib/validators/domain";
import { DomainHelpDialog } from "./domain-help-dialog";
import { SubdomainCard } from "./subdomain-card";
import { CustomDomainCard } from "./custom-domain-card";
import { PublishingCard } from "./publishing-card";

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
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const activeDomainBadge = verified && savedDomain ? "Custom domain live" : "Redovate subdomain active";

  const handleSubdomainUpdate = (slug: string, url: string) => {
    setSavedSlug(slug);
    if (!savedDomain || !verified) {
      setLiveUrl(url);
    }
  };

  const handleCustomDomainUpdate = (domain: string | null) => {
    setSavedDomain(domain ?? "");
    setVerified(false);
    setVerifiedDate(null);
    setDnsToken(null);
    if (!domain) {
      setLiveUrl(getPlatformDomainUrl(savedSlug));
    }
  };

  const handleDnsGenerated = (token: string) => {
    setDnsToken(token);
  };

  const handleVerified = (date: string) => {
    setVerified(true);
    setVerifiedDate(date);
  };

  const handlePublish = (url: string, publishedAt: string) => {
    setLiveUrl(url);
    setLastPublishedAt(publishedAt);
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
        <SubdomainCard
          initialSlug={savedSlug}
          liveUrl={liveUrl}
          activeDomainBadge={activeDomainBadge}
          verified={verified}
          savedDomain={savedDomain}
          onUpdate={handleSubdomainUpdate}
        />

        <CustomDomainCard
          canUseCustomDomain={canUseCustomDomain}
          savedDomain={savedDomain}
          dnsToken={dnsToken}
          verified={verified}
          verifiedDate={verifiedDate}
          onUpdate={handleCustomDomainUpdate}
          onDnsGenerated={handleDnsGenerated}
          onVerified={handleVerified}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        <PublishingCard
          liveUrl={liveUrl}
          lastPublishedAt={lastPublishedAt}
          onPublish={handlePublish}
        />
      </div>

      <DomainHelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen} />
    </div>
  );
}
