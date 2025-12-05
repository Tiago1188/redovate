import { z } from "zod";

export const uploadImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  alt: z.string().max(200).optional(),
  type: z.enum(["gallery", "hero", "logo", "favicon"]),
});

export const updateImageSchema = z.object({
  alt: z.string().max(200).optional(),
  type: z.enum(["gallery", "hero", "logo", "favicon"]).optional(),
});

export const reorderImagesSchema = z.object({
  image_ids: z.array(z.string()),
});

export type UploadImageInput = z.infer<typeof uploadImageSchema>;
export type UpdateImageInput = z.infer<typeof updateImageSchema>;
export type ReorderImagesInput = z.infer<typeof reorderImagesSchema>;

