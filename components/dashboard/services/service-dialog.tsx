'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { generateServiceDescription } from "@/actions/ai/services";
import { addService, updateService, type Service } from "@/actions/services";
import { useAIUsageStore } from "@/stores/use-ai-usage-store";

const formSchema = z.object({
  title: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().optional(),
});

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  onSuccess?: (payload: { service: Service; type: 'create' | 'update' }) => void;
}

export function ServiceDialog({ open, onOpenChange, service, onSuccess }: ServiceDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const incrementUsage = useAIUsageStore((state) => state.incrementUsage);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        title: service.title,
        description: service.description,
        price: service.price || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        price: "",
      });
    }
  }, [service, form, open]);

  const handleGenerateDescription = async () => {
    const title = form.getValues("title");
    if (!title) {
      toast.error("Please enter a service name first");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateServiceDescription(title);
      if (result.success && result.description) {
        form.setValue("description", result.description, { shouldDirty: true });
        toast.success("Description generated!");
        incrementUsage();
        incrementUsage();
      } else {
        toast.error(result.error || "Failed to generate description");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (service) {
        const result = await updateService(service.id, values);
        if (result?.success && result.service) {
          toast.success("Service updated successfully");
          onSuccess?.({ service: result.service, type: "update" });
        }
      } else {
        const result = await addService(values);
        if (result?.success && result.service) {
          toast.success("Service added successfully");
          onSuccess?.({ service: result.service, type: "create" });
        }
      }
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save service");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            {service
              ? "Update your service details below."
              : "Fill in the details for your new service."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Emergency Plumbing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Description *</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Sparkles className="h-3 w-3 mr-1" />
                      )}
                      {service ? "Enhance with AI" : "Generate Description"}
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your service..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $99 or From $50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {service ? "Update Service" : "Add Service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

