'use client';

import { useEffect, useRef } from 'react';
import { useAIUsageStore } from '@/stores/use-ai-usage-store';

interface AIUsageProviderProps {
  usage: number;
  limit: number;
  planType: string;
  children: React.ReactNode;
}

export function AIUsageProvider({ 
  usage, 
  limit, 
  planType, 
  children 
}: AIUsageProviderProps) {
  const initialize = useAIUsageStore((state) => state.initialize);
  const syncFromServer = useAIUsageStore((state) => state.syncFromServer);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialize({ usage, limit, planType });
      initialized.current = true;
      return;
    }

    syncFromServer({ usage, limit, planType });
  }, [usage, limit, planType, initialize, syncFromServer]);

  return <>{children}</>;
}

