'use server';

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

import sql from "@/lib/db";
import { getBusinessData, type BusinessImage } from "@/actions/business";
import { getBusinessActiveTemplate } from "@/actions/templates/getBusinessActiveTemplate";
import { getUserPlanType } from "@/actions/user";
import { getPlanLimits } from "@/lib/plan-limits";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { HeroFormSchema, type HeroFormData } from "@/validations/hero";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export type HeroTemplateConfig = {
  headline?: string;
  highlight?: string;
  tagline?: string;
  subtagline?: string;
  cta_primary?: string;
  cta_secondary?: string;
  show_phone_cta?: boolean | string;
  hero_image?: string;
};

export async function getHeroSection(): Promise<(HeroFormData & { hasBusinessPhone: boolean; templateConfig?: HeroTemplateConfig; imageCount: number }) | null> {
  const business = await getBusinessData();
  if (!business) {
    return null;
  }

  const activeTemplate = await getBusinessActiveTemplate(business.id);
  const templateConfig = activeTemplate?.supported_props?.HeroSection as HeroTemplateConfig | undefined;

  const heroContent = business.siteContent?.HeroSection || {};
  const baseContent = business.baseContent || {};

  const heroImageEntry = business.images.find((img) => img.role === "hero");
  // Prioritize: 1. Site Content (Template specific override) -> 2. Base Content (Unified) -> 3. Legacy/Fallback
  const heroImage = heroContent.hero_image || baseContent.heroImage || heroImageEntry?.url || business.heroImage || undefined;

  return {
    headline: heroContent.headline || business.businessName || "",
    highlight: heroContent.highlight || "",
    tagline: heroContent.tagline || baseContent.tagline || business.tagline || "",
    subtagline: heroContent.subtagline || "",
    ctaPrimary: heroContent.cta_primary || "Book Now",
    ctaSecondary: heroContent.cta_secondary || "",
    showPhoneCTA: heroContent.show_phone_cta ?? Boolean(business.phone),
    heroImage,
    heroImagePublicId: heroImageEntry?.publicId,
    hasBusinessPhone: Boolean(business.phone),
    templateConfig,
    imageCount: business.images.length,
  };
}

export async function uploadHeroImage(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    throw new Error("No file provided");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type. Please upload PNG, JPEG, or WebP images.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image is too large. Maximum size is 5MB.");
  }

  const business = await getBusinessData();
  if (!business) {
    throw new Error("Business not found");
  }

  const planType = (await getUserPlanType(userId)) || "free";
  const limits = getPlanLimits(planType);
  const heroImageEntry = business.images.find((img) => img.role === "hero");
  const canReplaceHero = Boolean(heroImageEntry);
  if (limits.maxImages < 999 && business.images.length >= limits.maxImages && !canReplaceHero) {
    throw new Error("You've reached your image limit for this plan. Delete an existing image or upgrade.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadResult = await uploadImageToCloudinary({
    fileBuffer: buffer,
    fileName: `hero-${business.slug || business.businessName || "business"}`,
    mimeType: file.type,
    folder: `redovate/businesses/${business.id}`,
  });

  return {
    success: true,
    image: {
      url: uploadResult.secureUrl,
      publicId: uploadResult.publicId,
    },
  };
}

export async function saveHeroSection(input: unknown) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const parsed = HeroFormSchema.parse(input);
  const business = await getBusinessData();
  if (!business) {
    throw new Error("Business not found");
  }

  const existingHero = business.siteContent?.HeroSection || {};
  const heroImageEntry = business.images.find((img) => img.role === "hero");

  const heroImageUrl = parsed.heroImage ?? existingHero.hero_image ?? heroImageEntry?.url ?? business.heroImage ?? null;
  const nextTagline = parsed.tagline ?? business.tagline ?? existingHero.tagline ?? null;

  const heroSectionPayload: Record<string, unknown> = {
    ...existingHero,
    headline: parsed.headline,
    highlight: parsed.highlight ?? existingHero.highlight ?? "",
    tagline: parsed.tagline ?? existingHero.tagline ?? business.tagline ?? "",
    subtagline: parsed.subtagline ?? existingHero.subtagline ?? "",
    hero_image: heroImageUrl ?? undefined,
    cta_primary: parsed.ctaPrimary ?? existingHero.cta_primary ?? "Book Now",
    cta_secondary: parsed.ctaSecondary ?? existingHero.cta_secondary ?? "",
    show_phone_cta: parsed.showPhoneCTA,
  };

  if (parsed.showPhoneCTA) {
    if (business.phone) {
      heroSectionPayload.phone = business.phone;
    }
  } else if ("phone" in heroSectionPayload) {
    delete heroSectionPayload.phone;
  }

  const nextSiteContent = {
    ...business.siteContent,
    HeroSection: heroSectionPayload,
  };

  let nextImages: BusinessImage[] = business.images;
  if (parsed.heroImage) {
    const heroImageRecord: BusinessImage = {
      id: heroImageEntry?.id || randomUUID(),
      url: parsed.heroImage,
      role: "hero",
      publicId: parsed.heroImagePublicId || heroImageEntry?.publicId,
    };

    if (heroImageEntry) {
      nextImages = business.images.map((img) => (img.role === "hero" ? heroImageRecord : img));
    } else {
      nextImages = [...business.images, heroImageRecord];
    }
  }

  const persistedHeroImage = heroImageUrl ?? null;

  // Sync with base_content
  const currentBaseContent = business.baseContent || {};
  const nextBaseContent = {
    ...currentBaseContent,
    tagline: nextTagline || currentBaseContent.tagline,
    heroImage: persistedHeroImage || currentBaseContent.heroImage,
  };

  await sql`
    UPDATE businesses
    SET hero_image = ${persistedHeroImage},
        tagline = ${nextTagline},
        site_content = ${JSON.stringify(nextSiteContent)},
        base_content = ${JSON.stringify(nextBaseContent)},
        images = ${JSON.stringify(nextImages)},
        updated_at = now()
    WHERE id = ${business.id}
  `;

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/hero");
  if (business.slug) {
    revalidatePath(`/preview/${business.slug}`);
    revalidatePath(`/site/${business.slug}`);
  }

  return { success: true };
}
