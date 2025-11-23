import { create } from 'zustand';

interface AIUsageState {
  usage: number;
  limit: number;
  planType: string;
  
  setUsage: (usage: number) => void;
  incrementUsage: () => void;
  setLimit: (limit: number) => void;
  setPlanType: (planType: string) => void;
  initialize: (data: { usage: number; limit: number; planType: string }) => void;
  syncFromServer: (data: { usage: number; limit: number; planType: string }) => void;
}

export const useAIUsageStore = create<AIUsageState>((set) => ({
  usage: 0,
  limit: 0,
  planType: 'free',

  setUsage: (usage) => set({ usage }),
  
  incrementUsage: () => set((state) => ({ usage: state.usage + 1 })),
  
  setLimit: (limit) => set({ limit }),
  
  setPlanType: (planType) => set({ planType }),
  
  initialize: ({ usage, limit, planType }) => set({ usage, limit, planType }),

  syncFromServer: ({ usage, limit, planType }) =>
    set((state) => ({
      usage: Math.max(state.usage, usage),
      limit,
      planType,
    })),
}));

