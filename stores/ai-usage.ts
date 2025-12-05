import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanType } from "@/types";
import { PLAN_LIMITS } from "@/constants";

interface AIUsageState {
  generationsCount: number;
  periodStart: Date | null;
  planType: PlanType;

  // Actions
  setUsage: (count: number, periodStart: Date) => void;
  setPlanType: (planType: PlanType) => void;
  incrementUsage: () => void;
  resetUsage: () => void;

  // Computed
  getRemainingGenerations: () => number;
  canGenerate: () => boolean;
}

export const useAIUsageStore = create<AIUsageState>()(
  persist(
    (set, get) => ({
      generationsCount: 0,
      periodStart: null,
      planType: "free",

      setUsage: (count, periodStart) =>
        set({ generationsCount: count, periodStart }),

      setPlanType: (planType) => set({ planType }),

      incrementUsage: () =>
        set((state) => ({
          generationsCount: state.generationsCount + 1,
        })),

      resetUsage: () =>
        set({
          generationsCount: 0,
          periodStart: new Date(),
        }),

      getRemainingGenerations: () => {
        const { generationsCount, planType } = get();
        const limit = PLAN_LIMITS[planType].maxAiGenerations;
        return Math.max(0, limit - generationsCount);
      },

      canGenerate: () => {
        const { generationsCount, planType } = get();
        const limit = PLAN_LIMITS[planType].maxAiGenerations;
        return generationsCount < limit;
      },
    }),
    {
      name: "ai-usage-storage",
    }
  )
);

