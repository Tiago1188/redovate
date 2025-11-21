import { z } from "zod";

export const onboardingSchema = z.object({
    accountType: z.enum(["sole_trader", "company"]),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
