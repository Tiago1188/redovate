"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Sparkles } from "lucide-react";

const loadingMessages = [
  "Analyzing your business information…",
  "Generating your About section…",
  "Creating service descriptions…",
  "Optimizing SEO keywords…",
  "Almost there — preparing your preview!",
];

export default function GeneratingPage() {
  const router = useRouter();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Cycle through messages every 2.5 seconds
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMessageIndex((prev) => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          }
          return prev;
        });
        setIsVisible(true);
      }, 300); // Wait for fade out before changing message
    }, 2500);

    return () => clearInterval(messageInterval);
  }, []);

  // Auto-redirect after all messages are shown
  useEffect(() => {
    if (currentMessageIndex === loadingMessages.length - 1) {
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [currentMessageIndex, router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-zinc-50 via-indigo-50/30 to-indigo-100/20 dark:from-zinc-950 dark:via-indigo-950/30 dark:to-indigo-900/20">
      {/* Floating sparkles background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-20 w-8 h-8 text-indigo-400/20 dark:text-indigo-500/20 animate-pulse" />
        <Sparkles className="absolute top-40 right-32 w-6 h-6 text-indigo-500/30 dark:text-indigo-400/30 animate-pulse delay-100" />
        <Sparkles className="absolute bottom-32 left-40 w-10 h-10 text-indigo-400/20 dark:text-indigo-500/20 animate-pulse delay-200" />
        <Sparkles className="absolute bottom-20 right-20 w-7 h-7 text-indigo-500/25 dark:text-indigo-400/25 animate-pulse delay-300" />
        <Sparkles className="absolute top-1/3 right-1/4 w-5 h-5 text-indigo-400/15 dark:text-indigo-500/15 animate-pulse delay-500" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl px-6 text-center space-y-8">
        {/* Spinner */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-400/20 blur-3xl rounded-full animate-pulse" />
          <Spinner className="relative w-16 h-16 text-indigo-600 dark:text-indigo-400" />
        </div>

        {/* Main headline */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-balance text-zinc-900 dark:text-zinc-100">
            Hang tight — our AI is generating your website content!
          </h1>

          {/* Animated subtext */}
          <div className="h-8 flex items-center justify-center">
            <p
              className={`text-lg text-zinc-600 dark:text-zinc-400 transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {loadingMessages[currentMessageIndex]}
            </p>
          </div>
        </div>

        {/* Progress dots indicator */}
        <div className="flex items-center gap-2 pt-4">
          {loadingMessages.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentMessageIndex
                  ? "w-8 bg-indigo-600 dark:bg-indigo-400"
                  : index < currentMessageIndex
                    ? "w-2 bg-indigo-600/50 dark:bg-indigo-400/50"
                    : "w-2 bg-zinc-300 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>

        {/* Helper text */}
        <p className="text-sm text-zinc-500 dark:text-zinc-500 pt-4">
          This usually takes 10-15 seconds
        </p>
      </div>
    </div>
  );
}

