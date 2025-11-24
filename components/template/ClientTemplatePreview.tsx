'use client';

import { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Monitor, Tablet, Smartphone, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseTemplateButton } from "@/components/template/UseTemplateButton";
import { TemplateCustomizer } from "@/components/template/TemplateCustomizer";
import { THEME_PRESETS } from "@/data/theme-presets";
import { cn } from "@/lib/utils";
import { updateBusinessTheme, ThemeData } from "@/actions/business/theme";
import { toast } from "sonner";

interface ClientTemplatePreviewProps {
  template: any;
  userPlan: 'free' | 'starter' | 'business';
  mode: 'onboarding' | 'edit';
  backLink: string;
  iframeUrl: string;
  businessId?: string;
  initialTheme?: ThemeData | null;
  redirectPath?: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export default function ClientTemplatePreview({
  template,
  userPlan,
  mode,
  backLink,
  iframeUrl,
  businessId,
  initialTheme,
  redirectPath = "/generating",
}: ClientTemplatePreviewProps) {
  // Initialize state based on mode
  const defaultTheme = template.slug.includes('voltage-pro') ? 'theme-voltage-pro' : 'theme-neutral';

  const [customTheme, setCustomTheme] = useState<string>(
    mode === 'edit' && initialTheme?.themeId ? initialTheme.themeId : defaultTheme
  );
  const [customFont, setCustomFont] = useState<string>(
    mode === 'edit' && initialTheme?.font ? initialTheme.font : "inter"
  );

  // For colors, we use the initialTheme colors if available in edit mode, 
  // otherwise undefined (which falls back to theme preset defaults)
  const [customColors, setCustomColors] = useState<{
    primary: string;
    background: string;
  } | undefined>(
    mode === 'edit' && initialTheme?.colors ? {
      primary: initialTheme.colors.primary,
      background: initialTheme.colors.background
    } : undefined
  );

  const [device, setDevice] = useState<DeviceType>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isSaving, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAllowed = userPlan !== 'free';

  const handleThemeChange = (themeId: string) => {
    if (mode === 'onboarding' || !isAllowed) return;
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
    if (mode === 'edit' && isAllowed) setCustomFont(fontId);
  };

  const handleColorChange = (key: 'primary' | 'background', value: string) => {
    if (mode === 'onboarding' || !isAllowed) return;
    setCustomColors(prev => {
      const base = prev || { primary: '#000000', background: '#ffffff' }; // fallback
      return { ...base, [key]: value };
    });
  };

  const handleSave = () => {
    if (!businessId) return;

    startTransition(async () => {
      try {
        const themeData: ThemeData = {
          font: customFont,
          colors: {
            ...(customColors || { primary: '#000000', background: '#ffffff' }),
            // Ensure required fields if missing from customColors
            secondary: '#f8fafc',
            foreground: '#0f172a'
          },
          themeId: customTheme
        };

        await updateBusinessTheme(businessId, themeData);
        toast.success("Appearance settings saved successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to save settings");
      }
    });
  };

  const postMessage = (type: string, payload: any) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type, payload }, '*');
    }
  };

  // Post messages to iframe when state changes
  useEffect(() => {
    postMessage('UPDATE_THEME', customTheme);
  }, [customTheme]);

  useEffect(() => {
    postMessage('UPDATE_FONT', customFont);
  }, [customFont]);

  useEffect(() => {
    postMessage('UPDATE_COLORS', customColors);
  }, [customColors]);

  // Re-sync state when iframe loads (e.g. initial load or after navigation)
  const handleIframeLoad = () => {
    postMessage('UPDATE_THEME', customTheme);
    postMessage('UPDATE_FONT', customFont);
    postMessage('UPDATE_COLORS', customColors);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col relative overflow-hidden">

      {/* Top Bar */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 items-center justify-between relative">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="sm:w-auto sm:px-4">
              <Link href={backLink}>
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {mode === 'onboarding' ? 'Back to templates' : 'Back to dashboard'}
                </span>
              </Link>
            </Button>

            <div className="hidden sm:block h-6 w-px bg-border" />

            <span className="font-medium text-sm hidden sm:inline-block">
              {mode === 'onboarding' ? 'Previewing: ' : 'Editing: '} {template.name}
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

          <div>
            {mode === 'onboarding' ? (
              <UseTemplateButton
                templateId={template.id}
                // In onboarding mode, we don't pass customizations anymore as per requirement
                // The user selects the default template
                customizations={undefined}
                redirectPath={redirectPath}
              />
            ) : (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary text-primary-foreground mr-2 sm:mr-0"
                size="sm"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Save Changes</span>
                  </>
                )}
              </Button>
            )}
          </div>
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
            src={iframeUrl}
            onLoad={handleIframeLoad}
            className="w-full h-full border-0 bg-white"
            title="Template Preview"
          />
        </div>
      </div>

      {/* Customizer - Only in Edit Mode */}
      {mounted && mode === 'edit' && (
        <TemplateCustomizer
          currentTheme={customTheme}
          currentFont={customFont}
          currentColors={customColors}
          onThemeChange={handleThemeChange}
          onFontChange={handleFontChange}
          onColorChange={handleColorChange}
          userPlan={userPlan}
        />
      )}
    </div>
  );
}
