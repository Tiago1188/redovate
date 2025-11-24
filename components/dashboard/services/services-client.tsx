'use client';

import { useState, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type Service, addService } from "@/actions/services";
import { generateSuggestedServices } from "@/actions/ai/services";
import { useAIUsageStore } from "@/stores/use-ai-usage-store";
import { ServicesHeader } from "./services-header";
import { ServicesTable } from "./services-table";
import { ServiceDialog } from "./service-dialog";
import { GenerateDialog } from "./generate-dialog";

interface ServicesClientProps {
  initialServices: Service[];
  maxServices: number;
}

type ServiceAction =
  | { type: 'add'; service: Service }
  | { type: 'update'; service: Service }
  | { type: 'delete'; id: string };

export function ServicesClient({ initialServices, maxServices }: ServicesClientProps) {
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const incrementUsage = useAIUsageStore((state) => state.incrementUsage);
  const [isPending, startTransition] = useTransition();

  const [optimisticServices, mutateOptimisticServices] = useOptimistic(
    initialServices,
    (state, action: ServiceAction) => {
      switch (action.type) {
        case 'add':
          return [...state, action.service];
        case 'update':
          return state.map((s) => (s.id === action.service.id ? action.service : s));
        case 'delete':
          return state.filter((s) => s.id !== action.id);
        default:
          return state;
      }
    }
  );

  const handleAddManual = () => {
    setIsAddDialogOpen(true);
  };

  const handleOpenGenerate = () => {
    if (optimisticServices.length >= maxServices && maxServices < 999) {
      toast.error("Plan limit reached. Cannot generate more services.");
      return;
    }
    setIsGenerateDialogOpen(true);
  };

  const handleGenerateAI = async (countToGenerate: number) => {
    setIsGenerating(true);
    try {
      const result = await generateSuggestedServices(countToGenerate);

      if (!result.success || !result.services) {
        throw new Error(result.error || "Failed to generate services");
      }

      // Add services sequentially
      let addedCount = 0;
      const newlyAdded: Service[] = [];

      for (const service of result.services) {
        try {
          const tempService = { ...service, id: crypto.randomUUID() };

          startTransition(() => {
            mutateOptimisticServices({ type: 'add', service: tempService });
          });

          const response = await addService(service);
          if (response?.success && response.service) {
            newlyAdded.push(response.service);
            addedCount++;
          }
        } catch (err) {
          console.error("Failed to add generated service", err);
        }
      }

      if (addedCount > 0) {
        toast.success(`Successfully generated ${addedCount} services!`);
        // Update local usage state immediately
        for (let i = 0; i < addedCount; i++) {
          incrementUsage();
        }
        setIsGenerateDialogOpen(false);
        router.refresh();
      } else {
        toast.warning("No services were added. You might have reached your limit.");
      }

    } catch (error) {
      toast.error("Something went wrong while generating services.");
      console.error(error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleServiceCreated = (service: Service) => {
    // Optimistic update
    startTransition(() => {
      mutateOptimisticServices({ type: 'add', service });
    });
    router.refresh();
  };

  const handleServiceUpdated = (service: Service) => {
    startTransition(() => {
      mutateOptimisticServices({ type: 'update', service });
    });
    router.refresh();
  };

  const handleServiceDeleted = (serviceId: string) => {
    startTransition(() => {
      mutateOptimisticServices({ type: 'delete', id: serviceId });
    });
    router.refresh();
  };

  const remainingSlots = maxServices >= 999 ? 999 : maxServices - optimisticServices.length;

  return (
    <div className="space-y-6 p-6">
      <ServicesHeader
        currentCount={optimisticServices.length}
        maxCount={maxServices}
        onAdd={handleAddManual}
        onGenerate={handleOpenGenerate}
        isGenerating={isGenerating}
      />

      <ServicesTable
        services={optimisticServices}
        onServiceUpdated={handleServiceUpdated}
        onServiceDeleted={handleServiceDeleted}
      />

      <ServiceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={({ service }) => {
          handleServiceCreated(service);
        }}
      />

      <GenerateDialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
        onGenerate={handleGenerateAI}
        maxCount={maxServices}
        remainingSlots={remainingSlots}
      />
    </div>
  );
}
