import { z } from "zod";

export const updateSeoSchema = z.object({
  meta_title: z.string().max(70, "Meta title should be under 70 characters").optional(),
  meta_description: z.string().max(160, "Meta description should be under 160 characters").optional(),
  keywords: z.array(z.string()).max(20, "Maximum 20 keywords allowed").optional(),
  og_title: z.string().max(70).optional(),
  og_description: z.string().max(200).optional(),
  og_image: z.string().url().optional(),
});

export const addKeywordSchema = z.object({
  keyword: z.string().min(2, "Keyword must be at least 2 characters").max(50),
});

export type UpdateSeoInput = z.infer<typeof updateSeoSchema>;
export type AddKeywordInput = z.infer<typeof addKeywordSchema>;

