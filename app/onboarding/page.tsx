import { CheckCircle, User, Building2 } from "lucide-react";
import { completeOnboarding } from "@/actions/onboarding";

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

                <form action={completeOnboarding} className="space-y-8">
                    <div>
                        <label htmlFor="business-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Business Name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="business-name"
                                id="business-name"
                                required
                                className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm px-3 py-2 border"
                                placeholder="Acme Construction"
                            />
                        </div>
                    </div>

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
                        <button type="submit" className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Complete Setup
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

