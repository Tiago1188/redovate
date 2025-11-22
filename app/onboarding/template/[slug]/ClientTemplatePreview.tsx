'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseTemplateButton } from "../use-template-button";
import { TemplateCustomizer } from "@/components/template/TemplateCustomizer";
import { THEME_PRESETS } from "@/data/theme-presets";
import { cn } from "@/lib/utils";

interface ClientTemplatePreviewProps {
  template: any;
  components: any[];
  fakeContent: any;
  userPlan: 'free' | 'starter' | 'business';
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export default function ClientTemplatePreview({
  template,
  components,
  fakeContent,
  userPlan,
}: ClientTemplatePreviewProps) {
  const [customTheme, setCustomTheme] = useState<string>(
    template.slug.includes('voltage-pro') ? 'theme-voltage-pro' : 'theme-neutral'
  );
  const [customFont, setCustomFont] = useState<string>("inter");
  const [customColors, setCustomColors] = useState<{
    primary: string;
    background: string;
  } | undefined>(undefined);

  const [device, setDevice] = useState<DeviceType>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isAllowed = userPlan !== 'free';

  const handleThemeChange = (themeId: string) => {
    if (!isAllowed) return;
    setCustomTheme(themeId);
    
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

  // Post messages to iframe when state changes
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_THEME',
        payload: customTheme
      }, '*');
    }
  }, [customTheme]);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_FONT',
        payload: customFont
      }, '*');
    }
  }, [customFont]);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_COLORS',
        payload: customColors
      }, '*');
    }
  }, [customColors]);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col relative overflow-hidden">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 items-center justify-between relative">
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

          {/* Device Controls */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
             <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", device === 'desktop' && "bg-white dark:bg-zinc-950 shadow-sm")}
                onClick={() => setDevice('desktop')}
                title="Desktop view"
             >
                <Monitor className="h-4 w-4" />
                <span className="sr-only">Desktop</span>
             </Button>
             <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", device === 'tablet' && "bg-white dark:bg-zinc-950 shadow-sm")}
                onClick={() => setDevice('tablet')}
                title="Tablet view"
             >
                <Tablet className="h-4 w-4" />
                <span className="sr-only">Tablet</span>
             </Button>
             <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", device === 'mobile' && "bg-white dark:bg-zinc-950 shadow-sm")}
                onClick={() => setDevice('mobile')}
                title="Mobile view"
             >
                <Smartphone className="h-4 w-4" />
                <span className="sr-only">Mobile</span>
             </Button>
          </div>

          <UseTemplateButton 
            templateId={template.id} 
            customizations={{
              theme: customTheme,
              font: customFont
            }}
          />
        </div>
      </div>

      {/* Template Preview Area */}
      <div className="w-full h-[calc(100vh-3.5rem)] overflow-hidden flex items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-900/50">
        <div 
            className={cn(
                "transition-all duration-300 ease-in-out bg-white shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800",
                device === 'desktop' && "w-full h-full rounded-md",
                device === 'tablet' && "w-[768px] h-[90%] rounded-lg",
                device === 'mobile' && "w-[375px] h-[85%] rounded-[2rem] border-4 border-zinc-800 dark:border-zinc-700"
            )}
        >
            <iframe
                ref={iframeRef}
                src={`/onboarding/template/${template.slug}/frame?theme=${customTheme}&font=${customFont}${customColors ? `&primary=${encodeURIComponent(customColors.primary)}&background=${encodeURIComponent(customColors.background)}` : ''}`}
                className="w-full h-full border-0 bg-white"
                title="Template Preview"
            />
        </div>
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
