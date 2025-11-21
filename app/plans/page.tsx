'use client';

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { selectPlan, getStarterPlanCount } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "/month",
        description: "Perfect for getting started",
        features: [
            "Redovate subdomain (yourbusiness.redovate.com)",
            "1-2 simple, clean templates",
            "Basic contact information display",
            "Up to 5 services",
            "Up to 5 SEO keywords",
            "Single business location",
            "Upload one logo or photo",
            "Basic AI content generation",
            "Mobile responsive design",
            "Redovate branding included",
            "Community support",
        ],
        planType: "free" as const,
        highlighted: false,
    },
    {
        name: "Starter",
        price: "$19",
        period: "/month",
        description: "Best for growing businesses",
        features: [
            "Custom domain support (yourbusiness.com)",
            "10+ premium professional templates",
            "Contact forms with email notifications",
            "Up to 15 services with descriptions",
            "Up to 15 SEO keywords",
            "Multiple service locations",
            "Unlimited image portfolio uploads",
            "Custom color schemes & styling",
            "Remove Redovate branding",
            "Enhanced AI generation (faster & smarter)",
            "Basic SEO optimization",
            "Google Analytics integration",
            "Social media links integration",
            "Priority email support",
        ],
        planType: "starter" as const,
        highlighted: true,
    },
    {
        name: "Business",
        price: "Custom",
        period: "",
        description: "For teams and enterprises",
        features: [
            "Everything in Starter, plus:",
            "Unlimited services & keywords",
            "Multi-user team access",
            "Custom domain & branding",
            "Advanced SEO tools",
            "Priority AI support",
            "Dedicated account manager",
            "Custom integrations",
        ],
        planType: "business" as const,
        highlighted: false,
        comingSoon: true,
    },
];

export default function PlansPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [starterCount, setStarterCount] = useState<number | null>(null);
    const [isCheckingCount, setIsCheckingCount] = useState(true);

    // Check starter plan count for badge display
    useEffect(() => {
        if (isLoaded) {
            getStarterPlanCount()
                .then((count) => {
                    setStarterCount(count);
                    setIsCheckingCount(false);
                })
                .catch((error) => {
                    console.error('Error fetching starter plan count:', error);
                    setIsCheckingCount(false);
                    // Don't show badge if count fetch fails
                    setStarterCount(null);
                });
        }
    }, [isLoaded]);

    // Note: Middleware handles redirecting users who have already selected a plan

    const handlePlanSelect = (planName: string, comingSoon?: boolean) => {
        if (!comingSoon) {
            setSelectedPlan(planName);
        }
    };

    const handleConfirmPlan = () => {
        if (!selectedPlan) return;

        const plan = plans.find((p) => p.name === selectedPlan);
        if (!plan || plan.comingSoon) return;

        // Type guard: only allow 'free' or 'starter' plans
        if (plan.planType !== 'free' && plan.planType !== 'starter') {
            toast.error("This plan is not yet available.");
            return;
        }

        startTransition(async () => {
            try {
                const result = await selectPlan(plan.planType);
                if (result.success) {
                    toast.success(`${plan.name} plan selected successfully!`);
                    router.push("/onboarding");
                } else {
                    toast.error(result.error || "Failed to select plan. Please try again.");
                }
            } catch (error) {
                toast.error("Failed to select plan. Please try again.");
                console.error(error);
            }
        });
    };

    const isStarterFreeAvailable = starterCount !== null && starterCount < 500;

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        Pick the plan that fits your business needs. Start free and upgrade as you grow.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {plans.map((plan) => (
                        <div key={plan.name} className="relative flex flex-col">
                            <Card
                                onClick={() => handlePlanSelect(plan.name, plan.comingSoon)}
                                className={`relative flex flex-col transition-all duration-300 cursor-pointer ${
                                    selectedPlan === plan.name
                                        ? "border-blue-600 border-2 shadow-lg shadow-blue-600/20 ring-2 ring-blue-600/20 dark:border-blue-500 dark:ring-blue-500/20"
                                        : plan.highlighted
                                        ? "border-blue-600/50 shadow-md hover:shadow-lg hover:border-blue-600 dark:border-blue-500/50 dark:hover:border-blue-500"
                                        : "hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
                                } ${plan.comingSoon ? "opacity-75 cursor-not-allowed" : ""}`}
                            >
                                {/* Selected Checkmark */}
                                {selectedPlan === plan.name && (
                                    <div className="absolute -top-3 -right-3 z-10">
                                        <div className="bg-blue-600 text-white rounded-full p-1.5 shadow-lg dark:bg-blue-500">
                                            <Check className="w-5 h-5" />
                                        </div>
                                    </div>
                                )}

                            <CardHeader className="text-center pb-8 pt-8">
                                {/* Badges inside card header */}
                                <div className="flex flex-col items-center gap-3 mb-4">
                                    {/* Recommended + Free Badge (combined for Starter plan) */}
                                    {plan.highlighted && !plan.comingSoon && plan.planType === "starter" && isStarterFreeAvailable && (
                                        <div className="flex items-center">
                                            <div className="flex items-center bg-blue-600 text-white px-4 py-1.5 gap-1.5 shadow-lg dark:bg-blue-500 rounded-l-lg">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                <span className="text-sm font-medium">Recommended</span>
                                            </div>
                                            <div className="bg-zinc-700 text-white px-3 py-1.5 text-xs shadow-lg rounded-r-lg dark:bg-zinc-800 whitespace-nowrap">
                                                Free for first 500 users
                                            </div>
                                        </div>
                                    )}

                                    {/* Recommended Badge (for Starter plan when free offer is not available) */}
                                    {plan.highlighted && !plan.comingSoon && plan.planType === "starter" && !isStarterFreeAvailable && (
                                        <Badge className="bg-blue-600 text-white px-4 py-1.5 gap-1.5 shadow-lg dark:bg-blue-500">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Recommended
                                        </Badge>
                                    )}

                                    {/* Recommended Badge (for non-Starter plans) */}
                                    {plan.highlighted && !plan.comingSoon && plan.planType !== "starter" && (
                                        <Badge className="bg-blue-600 text-white px-4 py-1.5 gap-1.5 shadow-lg dark:bg-blue-500">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Recommended
                                        </Badge>
                                    )}

                                    {/* Coming Soon Badge */}
                                    {plan.comingSoon && (
                                        <Badge variant="secondary" className="px-4 py-1.5 shadow-lg">
                                            Coming Soon
                                        </Badge>
                                    )}
                                </div>

                                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                                <CardDescription className="text-sm">{plan.description}</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-zinc-600 dark:text-zinc-400 text-base">
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0 dark:text-blue-500" />
                                            <span className="text-sm text-zinc-900 dark:text-zinc-100">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        </div>
                    ))}
                </div>

                {/* Continue Button */}
                <div className="flex flex-col items-center gap-4">
                    <Button
                        onClick={handleConfirmPlan}
                        disabled={!selectedPlan || isPending || isCheckingCount}
                        className="cursor-pointer min-w-[200px] bg-blue-600 hover:bg-blue-500 text-white"
                        size="lg"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Continue with Selected Plan"
                        )}
                    </Button>
                    {!selectedPlan && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Please select a plan to continue
                        </p>
                    )}
                </div>

                {/* Footer Note */}
                <div className="text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        You can upgrade or downgrade anytime from your dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
}

