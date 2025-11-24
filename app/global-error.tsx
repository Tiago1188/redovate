'use client';

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import "@/app/globals.css"; // Ensure styles are loaded

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body>
                <main className="grid min-h-screen place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
                    <div className="text-center">
                        <p className="text-base font-semibold text-destructive">Critical Error</p>
                        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-7xl">
                            Something went wrong
                        </h1>
                        <p className="mt-6 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
                            A critical error occurred and the application cannot be rendered.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button onClick={() => reset()}>Try again</Button>
                            <Button asChild variant="outline" onClick={() => window.location.href = "/"}>
                                {/* Using window.location to force a full reload if router is broken */}
                                <span>Go back home</span>
                            </Button>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    );
}
