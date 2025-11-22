'use client';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FONT_OPTIONS, THEME_PRESETS } from "@/data/theme-presets";
import { Input } from "@/components/ui/input";

interface TemplateCustomizerProps {
  currentTheme: string;
  currentFont: string;
  // We use 'colors' to pass custom color values if they are not part of a preset
  // But for simplicity here we will stick to presets for the quick customizer
  // Or we can allow editing the colors if the requirement asks for it.
  // The requirement says: "Add color pickers for Primary and Background colors"
  // So we need to support custom colors.
  currentColors?: {
      primary: string;
      background: string;
  };
  onThemeChange: (themeId: string) => void;
  onFontChange: (fontId: string) => void;
  onColorChange?: (key: 'primary' | 'background', value: string) => void;
  userPlan: 'free' | 'starter' | 'business';
}

export function TemplateCustomizer({
  currentTheme,
  currentFont,
  currentColors,
  onThemeChange,
  onFontChange,
  onColorChange,
  userPlan,
}: TemplateCustomizerProps) {
  
  const isAllowed = userPlan !== 'free';
  const isBusiness = userPlan === 'business';

  // Filter fonts based on plan
  const availableFonts = FONT_OPTIONS.filter(font => {
      if (userPlan === 'free') return font.id === 'inter'; // Free plan only sees Inter (or whatever default) - but actually UI is disabled so it doesn't matter much
      if (userPlan === 'starter') return font.plan === 'starter';
      return true; // business sees all
  });

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col sm:flex-row items-center gap-4 p-3 bg-background/95 backdrop-blur border rounded-xl shadow-lg px-6 max-w-[90vw] overflow-x-auto">
      
      {/* Theme Presets Picker */}
      <div className="flex items-center gap-2 border-r pr-4">
        <span className="text-xs font-medium text-muted-foreground mr-2">Theme</span>
        <div className="flex items-center gap-1.5">
          {THEME_PRESETS.map((theme) => (
            <TooltipProvider key={theme.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => isAllowed && onThemeChange(theme.id)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      theme.previewClass,
                      currentTheme === theme.id ? "scale-110 ring-2 ring-ring ring-offset-2" : "opacity-80 hover:opacity-100",
                      !isAllowed && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={!isAllowed}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{theme.name}</p>
                  {!isAllowed && <p className="text-xs text-muted-foreground flex items-center mt-1"><Lock className="w-3 h-3 mr-1" /> Premium Feature</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Font Picker */}
      <div className="flex items-center gap-2 border-r pr-4">
        <span className="text-xs font-medium text-muted-foreground mr-2">Font</span>
        <Select 
            value={currentFont} 
            onValueChange={(val) => isAllowed && onFontChange(val)}
            disabled={!isAllowed}
        >
            <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
                {FONT_OPTIONS.map((font) => {
                    const isLocked = (userPlan === 'starter' && font.plan === 'business');
                    return (
                        <SelectItem 
                            key={font.id} 
                            value={font.id}
                            disabled={isLocked}
                            className="text-xs"
                        >
                            <span className="flex items-center justify-between w-full gap-2">
                                {font.label}
                                {isLocked && <Lock className="w-3 h-3 opacity-50" />}
                            </span>
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
      </div>
      
      {/* Color Pickers (If supported) */}
      {onColorChange && currentColors && (
          <div className="flex items-center gap-3">
               <div className="flex items-center gap-2">
                    <label htmlFor="primary-color" className="text-xs font-medium text-muted-foreground">Primary</label>
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border shadow-sm">
                        <input 
                            type="color" 
                            id="primary-color"
                            value={currentColors.primary}
                            onChange={(e) => isAllowed && onColorChange('primary', e.target.value)}
                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 m-0 cursor-pointer"
                            disabled={!isAllowed}
                        />
                    </div>
               </div>
               
               <div className="flex items-center gap-2">
                    <label htmlFor="bg-color" className="text-xs font-medium text-muted-foreground">Background</label>
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border shadow-sm">
                        <input 
                            type="color" 
                            id="bg-color"
                            value={currentColors.background}
                            onChange={(e) => isAllowed && onColorChange('background', e.target.value)}
                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 m-0 cursor-pointer"
                            disabled={!isAllowed}
                        />
                    </div>
               </div>
          </div>
      )}


      {!isAllowed && (
         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-3 rounded-full shadow-sm whitespace-nowrap pointer-events-none animate-in fade-in slide-in-from-bottom-2">
           Upgrade to customize
         </div>
      )}

    </div>
  );
}
