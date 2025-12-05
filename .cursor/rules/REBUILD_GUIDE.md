# REBUILD_GUIDE.md

## Folder Structure
/app
  /(auth)
    /sign-in
      page.tsx
    /sign-up
      page.tsx
  /onboarding
    /business-type
      page.tsx
      BusinessTypeStep.tsx
    /business-basics
      page.tsx
      BusinessBasicsStep.tsx
    /services
      page.tsx
      ServicesStep.tsx
    /locations
      page.tsx
      LocationsStep.tsx
    /review
      page.tsx
      ReviewStep.tsx
  /dashboard
    page.tsx
    /sections
      /basic-info
        page.tsx
      /services
        page.tsx
      /service-areas
        page.tsx
      /contact
        page.tsx
      /images
        page.tsx
      /domain
        page.tsx
      /seo
        page.tsx
      /template
        page.tsx
      /[dynamic-template-section]
        page.tsx
  /templates
    /select
      page.tsx
    /change
      page.tsx
    /preview
      /[templateSlug]
        page.tsx
    /edit
      /[templateSlug]
        page.tsx

/components
  /ui
  /dialogs
  /forms
  /templates
    /render
      TemplateRenderer.tsx
      SectionResolver.tsx
    /sections
      /hero
        Hero1.tsx
        Hero2.tsx
        Hero3.tsx
        Hero4.tsx
        Hero5.tsx
      /services
        Services1.tsx
        Services2.tsx
        Services3.tsx
      /about
        About1.tsx
        About2.tsx
      /gallery
        Gallery1.tsx
        Gallery2.tsx
      /testimonials
        Testimonials1.tsx
        Testimonials2.tsx
      /contact
        Contact1.tsx
        Contact2.tsx
      /cta
        Cta1.tsx
        Cta2.tsx
      /footer
        Footer1.tsx
        Footer2.tsx
      /header
        Header1.tsx
        Header2.tsx
    /editor
      LivePreview.tsx
      ColorsPanel.tsx
      FontsPanel.tsx
      SpacingPanel.tsx
      SectionsPanel.tsx
    /select
      TemplateCard.tsx
      TemplateGrid.tsx
    /preview
      TemplatePreviewFrame.tsx

/actions
  businesses.ts
  services.ts
  service-areas.ts
  contact.ts
  images.ts
  seo.ts
  domain.ts
  templates.ts
  ai.ts

/lib
  db.ts
  clerk.ts
  plan-limits.ts
  validations/
    onboarding.ts
    business.ts
    services.ts
    contact.ts
    images.ts
    seo.ts
    domain.ts
    templates.ts
  ai/
    generateSectionContent.ts
  utils/
    slugify.ts
    image-resolver.ts

/stores
  ai-usage.ts
  template-store.ts
  editor-store.ts
  theme-store.ts

/constants
  plan-limits.ts
  universal-fields.ts
  template-metadata.ts

/types
  business.ts
  template.ts
  section.ts
  plan.ts
  user.ts

/styles
  globals.css
  template.css

Required Tools & Libraries

Frontend
Next.js 16+ (App Router)
React Hook Form
Tailwind CSS
Shadcn UI Components
Lucide React Icons
next-themes (for theme switching)

Backend / Logic
Clerk Authentication (Next.js)
Neon Serverless SQL database
Zod (validation)
Zustand (state store)
OpenAI API (AI content generation)
Cloudinary (image uploads)

Forms Rules

Always use React Hook Form

Always validate using Zod

Store all Zod schemas in:
/lib/validations

Server Actions Rules

All server actions must be inside /actions

Must be written using raw Neon SQL

No ORM (Prisma, Drizzle)

Must start with "use server"

Must run Zod validation before inserting/updating DB

Examples:
/actions/services.ts
/actions/businesses.ts
/actions/templates.ts

AI Usage Tracking

Track usage using Zustand store

Save usage in DB: business.ai_generations_count

Increment every time user generates content

UI should show remaining AI quota based on plan

Authentication Rules

Use Clerk for:

Sign-in

Sign-up

Protecting routes: /dashboard/*, /editor/*, /preview/*

No user should access dashboard without a Clerk session

Database Access Rules

Use Neon SQL client in /lib/db.ts

No Prisma, no Drizzle

All SQL must be parameterized

All input must go through Zod before any DB write

Reusable Components

Reusable components must live inside:

/components/ui

/components/dialogs

/components/forms

Examples:

Confirmation dialogs

Delete dialogs

Form inputs

Status/loading buttons

Card components

Universal Required Fields (Every Business Must Provide)
Field	Required?	Notes
business_name	✔	Shown in hero, footer, SEO
abn	✔	Required for AU businesses
category	✔	e.g., plumber, cleaner, builder
primary_service	✔	Used by templates + SEO
about	✔	Base content for AI expansion
phone_or_email	✔	At least one must be provided
services	✔	At least 3
service_areas	✔	Minimum 1
logo/profile_image	✔	Used in search results + dashboard
Plan Limits System
export type PlanType = 'free' | 'starter' | 'business';

export interface PlanLimits {
  maxServices: number;
  maxServiceAreas: number;
  maxKeywords: number;
  maxImages: number;
  maxLocations: number;
  customDomain: boolean;
  removeBranding: boolean;
  customThemes: boolean;
  analyticsIntegration: boolean;
  socialMediaIntegration: boolean;
  maxAiGenerations: number;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxServices: 5,
    maxServiceAreas: 1,
    maxKeywords: 5,
    maxImages: 1,
    maxLocations: 1,
    customDomain: false,
    removeBranding: false,
    customThemes: false,
    analyticsIntegration: false,
    socialMediaIntegration: false,
    maxAiGenerations: 10,
  },
  starter: {
    maxServices: 15,
    maxServiceAreas: 5,
    maxKeywords: 15,
    maxImages: 15,
    maxLocations: 1,
    customDomain: true,
    removeBranding: true,
    customThemes: true,
    analyticsIntegration: true,
    socialMediaIntegration: true,
    maxAiGenerations: 75,
  },
  business: {
    maxServices: 999,
    maxServiceAreas: 999,
    maxKeywords: 999,
    maxImages: 999,
    maxLocations: 999,
    customDomain: true,
    removeBranding: true,
    customThemes: true,
    analyticsIntegration: true,
    socialMediaIntegration: true,
    maxAiGenerations: 999,
  },
};