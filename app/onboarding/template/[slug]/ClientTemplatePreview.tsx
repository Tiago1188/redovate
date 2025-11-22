'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import RenderTemplate from "@/components/template-renderer/RenderTemplate";
import { UseTemplateButton } from "../use-template-button";
import { TemplateCustomizer } from "@/components/template/TemplateCustomizer";
import { THEME_PRESETS } from "@/data/theme-presets";

interface ClientTemplatePreviewProps {
  template: any;
  components: any[];
  fakeContent: any;
  userPlan: 'free' | 'starter' | 'business';
}

export default function ClientTemplatePreview({
  template,
  components,
  fakeContent,
  userPlan,
}: ClientTemplatePreviewProps) {
  const [customTheme, setCustomTheme] = useState<string>("default");
  const [customFont, setCustomFont] = useState<string>("inter");
  const [customColors, setCustomColors] = useState<{
    primary: string;
    background: string;
  } | undefined>(undefined);

  const isAllowed = userPlan !== 'free';

  const handleThemeChange = (themeId: string) => {
    if (!isAllowed) return;
    setCustomTheme(themeId);
    
    // If user picks a preset, we reset custom colors to match that preset (or clear them)
    // Or we could load the preset colors into state.
    // Let's load the preset colors into state if available.
    const preset = THEME_PRESETS.find(p => p.id === themeId);
    if (preset) {
        setCustomColors({
            primary: preset.colors.primary,
            background: preset.colors.background
        });
    } else {
        setCustomColors(undefined);
    }
  };

  const handleFontChange = (fontId: string) => {
    if (isAllowed) setCustomFont(fontId);
  };

  const handleColorChange = (key: 'primary' | 'background', value: string) => {
      if (!isAllowed) return;
      setCustomColors(prev => {
          const base = prev || { primary: '#000000', background: '#ffffff' }; // fallback
          return { ...base, [key]: value };
      });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col relative">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/onboarding/template">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to templates
              </Link>
            </Button>

            <div className="h-6 w-px bg-border" />

            <span className="font-medium text-sm hidden sm:inline-block">
              Previewing: {template.name}
            </span>
          </div>

          <UseTemplateButton 
            templateId={template.id} 
            customizations={{
              theme: customTheme,
              font: customFont
              // We need to update UseTemplateButton to accept colors if we want to save them properly
              // The current server action only takes theme and font strings.
              // We updated actions/templates.ts to accept 'theme' and 'font'.
              // If we want to save custom colors, we'll need to send them somehow.
              // But for now, let's stick to the plan which saves theme ID and font ID.
              // The server action currently stores them.
            }}
          />
        </div>
      </div>

      {/* Template Preview */}
      <div 
        className="flex-1"
        style={{
            // @ts-ignore
            "--header-offset": "3.5rem",
        } as React.CSSProperties}
      >
        <RenderTemplate
          components={components}
          data={fakeContent}
          showBranding={true}
          templateSlug={template.slug}
          customTheme={customTheme}
          customFont={customFont}
          // Pass custom colors for preview
          customColors={customColors ? {
              primary: customColors.primary,
              background: customColors.background,
              secondary: '#f8fafc', // default fallback
              foreground: '#0f172a' // default fallback
          } : undefined}
        />
      </div>

      {/* Customizer */}
      <TemplateCustomizer
        currentTheme={customTheme}
        currentFont={customFont}
        currentColors={customColors}
        onThemeChange={handleThemeChange}
        onFontChange={handleFontChange}
        onColorChange={handleColorChange}
        userPlan={userPlan}
      />
    </div>
  );
}
