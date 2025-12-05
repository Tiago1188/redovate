import { create } from "zustand";
import type { TemplateTheme } from "@/types";

interface ThemeState {
  theme: TemplateTheme;
  originalTheme: TemplateTheme | null;
  isModified: boolean;

  // Actions
  setTheme: (theme: TemplateTheme) => void;
  updateTheme: (updates: Partial<TemplateTheme>) => void;
  setOriginalTheme: (theme: TemplateTheme) => void;
  resetToOriginal: () => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
  setHeadingFont: (font: string) => void;
  setBodyFont: (font: string) => void;
}

const defaultTheme: TemplateTheme = {
  primary_color: "#18181b",
  secondary_color: "#f4f4f5",
  accent_color: "#3b82f6",
  background_color: "#ffffff",
  text_color: "#18181b",
  font_heading: "Inter",
  font_body: "Inter",
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: defaultTheme,
  originalTheme: null,
  isModified: false,

  setTheme: (theme) =>
    set({
      theme,
      isModified: false,
    }),

  updateTheme: (updates) =>
    set((state) => ({
      theme: { ...state.theme, ...updates },
      isModified: true,
    })),

  setOriginalTheme: (theme) =>
    set({
      originalTheme: theme,
      theme,
      isModified: false,
    }),

  resetToOriginal: () => {
    const { originalTheme } = get();
    if (originalTheme) {
      set({
        theme: originalTheme,
        isModified: false,
      });
    }
  },

  setPrimaryColor: (color) =>
    set((state) => ({
      theme: { ...state.theme, primary_color: color },
      isModified: true,
    })),

  setSecondaryColor: (color) =>
    set((state) => ({
      theme: { ...state.theme, secondary_color: color },
      isModified: true,
    })),

  setAccentColor: (color) =>
    set((state) => ({
      theme: { ...state.theme, accent_color: color },
      isModified: true,
    })),

  setHeadingFont: (font) =>
    set((state) => ({
      theme: { ...state.theme, font_heading: font },
      isModified: true,
    })),

  setBodyFont: (font) =>
    set((state) => ({
      theme: { ...state.theme, font_body: font },
      isModified: true,
    })),
}));

