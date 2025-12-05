import { create } from "zustand";
import type { SectionType } from "@/types";

type EditorPanel = "colors" | "fonts" | "spacing" | "sections" | null;

interface EditorState {
  activePanel: EditorPanel;
  selectedSection: string | null;
  previewMode: "desktop" | "tablet" | "mobile";
  isDirty: boolean;
  isSaving: boolean;

  // Actions
  setActivePanel: (panel: EditorPanel) => void;
  setSelectedSection: (section: string | null) => void;
  setPreviewMode: (mode: "desktop" | "tablet" | "mobile") => void;
  setDirty: (dirty: boolean) => void;
  setSaving: (saving: boolean) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  activePanel: null,
  selectedSection: null,
  previewMode: "desktop",
  isDirty: false,
  isSaving: false,

  setActivePanel: (activePanel) => set({ activePanel }),

  setSelectedSection: (selectedSection) => set({ selectedSection }),

  setPreviewMode: (previewMode) => set({ previewMode }),

  setDirty: (isDirty) => set({ isDirty }),

  setSaving: (isSaving) => set({ isSaving }),

  reset: () =>
    set({
      activePanel: null,
      selectedSection: null,
      previewMode: "desktop",
      isDirty: false,
      isSaving: false,
    }),
}));

