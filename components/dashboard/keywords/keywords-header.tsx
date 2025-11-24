'use client';

import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface KeywordsHeaderProps {
    currentCount: number;
    maxCount: number;
    onAdd: () => void;
    onGenerate: () => void;
    isGenerating: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export function KeywordsHeader({
    currentCount,
    maxCount,
    onAdd,
    onGenerate,
    isGenerating,
    searchTerm,
    onSearchChange,
}: KeywordsHeaderProps) {
    const isLimitReached = currentCount >= maxCount && maxCount < 999;

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Keywords</h1>
                <p className="text-muted-foreground">
                    Manage your SEO keywords ({currentCount} / {maxCount >= 999 ? "Unlimited" : maxCount})
                </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                    placeholder="Search keywords..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full sm:w-[200px]"
                />
                <Button
                    variant="outline"
                    onClick={onGenerate}
                    disabled={isGenerating || isLimitReached}
                >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI
                </Button>
                <Button onClick={onAdd} disabled={isLimitReached}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Keyword
                </Button>
            </div>
        </div>
    );
}
