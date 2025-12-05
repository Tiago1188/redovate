import type { PlanType } from "./business";

export type LayoutType = "business" | "portfolio" | "ecommerce";
export type TemplateStatus = "active" | "draft" | "archived";
export type TargetAudience = "sole_trader" | "company" | "any";

export interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  theme_default: TemplateTheme;
  layout_type: LayoutType;
  supported_props: Record<string, unknown>;
  plan_level: PlanType;
  target_audience: TargetAudience;
  components: TemplateComponent[];
  status: TemplateStatus;
  fake_content: Record<string, unknown>;
  html_template?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TemplateTheme {
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  text_color?: string;
  font_heading?: string;
  font_body?: string;
}

export interface TemplateComponent {
  id?: string;
  name: string;
  type: SectionType;
  props?: Record<string, unknown>;
  order: number;
}

export type SectionType =
  | "header"
  | "hero"
  | "services"
  | "about"
  | "gallery"
  | "testimonials"
  | "contact"
  | "cta"
  | "footer";

export interface BusinessTemplate {
  id: string;
  business_id: string;
  template_id: string;
  is_active: boolean;
  customizations: TemplateCustomizations;
  created_at: Date;
  updated_at: Date;
}

export interface TemplateCustomizations {
  theme?: Partial<TemplateTheme>;
  sections?: SectionCustomization[];
  hidden_sections?: string[];
}

export interface SectionCustomization {
  section_name: string;
  variant?: string;
  props?: Record<string, unknown>;
}

