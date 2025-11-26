"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

import { HeroFormSchema, type HeroFormData, type HeroFormInput } from "@/validations/hero";
import { HeroForm } from "./hero-form";
import { HeroPreview } from "./hero-preview";
import { saveHeroSection, uploadHeroImage, type HeroTemplateConfig } from "@/actions/hero";
import { Button } from "@/components/ui/button";
import { generateHeroContent } from "@/actions/ai/hero";
import { useAIUsageStore } from "@/stores/use-ai-usage-store";

interface HeroClientProps {
  initialData: (HeroFormData & { hasBusinessPhone: boolean; templateConfig?: HeroTemplateConfig; imageCount: number }) | null;
  maxImages: number;
}

const defaultValues: HeroFormInput = {
  headline: "",
  highlight: "",
  tagline: "",
  subtagline: "",
  ctaPrimary: "Book Now",
  ctaSecondary: "",
  showPhoneCTA: false,
  heroImage: undefined,
  heroImagePublicId: undefined,
};

export function HeroClient({ initialData, maxImages }: HeroClientProps) {
  const router = useRouter();
  const [isSaving, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const incrementUsage = useAIUsageStore((state) => state.incrementUsage);

  const { hasBusinessPhone = false, templateConfig, imageCount = 0, ...initialFormValues } = initialData ?? {
    hasBusinessPhone: false,
    imageCount: 0,
  };

  const form = useForm<HeroFormInput>({
    resolver: zodResolver(HeroFormSchema),
    defaultValues: {
      ...defaultValues,
      ...(initialFormValues as HeroFormInput),
    },
  });

  const watchValues = form.watch();

  const handleSubmit = (values: HeroFormInput) => {
    startTransition(async () => {
      try {
        await saveHeroSection(values);
        toast.success("Hero section saved");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(error instanceof Error ? error.message : "Failed to save hero section");
      }
    });
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadHeroImage(formData);
      if (result?.image?.url) {
        form.setValue("heroImage", result.image.url, { shouldDirty: true });
        form.setValue("heroImagePublicId", result.image.publicId, { shouldDirty: true });
        toast.success("Hero image uploaded");
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to upload hero image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    form.setValue("heroImage", undefined, { shouldDirty: true });
    form.setValue("heroImagePublicId", undefined, { shouldDirty: true });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateHeroContent();
      if (!result?.success || !result.data) {
        throw new Error(result?.error || "Failed to generate content");
      }

      const fields: (keyof HeroFormInput)[] = ["headline", "highlight", "tagline", "subtagline", "ctaPrimary", "ctaSecondary"];
      fields.forEach((field) => {
        const value = result.data?.[field];
        if (value) {
          form.setValue(field, value, { shouldDirty: true });
        }
      });

      incrementUsage();
      toast.success("Hero content generated");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to generate hero content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 md:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hero Section</h1>
          <p className="text-muted-foreground">Update the headline, supporting copy, and imagery your visitors see first.</p>
        </div>
        <Button
          variant="outline"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <HeroForm
          form={form}
          onSubmit={handleSubmit}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          isSaving={isSaving}
          isUploading={isUploading}
          hasBusinessPhone={hasBusinessPhone}
          maxImages={maxImages}
          templateConfig={templateConfig}
          imageCount={imageCount}
        />

        <HeroPreview data={watchValues} />
      </div>
    </div>
  );
}

