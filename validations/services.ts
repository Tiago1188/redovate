import { z } from "zod";

export const ServiceSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Service name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.string().optional(),
});

export type Service = z.infer<typeof ServiceSchema>;
