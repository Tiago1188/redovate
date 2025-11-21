'use client';

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { saveSelectedTemplate } from "@/app/onboarding/actions/saveSelectedTemplate";
import { toast } from "sonner";

export function UseTemplateButton({ templateId }: { templateId: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSelect = () => {
        startTransition(async () => {
            try {
                await saveSelectedTemplate(templateId);
                // Redirect manually since server action redirect may not work with useTransition
                router.push("/generating");
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                toast.error(`Failed to select template: ${errorMessage}`);
                console.error("Template selection error:", error);
            }
        });
    };

    return (
        <Button 
            onClick={handleSelect} 
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
        >
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Selecting...
                </>
            ) : (
                <>
                    <Check className="mr-2 h-4 w-4" />
                    Use Template
                </>
            )}
        </Button>
    );
}

