import { z } from "zod";

// Form input schema (for react-hook-form - before transformation)
export const onboardingFormSchema = z.object({
    // Step 1: Account Type
    accountType: z.enum(["sole_trader", "company"]),
    
    // Step 2: Business Basics
    businessName: z.string().min(1, "Business name is required").max(255, "Business name is too long"),
    about: z.string().min(10, "Please provide at least 10 characters describing your business").max(2000, "Description is too long"),
    category: z.string().min(1, "Business category is required").max(100, "Category name is too long"),
    yearFounded: z.string()
        .optional()
        .refine(
            (val) => !val || val.trim() === "" || /^\d{4}$/.test(val.trim()),
            "Year must be a 4-digit number"
        )
        .refine(
            (val) => !val || val.trim() === "" || (parseInt(val.trim(), 10) >= 1800 && parseInt(val.trim(), 10) <= new Date().getFullYear()),
            `Year must be between 1800 and ${new Date().getFullYear()}`
        )
        .nullable(),
    
    // Step 3: Services
    services: z.array(z.string().min(1).max(100)).min(1, "At least one service is required").max(50, "Too many services"),
    
    // Step 4: Location & Coverage
    mainLocation: z.string().min(1, "Main location is required").max(255, "Location name is too long"),
    serviceAreas: z.array(z.string().min(1).max(255)).max(100, "Too many service areas"),
    
    // Color Style (defaults to "default" - not user-selectable in onboarding)
    colorStyle: z.enum(["default", "blue", "green", "violet"]),
});

// Server schema (with transformation)
export const onboardingSchema = onboardingFormSchema.extend({
    yearFounded: z.string()
        .optional()
        .refine(
            (val) => !val || val.trim() === "" || /^\d{4}$/.test(val.trim()),
            "Year must be a 4-digit number"
        )
        .transform((val) => {
            if (!val || val.trim() === "") return null;
            return parseInt(val.trim(), 10);
        })
        .refine(
            (val) => val === null || (val >= 1800 && val <= new Date().getFullYear()),
            `Year must be between 1800 and ${new Date().getFullYear()}`
        )
        .nullable(),
});

export type OnboardingFormInput = z.infer<typeof onboardingFormSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
