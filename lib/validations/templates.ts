import { z } from "zod";

export const selectTemplateSchema = z.object({
  template_id: z.string().uuid("Invalid template ID"),
});

export const updateCustomizationsSchema = z.object({
  theme: z.object({
    primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    background_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    font_heading: z.string().optional(),
    font_body: z.string().optional(),
  }).optional(),
  sections: z.array(z.object({
    section_name: z.string(),
    variant: z.string().optional(),
    props: z.record(z.unknown()).optional(),
  })).optional(),
  hidden_sections: z.array(z.string()).optional(),
});

export const updateSectionOrderSchema = z.object({
  sections: z.array(z.object({
    section_name: z.string(),
    sort_order: z.number(),
  })),
});

export const updateSectionContentSchema = z.object({
  section_name: z.string(),
  field_name: z.string(),
  field_value: z.string(),
});

export type SelectTemplateInput = z.infer<typeof selectTemplateSchema>;
export type UpdateCustomizationsInput = z.infer<typeof updateCustomizationsSchema>;
export type UpdateSectionOrderInput = z.infer<typeof updateSectionOrderSchema>;
export type UpdateSectionContentInput = z.infer<typeof updateSectionContentSchema>;

