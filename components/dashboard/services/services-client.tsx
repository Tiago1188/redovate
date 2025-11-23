'use client';

import { useState } from "react";
import { toast } from "sonner";
import { type Service, addService } from "@/actions/services";
import { generateSuggestedServices } from "@/actions/ai/services";
import { ServicesHeader } from "./services-header";
import { ServicesTable } from "./services-table";
import { ServiceDialog } from "./service-dialog";
import { GenerateDialog } from "./generate-dialog";

interface ServicesClientProps {
  initialServices: Service[];
  maxServices: number;
}

export function ServicesClient({ initialServices, maxServices }: ServicesClientProps) {
  const [services] = useState<Service[]>(initialServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
      for (const service of result.services) {
        try {
          await addService(service);
          addedCount++;
        } catch (err) {
          console.error("Failed to add generated service", err);
        }
      }

      if (addedCount > 0) {
        toast.success(`Successfully generated ${addedCount} services!`);
        window.location.reload(); // Refresh to show new services
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

  const refresh = () => {
    window.location.reload();
  };

  const remainingSlots = maxServices >= 999 ? 999 : maxServices - services.length;

  return (
    <div className="space-y-6 p-6">
      <ServicesHeader
        currentCount={initialServices.length}
        maxCount={maxServices}
        onAdd={handleAddManual}
        onGenerate={handleOpenGenerate}
        isGenerating={isGenerating}
      />
      
      <ServicesTable initialServices={initialServices} />

      <ServiceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={refresh}
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
