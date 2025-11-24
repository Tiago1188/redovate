'use client';

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { IconExternalLink } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { publishSiteAction } from "@/actions/domain";

interface PublishingCardProps {
    liveUrl: string;
    lastPublishedAt: string | null;
    onPublish: (url: string, publishedAt: string) => void;
}

const publishedDateFormatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "short",
    timeStyle: "medium",
    hour12: false,
    timeZone: "UTC",
});

export function PublishingCard({
    liveUrl,
    lastPublishedAt,
    onPublish,
}: PublishingCardProps) {
    const [isPublishing, setIsPublishing] = useState(false);

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

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            const result = await publishSiteAction();
            if (result?.success) {
                onPublish(result.url, result.publishedAt);
                toast.success("Website published");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to publish website";
            toast.error(message);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
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
    );
}
