import { z } from "zod";

export const updateContactSchema = z.object({
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^[\d\s\-+()]*$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  mobile: z
    .string()
    .regex(/^[\d\s\-+()]*$/, "Invalid mobile number")
    .optional()
    .or(z.literal("")),
});

export const contactFormSubmissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  business_id: z.string().uuid(),
});

export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ContactFormSubmissionInput = z.infer<typeof contactFormSubmissionSchema>;

