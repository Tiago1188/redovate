'use client';

import { CheckCircle, User, Building2, Loader2 } from "lucide-react";
import { completeOnboarding } from "@/actions/onboarding";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const accountTypes = [
    {
        id: "sole_trader",
        title: "Sole Trader",
        description: "Perfect for individual tradespeople.",
        icon: User,
    },
    {
        id: "company",
        title: "Company",
        description: "Best for trade companies and teams.",
        icon: Building2,
    },
];

export default function OnboardingPage() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            try {
                const result = await completeOnboarding(formData);
                if (result.success) {
                    toast.success("Account type saved successfully!");
                    router.push("/dashboard");
                }
            } catch (error) {
                toast.error("Failed to save account type. Please try again.");
                console.error(error);
            }
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Welcome to Redovate
                    </h2>
                    <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
                        Let's get your business set up.
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-8">
                    <fieldset>
                        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">Account type</legend>
                        <div className="space-y-4">
                            {accountTypes.map((type) => (
                                <label
                                    key={type.id}
                                    className="group relative flex cursor-pointer rounded-lg border border-zinc-200 bg-white p-4 shadow-sm focus:outline-none has-checked:border-indigo-600 has-checked:ring-1 has-checked:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:has-checked:border-indigo-500 dark:has-checked:ring-indigo-500"
                                >
                                    <input
                                        type="radio"
                                        name="account-type"
                                        value={type.id}
                                        required
                                        className="sr-only"
                                        aria-labelledby={`${type.id}-label`}
                                        aria-describedby={`${type.id}-description`}
                                    />
                                    <span className="flex flex-1">
                                        <span className="flex flex-col">
                                            <span
                                                id={`${type.id}-label`}
                                                className="flex items-center gap-2 block text-sm font-medium text-zinc-900 dark:text-white"
                                            >
                                                <type.icon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                                                {type.title}
                                            </span>
                                            <span
                                                id={`${type.id}-description`}
                                                className="mt-1 flex items-center text-sm text-zinc-500 dark:text-zinc-400"
                                            >
                                                {type.description}
                                            </span>
                                        </span>
                                    </span>
                                    <CheckCircle
                                        className="invisible ml-4 h-5 w-5 text-indigo-600 group-has-checked:visible dark:text-indigo-500"
                                        aria-hidden="true"
                                    />
                                    <span
                                        className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-focus:border group-has-focus-visible:border-indigo-600 dark:group-has-focus-visible:border-indigo-500"
                                        aria-hidden="true"
                                    />
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Setting up...
                                </>
                            ) : (
                                "Complete Setup"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

