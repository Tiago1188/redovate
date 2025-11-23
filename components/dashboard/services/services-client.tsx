'use client';

import { useState } from "react";
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

export function ServicesClient({ initialServices, maxServices }: ServicesClientProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const incrementUsage = useAIUsageStore((state) => state.incrementUsage);

  const handleAddManual = () => {
    setIsAddDialogOpen(true);
  };

  const handleOpenGenerate = () => {
      if (services.length >= maxServices && maxServices < 999) {
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
        setServices((prev) => [...prev, ...newlyAdded]);
        setIsGenerateDialogOpen(false);
        // Refresh server data in background without a full reload
        router.refresh();
      } else {
        toast.warning("No services were added. You might have reached your limit.");
      }

    } catch (error) {
      toast.error("Something went wrong while generating services.");
      console.error(error);
      throw error; // Re-throw for the dialog to handle/know
    } finally {
      setIsGenerating(false);
    }
  };

  const handleServiceCreated = (service: Service) => {
    setServices((prev) => [...prev, service]);
    router.refresh();
  };

  const handleServiceUpdated = (service: Service) => {
    setServices((prev) => prev.map((item) => (item.id === service.id ? service : item)));
    router.refresh();
  };

  const handleServiceDeleted = (serviceId: string) => {
    setServices((prev) => prev.filter((item) => item.id !== serviceId));
    router.refresh();
  };

  const remainingSlots = maxServices >= 999 ? 999 : maxServices - services.length;

  return (
    <div className="space-y-6 p-6">
      <ServicesHeader
        currentCount={services.length}
        maxCount={maxServices}
        onAdd={handleAddManual}
        onGenerate={handleOpenGenerate}
        isGenerating={isGenerating}
      />
      
      <ServicesTable
        services={services}
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
