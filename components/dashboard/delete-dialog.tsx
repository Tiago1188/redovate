'use client';

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description: React.ReactNode;
    onDelete: () => Promise<void>;
    isDeleting?: boolean; // Optional override if parent handles state
}

export function DeleteDialog({
    open,
    onOpenChange,
    title = "Are you sure?",
    description,
    onDelete,
    isDeleting: externalIsDeleting,
}: DeleteDialogProps) {
    const [isPending, startTransition] = useTransition();

    // Use external loading state if provided, otherwise use local transition state
    const isLoading = externalIsDeleting ?? isPending;

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();

        // If external state is used, just call the function
        if (typeof externalIsDeleting !== 'undefined') {
            onDelete();
            return;
        }

        // Otherwise use transition
        startTransition(async () => {
            await onDelete();
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
