import { z } from "zod";
import { CustomDomainSchema, SubdomainSchema, normalizeDomain, normalizeSubdomain } from "@/lib/validators/domain";

export const SubdomainFormSchema = z.object({
    subdomain: z
        .string()
        .transform((value) => normalizeSubdomain(value))
        .pipe(SubdomainSchema),
});

export const CustomDomainFormSchema = z.object({
    domain: z
        .string()
        .transform((value) => {
            const normalized = normalizeDomain(value);
            return normalized.length === 0 ? "" : normalized;
        })
        .pipe(z.union([CustomDomainSchema, z.literal("")])),
});

export type SubdomainFormValues = z.infer<typeof SubdomainFormSchema>;
export type CustomDomainFormValues = z.infer<typeof CustomDomainFormSchema>;
