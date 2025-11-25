"use client";

import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { HeroTemplateConfig } from "@/actions/hero";
import { HeroFormInput } from "@/validations/hero";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { HeroImageUploader } from "./hero-image-uploader";

interface HeroFormProps {
  form: UseFormReturn<HeroFormInput>;
  onSubmit: (values: HeroFormInput) => void;
  onImageUpload: (file: File) => Promise<void>;
  onRemoveImage: () => void;
  isSaving: boolean;
  isUploading: boolean;
  hasBusinessPhone: boolean;
  maxImages: number;
  templateConfig?: HeroTemplateConfig;
  imageCount: number;
}

export function HeroForm({
  form,
  onSubmit,
  onImageUpload,
  onRemoveImage,
  isSaving,
  isUploading,
  hasBusinessPhone,
  maxImages,
  templateConfig,
  imageCount,
}: HeroFormProps) {
  // Helper to check if a field should be shown
  // If templateConfig is missing, we show everything (fallback)
  // If templateConfig is present, we only show fields that are defined in it
  const showField = (key: keyof HeroTemplateConfig) => {
    if (!templateConfig) return true;
    return key in templateConfig;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Content</CardTitle>
        <CardDescription>Craft a compelling first impression for visitors.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {showField("hero_image") && (
              <HeroImageUploader
                imageUrl={form.watch("heroImage")}
                onUpload={onImageUpload}
                onRemove={onRemoveImage}
                isUploading={isUploading}
                maxImages={maxImages}
                imageCount={imageCount}
              />
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {showField("headline") && (
                <FormField
                  control={form.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Trusted Electricians in Melbourne" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {showField("highlight") && (
                <FormField
                  control={form.control}
                  name="highlight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highlight</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 24/7 Emergency Service" {...field} />
                      </FormControl>
                      <FormDescription>This text is emphasized to draw attention.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {showField("tagline") && (
              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline</FormLabel>
                    <FormControl>
                      <Textarea rows={2} placeholder="Short reinforcement of your value." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showField("subtagline") && (
              <FormField
                control={form.control}
                name="subtagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supporting Copy</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Add a longer description or proof points." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {showField("cta_primary") && (
                <FormField
                  control={form.control}
                  name="ctaPrimary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary CTA</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Book a Quote" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {showField("cta_secondary") && (
                <FormField
                  control={form.control}
                  name="ctaSecondary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary CTA</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Call Us Now" {...field} />
                      </FormControl>
                      <FormDescription>Shown when the phone button is disabled.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {showField("show_phone_cta") && (
              <FormField
                control={form.control}
                name="showPhoneCTA"
                render={({ field }) => (
                  <FormItem className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <FormLabel>Show phone CTA</FormLabel>
                        <FormDescription>
                          Use your business phone number for the secondary action.
                        </FormDescription>
                        {!hasBusinessPhone && (
                          <p className="text-xs text-destructive">
                            Add a phone number in your business settings to enable this option.
                          </p>
                        )}
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                          disabled={!hasBusinessPhone}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Hero Section
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

