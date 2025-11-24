'use client';

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useAIUsageStore } from "@/stores/use-ai-usage-store";

interface GenerateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGenerate: (count: number) => Promise<void>;
    maxCount: number;
    remainingSlots: number;
}

export function GenerateDialog({
    open,
    onOpenChange,
    onGenerate,
    maxCount,
    remainingSlots,
}: GenerateDialogProps) {
    const [count, setCount] = useState(3);
    const [isGenerating, setIsGenerating] = useState(false);
    const { usage, limit, planType } = useAIUsageStore();

    const isLimitReached = usage >= limit && limit < 999;
    const effectiveMax = Math.min(10, remainingSlots);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            await onGenerate(count);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Generate Keywords with AI
                    </DialogTitle>
                    <DialogDescription>
                        Let AI analyze your business and suggest high-value SEO keywords.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Number of keywords to generate: {count}</Label>
                            <span className="text-xs text-muted-foreground">
                                Max allowed: {effectiveMax}
                            </span>
                        </div>

                        <Slider
                            value={[count]}
                            onValueChange={(vals: number[]) => setCount(vals[0])}
                            min={1}
                            max={effectiveMax}
                            step={1}
                            disabled={isGenerating || effectiveMax === 0}
                        />
                    </div>

                    <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                        <div className="flex justify-between">
                            <span>AI Generations Used:</span>
                            <span className={isLimitReached ? "text-destructive font-medium" : ""}>
                                {usage} / {limit >= 999 ? "∞" : limit}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Keyword Slots Remaining:</span>
                            <span>{remainingSlots >= 999 ? "Unlimited" : remainingSlots}</span>
                        </div>
                    </div>

                    {isLimitReached && (
                        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            You have reached your AI generation limit for this billing period.
                            Please upgrade your plan to generate more.
                        </div>
                    )}

                    {remainingSlots === 0 && (
                        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            You have reached your keyword limit. Please upgrade your plan or delete existing keywords.
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isGenerating}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || isLimitReached || remainingSlots === 0}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
