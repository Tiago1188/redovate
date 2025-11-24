import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
    return (
        <main className="grid min-h-[80vh] place-items-center px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-primary">404</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-7xl">
                    Page not found
                </h1>
                <p className="mt-6 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
                    Sorry, we couldn’t find the dashboard page you’re looking for.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button asChild>
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                    <Link href="#" className="text-sm font-semibold text-foreground hover:underline">
                        Contact support <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
