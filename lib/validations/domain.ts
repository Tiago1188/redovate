import { z } from "zod";

export const updateDomainSchema = z.object({
  domain: z
    .string()
    .regex(
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      "Invalid domain format"
    )
    .optional()
    .or(z.literal("")),
});

export const verifyDomainSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
  verification_method: z.enum(["dns", "file"]),
});

export type UpdateDomainInput = z.infer<typeof updateDomainSchema>;
export type VerifyDomainInput = z.infer<typeof verifyDomainSchema>;

