'use client';

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { FONT_OPTIONS, THEME_PRESETS } from "@/data/theme-presets";
import { updateBusinessTheme, ThemeData } from "@/actions/business/theme";

interface AppearanceFormProps {
  initialTheme: ThemeData | null;
  businessId: string;
  userPlan: 'free' | 'starter' | 'business';
}

export function AppearanceForm({ initialTheme, businessId, userPlan }: AppearanceFormProps) {
  const [isPending, startTransition] = useTransition();
  
  const [font, setFont] = useState(initialTheme?.font || 'inter');
  const [themeId, setThemeId] = useState(initialTheme?.themeId || 'default'); // fallback to handling stored themeId
  
  // Colors state
  // We try to load from initialTheme if it has explicit colors, otherwise fall back to preset colors
  const initialColors = initialTheme?.colors || THEME_PRESETS.find(p => p.id === themeId)?.colors || THEME_PRESETS[0].colors;
  
  const [colors, setColors] = useState(initialColors);

  const isAllowed = userPlan !== 'free';
  const isBusiness = userPlan === 'business';

  const handleSave = () => {
    startTransition(async () => {
      try {
        const themeData: ThemeData = {
          font,
          colors: {
              ...colors,
              // Ensure required fields
              secondary: colors.secondary || '#f8fafc',
              foreground: colors.foreground || '#0f172a'
          },
          themeId // Store the selected preset ID as well
        };

        await updateBusinessTheme(businessId, themeData);
        toast.success("Appearance settings saved successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to save settings");
      }
    });
  };

  const handleThemePresetChange = (id: string) => {
      setThemeId(id);
      const preset = THEME_PRESETS.find(p => p.id === id);
      if (preset) {
          setColors(preset.colors);
      }
  };

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Choose a font and color scheme for your website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Font Selection */}
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select 
                value={font} 
                onValueChange={setFont}
                disabled={!isAllowed || isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => {
                   const isLocked = (userPlan === 'starter' && f.plan === 'business');
                   return (
                    <SelectItem 
                        key={f.id} 
                        value={f.id}
                        disabled={isLocked}
                    >
                        <span className="flex items-center justify-between w-full gap-2">
                             {f.label}
                             {isLocked && <Lock className="w-3 h-3 opacity-50 ml-2" />}
                        </span>
                    </SelectItem>
                   );
                })}
              </SelectContent>
            </Select>
            {!isAllowed && (
                <p className="text-xs text-muted-foreground text-orange-600 flex items-center mt-1">
                    <Lock className="w-3 h-3 mr-1" /> 
                    Upgrade to Starter or Business plan to customize fonts.
                </p>
            )}
          </div>

          {/* Theme Preset Selection */}
          <div className="space-y-2">
            <Label>Color Theme Preset</Label>
            <div className="flex flex-wrap gap-3 pt-2">
                {THEME_PRESETS.map((preset) => (
                    <button
                        key={preset.id}
                        onClick={() => isAllowed && handleThemePresetChange(preset.id)}
                        disabled={!isAllowed}
                        className={`
                            w-10 h-10 rounded-full border-2 transition-all 
                            ${preset.previewClass}
                            ${themeId === preset.id ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'opacity-80 hover:opacity-100'}
                            ${!isAllowed ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        title={preset.name}
                    />
                ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
             <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                    <Input 
                        type="color" 
                        value={colors.primary}
                        onChange={(e) => isAllowed && setColors({...colors, primary: e.target.value})}
                        disabled={!isAllowed}
                        className="w-12 h-10 p-1 px-1"
                    />
                    <Input 
                        value={colors.primary}
                        onChange={(e) => isAllowed && setColors({...colors, primary: e.target.value})}
                        disabled={!isAllowed}
                        className="font-mono uppercase"
                    />
                </div>
             </div>
             
             <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                    <Input 
                        type="color" 
                        value={colors.background}
                        onChange={(e) => isAllowed && setColors({...colors, background: e.target.value})}
                        disabled={!isAllowed}
                        className="w-12 h-10 p-1 px-1"
                    />
                    <Input 
                        value={colors.background}
                        onChange={(e) => isAllowed && setColors({...colors, background: e.target.value})}
                        disabled={!isAllowed}
                        className="font-mono uppercase"
                    />
                </div>
             </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
                onClick={handleSave} 
                disabled={!isAllowed || isPending}
            >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

