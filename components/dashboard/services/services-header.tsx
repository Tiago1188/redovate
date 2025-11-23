'use client';

import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServicesHeaderProps {
  currentCount: number;
  maxCount: number;
  onAdd: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ServicesHeader({ 
  currentCount, 
  maxCount, 
  onAdd, 
  onGenerate,
  isGenerating 
}: ServicesHeaderProps) {
  const isLimitReached = currentCount >= maxCount && maxCount < 999;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Services</h1>
        <p className="text-muted-foreground">
          Manage your business services here.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">
            Services: {currentCount}/{maxCount >= 999 ? "∞" : maxCount}
          </Badge>
        </div>

        <Button onClick={onAdd} disabled={isLimitReached}>
          <Plus className="mr-2 h-4 w-4" />
          Add Manually
        </Button>

        <Button 
          variant="outline" 
          onClick={onGenerate} 
          disabled={isLimitReached || isGenerating}
        >
          {isGenerating ? (
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate with AI
        </Button>
      </div>
    </div>
  );
}

