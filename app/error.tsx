'use client';

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="grid min-h-screen place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-destructive">Error</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-7xl">
                    Something went wrong
                </h1>
                <p className="mt-6 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
                    We apologize for the inconvenience. An unexpected error has occurred.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button onClick={reset}>Try again</Button>
                    <Button asChild variant="outline">
                        <Link href="/">Go back home</Link>
                    </Button>
                </div>
                <div className="mt-8">
                    <Link href="#" className="text-sm font-semibold text-foreground hover:underline">
                        Contact support <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
