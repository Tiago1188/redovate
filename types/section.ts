export type SectionStatus = "missing" | "pending" | "completed";

export interface TemplateSection {
  id: string;
  template_id: string;
  name: string;
  label?: string;
  description?: string;
  required: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface BusinessSectionStatus {
  id: string;
  business_id: string;
  section_id: string;
  status: SectionStatus;
  completion_percent: number;
  last_updated: Date;
  created_at: Date;
}

export interface TemplateSectionField {
  id: string;
  template_id: string;
  section_name: string;
  field_name: string;
  field_label?: string;
  field_type: FieldType;
  required: boolean;
  helper_text?: string;
  min_length?: number;
  max_length?: number;
  created_at: Date;
  updated_at: Date;
}

export type FieldType = "string" | "array" | "image" | "richtext" | "number";

export interface BusinessSelectedSection {
  id: string;
  business_id: string;
  template_id: string;
  section_name: string;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface BusinessSectionContent {
  id: string;
  business_id: string;
  section_name: string;
  field_name: string;
  field_value?: string;
  created_at: Date;
  updated_at: Date;
}

