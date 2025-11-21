'use client';

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle, User, Building2, Loader2, ArrowLeft, ArrowRight, Sparkles, X, Pencil } from "lucide-react";
import { completeOnboarding } from "@/actions/onboarding";
import { onboardingFormSchema, type OnboardingFormInput } from "@/validations/onboarding";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

const businessCategories = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Roofing",
    "HVAC",
    "Landscaping",
    "Painting",
    "Flooring",
    "Concrete",
    "General Contractor",
    "Other",
];

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { user, isLoaded } = useUser();

    // Local state for temporary inputs (not part of final form)
    const [currentService, setCurrentService] = useState("");
    const [currentServiceArea, setCurrentServiceArea] = useState("");
    const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
    const [editingServiceAreaIndex, setEditingServiceAreaIndex] = useState<number | null>(null);
    const [editingServiceValue, setEditingServiceValue] = useState("");
    const [editingServiceAreaValue, setEditingServiceAreaValue] = useState("");

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        trigger,
        formState: { errors, isValid },
    } = useForm<OnboardingFormInput>({
        resolver: zodResolver(onboardingFormSchema) as any,
        mode: "onChange",
        defaultValues: {
            accountType: undefined as any,
            businessName: "",
            about: "",
            category: "",
            yearFounded: null,
            services: [],
            mainLocation: "",
            serviceAreas: [],
            colorStyle: "default",
        },
    });

    const formValues = watch();

    // Redirect to dashboard if user already has a businessId
    useEffect(() => {
        if (isLoaded && user?.publicMetadata?.businessId) {
            router.push("/dashboard");
        }
    }, [isLoaded, user, router]);

    const addService = () => {
        if (currentService.trim()) {
            const currentServices = formValues.services || [];
            setValue("services", [...currentServices, currentService.trim()], { shouldValidate: true });
            setCurrentService("");
        }
    };

    const removeService = (index: number) => {
        const currentServices = formValues.services || [];
        setValue("services", currentServices.filter((_, i) => i !== index), { shouldValidate: true });
        setEditingServiceIndex(null);
    };

    const startEditingService = (index: number) => {
        const currentServices = formValues.services || [];
        setEditingServiceIndex(index);
        setEditingServiceValue(currentServices[index] || "");
    };

    const saveEditingService = () => {
        if (editingServiceIndex !== null && editingServiceValue.trim()) {
            const currentServices = formValues.services || [];
            const updated = [...currentServices];
            updated[editingServiceIndex] = editingServiceValue.trim();
            setValue("services", updated, { shouldValidate: true });
            setEditingServiceIndex(null);
            setEditingServiceValue("");
        }
    };

    const cancelEditingService = () => {
        setEditingServiceIndex(null);
        setEditingServiceValue("");
    };

    const addServiceArea = () => {
        if (currentServiceArea.trim()) {
            const currentAreas = formValues.serviceAreas || [];
            setValue("serviceAreas", [...currentAreas, currentServiceArea.trim()], { shouldValidate: true });
            setCurrentServiceArea("");
        }
    };

    const removeServiceArea = (index: number) => {
        const currentAreas = formValues.serviceAreas || [];
        setValue("serviceAreas", currentAreas.filter((_, i) => i !== index), { shouldValidate: true });
        setEditingServiceAreaIndex(null);
    };

    const startEditingServiceArea = (index: number) => {
        const currentAreas = formValues.serviceAreas || [];
        setEditingServiceAreaIndex(index);
        setEditingServiceAreaValue(currentAreas[index] || "");
    };

    const saveEditingServiceArea = () => {
        if (editingServiceAreaIndex !== null && editingServiceAreaValue.trim()) {
            const currentAreas = formValues.serviceAreas || [];
            const updated = [...currentAreas];
            updated[editingServiceAreaIndex] = editingServiceAreaValue.trim();
            setValue("serviceAreas", updated, { shouldValidate: true });
            setEditingServiceAreaIndex(null);
            setEditingServiceAreaValue("");
        }
    };

    const cancelEditingServiceArea = () => {
        setEditingServiceAreaIndex(null);
        setEditingServiceAreaValue("");
    };

    const validateStep = async (step: number): Promise<boolean> => {
        switch (step) {
            case 1:
                await trigger("accountType");
                return !!formValues.accountType;
            case 2:
                await trigger(["businessName", "about", "category"]);
                return !!(
                    formValues.businessName?.trim() &&
                    formValues.about?.trim().length >= 10 &&
                    formValues.category
                );
            case 3:
                await trigger("services");
                return (formValues.services?.length || 0) > 0;
            case 4:
                await trigger("mainLocation");
                return !!formValues.mainLocation?.trim();
            default:
                return false;
        }
    };

    const handleNext = async () => {
        const isValid = await validateStep(currentStep);
        if (isValid) {
            if (currentStep < TOTAL_STEPS) {
                setCurrentStep(prev => prev + 1);
            }
        } else {
            // Show specific error messages
            if (currentStep === 1 && !formValues.accountType) {
                toast.error("Please select an account type");
            } else if (currentStep === 2) {
                if (!formValues.businessName?.trim()) {
                    toast.error("Business name is required");
                } else if (!formValues.about?.trim() || formValues.about.trim().length < 10) {
                    toast.error("Please provide at least 10 characters describing your business");
                } else if (!formValues.category) {
                    toast.error("Please select a business category");
                }
            } else if (currentStep === 3 && (formValues.services?.length || 0) === 0) {
                toast.error("Please add at least one service");
            } else if (currentStep === 4 && !formValues.mainLocation?.trim()) {
                toast.error("Main location is required");
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const onSubmit = async (data: OnboardingFormInput) => {
        startTransition(async () => {
            try {
                const formDataToSubmit = new FormData();
                formDataToSubmit.append("account-type", data.accountType);
                formDataToSubmit.append("business-name", data.businessName);
                formDataToSubmit.append("about", data.about);
                formDataToSubmit.append("category", data.category);
                if (data.yearFounded) {
                    formDataToSubmit.append("year-founded", data.yearFounded);
                }
                data.services.forEach(service => {
                    formDataToSubmit.append("services[]", service);
                });
                formDataToSubmit.append("main-location", data.mainLocation);
                data.serviceAreas.forEach(area => {
                    formDataToSubmit.append("service-areas[]", area);
                });
                formDataToSubmit.append("color-style", data.colorStyle || "default");

                const result = await completeOnboarding(formDataToSubmit);
                if (result.success) {
                    toast.success("Onboarding completed successfully!");
                    router.push("/generating");
                } else {
                    // Handle validation errors
                    if (result.errors && result.errors.length > 0) {
                                                const errorMessages = result.errors.map((err: { message: string }) => err.message).join(", ");
                        toast.error(errorMessages);
                    } else {
                        toast.error(result.error || "Failed to complete onboarding. Please try again.");
                    }
                }
            } catch (error) {
                toast.error("Failed to complete onboarding. Please try again.");
                console.error(error);
            }
        });
    };

    const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Let's Set Up Your AI Assistant
                    </h2>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        We'll use this information to generate personalized content for your business.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            Step {currentStep} of {TOTAL_STEPS}
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400">
                            {Math.round(progressPercentage)}% complete
                        </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-200 dark:border-zinc-800" />

                {/* Form Content */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-8 py-6">
                        {/* Step 1: Account Type */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Account Type
                                    </h3>
                                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        Choose the account type that best fits your business.
                                    </p>
                                </div>
                                <Controller
                                    name="accountType"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {accountTypes.map((type) => (
                                                <label
                                                    key={type.id}
                                                    className={`group relative flex cursor-pointer rounded-lg border p-4 transition-all ${
                                                        field.value === type.id
                                                            ? "border-blue-600 ring-1 ring-blue-600 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-500 dark:ring-blue-500"
                                                            : errors.accountType
                                                            ? "border-red-500 ring-1 ring-red-500 dark:border-red-500 dark:ring-red-500"
                                                            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="account-type"
                                                        value={type.id}
                                                        checked={field.value === type.id}
                                                        onChange={(e) => field.onChange(e.target.value as "sole_trader" | "company")}
                                                        className="sr-only"
                                                    />
                                                    <span className="flex flex-1">
                                                        <span className="flex flex-col">
                                                            <span className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
                                                                <type.icon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                                                                {type.title}
                                                            </span>
                                                            <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                                                {type.description}
                                                            </span>
                                                        </span>
                                                    </span>
                                                    {field.value === type.id && (
                                                        <CheckCircle className="ml-4 h-5 w-5 text-blue-600 dark:text-blue-500" />
                                                    )}
                                                </label>
                                            ))}
                                            {errors.accountType && (
                                                <p className="text-sm text-red-500 col-span-full">{errors.accountType.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                        )}

                        {/* Step 2: Business Basics */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Business Basics
                                    </h3>
                                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        Tell us about your business so we can create the perfect content.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="business-name" className="text-sm font-medium">
                                            Business Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="business-name"
                                            placeholder="e.g., Smith Plumbing Services"
                                            {...register("businessName")}
                                            aria-invalid={errors.businessName ? "true" : "false"}
                                            className="mt-1"
                                        />
                                        {errors.businessName && (
                                            <p className="mt-1 text-xs text-red-500">{errors.businessName.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="about" className="text-sm font-medium">
                                            What does your business do? <span className="text-red-500">*</span>
                                        </Label>
                                        <textarea
                                            id="about"
                                            rows={3}
                                            placeholder="e.g., We provide residential and commercial plumbing services across Sydney."
                                            {...register("about")}
                                            aria-invalid={errors.about ? "true" : "false"}
                                            className={`mt-1 flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-zinc-500 ${
                                                errors.about
                                                    ? "border-red-500 focus-visible:ring-red-500 dark:border-red-500 dark:focus-visible:ring-red-500"
                                                    : "border-zinc-200 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:focus-visible:ring-zinc-300"
                                            }`}
                                        />
                                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                            {errors.about ? (
                                                <span className="text-red-500">{errors.about.message}</span>
                                            ) : formValues.about && formValues.about.trim().length > 0 && formValues.about.trim().length < 10 ? (
                                                <span className="text-red-500">
                                                    {10 - formValues.about.trim().length} more characters needed (minimum 10)
                                                </span>
                                            ) : (
                                                "Keep it brief - just 1-2 sentences. Minimum 10 characters required."
                                            )}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="category" className="text-sm font-medium">
                                                Business Category <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="category"
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        <Select
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <SelectTrigger 
                                                                id="category" 
                                                                aria-invalid={errors.category ? "true" : "false"}
                                                                className="mt-1 w-full"
                                                            >
                                                                <SelectValue placeholder="Select your business category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {businessCategories.map((cat) => (
                                                                    <SelectItem key={cat} value={cat}>
                                                                        {cat}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.category && (
                                                            <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                                                        )}
                                                    </>
                                                )}
                                            />
                                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                                Choose the category that best fits your business.
                                            </p>
                                        </div>
                                        <div>
                                            <Label htmlFor="year-founded" className="text-sm font-medium">
                                                Year Founded
                                            </Label>
                                            <Controller
                                                name="yearFounded"
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        <Input
                                                            id="year-founded"
                                                            type="text"
                                                            placeholder="e.g., 2015"
                                                            value={field.value || ""}
                                                            onChange={(e) => field.onChange(e.target.value || null)}
                                                            aria-invalid={errors.yearFounded ? "true" : "false"}
                                                            className="mt-1"
                                                        />
                                                        {errors.yearFounded && (
                                                            <p className="mt-1 text-xs text-red-500">{errors.yearFounded.message}</p>
                                                        )}
                                                    </>
                                                )}
                                            />
                                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                                When was your business established?
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Services */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Your Services
                                    </h3>
                                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        What services do you offer? We'll help describe them beautifully.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="e.g., Plumbing, Electrical, Carpentry"
                                            value={currentService}
                                            onChange={(e) => setCurrentService(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addService();
                                                }
                                            }}
                                            className="flex-1"
                                        />
                                        <Button type="button" onClick={addService} variant="outline">
                                            Add
                                        </Button>
                                    </div>
                                    {errors.services && (
                                        <p className="text-sm text-red-500">{errors.services.message}</p>
                                    )}
                                    {(formValues.services?.length || 0) > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formValues.services?.map((service, index) => (
                                                editingServiceIndex === index ? (
                                                    <div key={index} className="flex items-center gap-1">
                                                        <Input
                                                            value={editingServiceValue}
                                                            onChange={(e) => setEditingServiceValue(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    saveEditingService();
                                                                } else if (e.key === "Escape") {
                                                                    cancelEditingService();
                                                                }
                                                            }}
                                                            className="h-8 w-32 text-sm"
                                                            autoFocus
                                                        />
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            onClick={saveEditingService}
                                                            className="h-8 px-2"
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={cancelEditingService}
                                                            className="h-8 px-2"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
                                                    >
                                                        <span>{service}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => startEditingService(index)}
                                                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                            aria-label="Edit service"
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeService(index)}
                                                            className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                            aria-label="Remove service"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                )
                                            ))}
                                        </div>
                                    )}
                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                                        <div className="flex items-start gap-2">
                                            <Sparkles className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <div>
                                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                    AI will handle the details
                                                </p>
                                                <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                                                    Our AI will automatically generate professional descriptions for each of your services. You can review and customize them later in your dashboard.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Location & Coverage */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        Location & Coverage
                                    </h3>
                                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        Where do you operate? This helps with local SEO.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="main-location" className="text-sm font-medium">
                                            Main Location <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="main-location"
                                            placeholder="e.g., Sydney CBD, Melbourne, Brisbane"
                                            {...register("mainLocation")}
                                            aria-invalid={errors.mainLocation ? "true" : "false"}
                                            className="mt-1"
                                        />
                                        {errors.mainLocation && (
                                            <p className="mt-1 text-xs text-red-500">{errors.mainLocation.message}</p>
                                        )}
                                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                            Your primary city or suburb.
                                        </p>
                                    </div>
                                    <div>
                                        <Label htmlFor="service-areas" className="text-sm font-medium">
                                            Service Areas
                                        </Label>
                                        <div className="mt-1 flex gap-2">
                                            <Input
                                                id="service-areas"
                                                placeholder="Add suburbs you service"
                                                value={currentServiceArea}
                                                onChange={(e) => setCurrentServiceArea(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addServiceArea();
                                                    }
                                                }}
                                                className="flex-1"
                                            />
                                            <Button type="button" onClick={addServiceArea} variant="outline">
                                                Add
                                            </Button>
                                        </div>
                                        {errors.serviceAreas && (
                                            <p className="mt-1 text-xs text-red-500">{errors.serviceAreas.message}</p>
                                        )}
                                        {(formValues.serviceAreas?.length || 0) > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {formValues.serviceAreas?.map((area, index) => (
                                                    editingServiceAreaIndex === index ? (
                                                        <div key={index} className="flex items-center gap-1">
                                                            <Input
                                                                value={editingServiceAreaValue}
                                                                onChange={(e) => setEditingServiceAreaValue(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        e.preventDefault();
                                                                        saveEditingServiceArea();
                                                                    } else if (e.key === "Escape") {
                                                                        cancelEditingServiceArea();
                                                                    }
                                                                }}
                                                                className="h-8 w-32 text-sm"
                                                                autoFocus
                                                            />
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                onClick={saveEditingServiceArea}
                                                                className="h-8 px-2"
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={cancelEditingServiceArea}
                                                                className="h-8 px-2"
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
                                                        >
                                                            <span>{area}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => startEditingServiceArea(index)}
                                                                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                                aria-label="Edit service area"
                                                            >
                                                                <Pencil className="h-3 w-3" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeServiceArea(index)}
                                                                className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                                aria-label="Remove service area"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                            Add multiple areas to improve local search visibility.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1 || isPending}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                        {currentStep < TOTAL_STEPS ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                disabled={isPending}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white"
                            >
                                Next
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        Generate My Website
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </form>

                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                    Don't worry - you can always edit this information later.
                </p>
            </div>
        </div>
    );
}
