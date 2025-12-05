import { create } from "zustand";
import type { Template, TemplateCustomizations } from "@/types";

interface TemplateState {
  selectedTemplate: Template | null;
  customizations: TemplateCustomizations;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedTemplate: (template: Template | null) => void;
  setCustomizations: (customizations: Partial<TemplateCustomizations>) => void;
  resetCustomizations: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const defaultCustomizations: TemplateCustomizations = {
  theme: {},
  sections: [],
  hidden_sections: [],
};

export const useTemplateStore = create<TemplateState>((set) => ({
  selectedTemplate: null,
  customizations: defaultCustomizations,
  isLoading: false,
  error: null,

  setSelectedTemplate: (template) =>
    set({
      selectedTemplate: template,
      customizations: defaultCustomizations,
    }),

  setCustomizations: (customizations) =>
    set((state) => ({
      customizations: {
        ...state.customizations,
        ...customizations,
      },
    })),

  resetCustomizations: () =>
    set({ customizations: defaultCustomizations }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));

