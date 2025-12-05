import { z } from "zod";

export const businessTypeSchema = z.object({
  business_type: z.enum(["sole_trader", "company"], {
    required_error: "Please select a business type",
  }),
});

export const businessBasicsSchema = z.object({
  business_name: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must be less than 100 characters"),
  trading_name: z.string().optional(),
  abn: z
    .string()
    .regex(/^\d{11}$/, "ABN must be exactly 11 digits")
    .optional()
    .or(z.literal("")),
  category: z.string().min(1, "Please select a category"),
  year_founded: z
    .number()
    .min(1800, "Year must be after 1800")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional(),
  about: z
    .string()
    .min(50, "About section must be at least 50 characters")
    .max(2000, "About section must be less than 2000 characters"),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive").optional(),
  price_type: z.enum(["fixed", "hourly", "quote"]).optional(),
  is_featured: z.boolean().optional(),
});

export const servicesSchema = z.object({
  services: z
    .array(serviceSchema)
    .min(3, "Please add at least 3 services")
    .max(999, "Maximum 999 services allowed"),
});

export const locationSchema = z.object({
  name: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(4, "Postcode must be at least 4 characters"),
  country: z.string().default("Australia"),
  is_primary: z.boolean().default(false),
});

export const serviceAreaSchema = z.object({
  name: z.string().min(1, "Service area name is required"),
  suburb: z.string().optional(),
  postcode: z.string().optional(),
  radius_km: z.number().positive().optional(),
});

export const locationsSchema = z.object({
  locations: z.array(locationSchema).min(1, "Please add at least 1 location"),
  service_areas: z
    .array(serviceAreaSchema)
    .min(1, "Please add at least 1 service area"),
});

export const contactSchema = z.object({
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^[\d\s\-+()]+$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  mobile: z
    .string()
    .regex(/^[\d\s\-+()]+$/, "Invalid mobile number")
    .optional()
    .or(z.literal("")),
});

export const contactSchemaWithValidation = contactSchema.refine(
  (data) => data.email || data.phone || data.mobile,
  "At least one contact method (email, phone, or mobile) is required"
);

export const fullOnboardingSchema = businessTypeSchema
  .merge(businessBasicsSchema)
  .merge(servicesSchema)
  .merge(locationsSchema)
  .merge(contactSchema)
  .refine(
    (data) => data.email || data.phone || data.mobile,
    "At least one contact method (email, phone, or mobile) is required"
  );

export type BusinessTypeInput = z.infer<typeof businessTypeSchema>;
export type BusinessBasicsInput = z.infer<typeof businessBasicsSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type ServicesInput = z.infer<typeof servicesSchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type ServiceAreaInput = z.infer<typeof serviceAreaSchema>;
export type LocationsInput = z.infer<typeof locationsSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type FullOnboardingInput = z.infer<typeof fullOnboardingSchema>;

