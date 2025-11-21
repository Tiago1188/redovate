"use client";

import { FileText, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  businessName?: string | null;
}

export function EmptyState({ businessName }: EmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-md text-center space-y-6">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full animate-pulse" />
          <div className="relative flex items-center justify-center w-24 h-24 bg-indigo-50 dark:bg-indigo-950/50 rounded-full border-2 border-indigo-200 dark:border-indigo-800">
            <FileText className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {businessName ? `Welcome to ${businessName}!` : "Welcome to your Dashboard!"}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Your website content is being generated. Once ready, you'll see your sections, analytics, and data here.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-4">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          <span className="text-sm text-zinc-500 dark:text-zinc-500">
            AI generation in progress...
          </span>
        </div>

        <div className="pt-4">
          <Button
            variant="outline"
            className="gap-2"
            disabled
          >
            Content will appear here soon
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

