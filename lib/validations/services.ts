import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  description: z.string().max(500).optional(),
  price: z.number().positive("Price must be positive").optional(),
  price_type: z.enum(["fixed", "hourly", "quote"]).optional(),
  is_featured: z.boolean().default(false),
});

export const updateServiceSchema = createServiceSchema.partial();

export const reorderServicesSchema = z.object({
  service_ids: z.array(z.string().uuid()),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ReorderServicesInput = z.infer<typeof reorderServicesSchema>;

