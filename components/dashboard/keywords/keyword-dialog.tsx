'use client';

import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { Button } from "@/components/ui/button";
import { KeywordSchema, type Keyword } from "@/validations/keywords";
import { addKeyword, updateKeyword } from "@/actions/keywords";

interface KeywordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    keywordToEdit?: Keyword;
    onSuccess: (keyword: Keyword) => void;
}

export function KeywordDialog({
    open,
    onOpenChange,
    keywordToEdit,
    onSuccess,
}: KeywordDialogProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<Keyword>({
        resolver: zodResolver(KeywordSchema),
        defaultValues: {
            id: keywordToEdit?.id || "",
            keyword: keywordToEdit?.keyword || "",
        },
    });

    // Reset form when dialog opens or keywordToEdit changes
    useEffect(() => {
        if (open) {
            form.reset({
                id: keywordToEdit?.id || "",
                keyword: keywordToEdit?.keyword || "",
            });
        }
    }, [open, keywordToEdit, form]);

    const onSubmit = async (data: Keyword) => {
        startTransition(async () => {
            try {
                if (keywordToEdit) {
                    const result = await updateKeyword(keywordToEdit.keyword, data.keyword);
                    if (result.success && result.keyword) {
                        toast.success("Keyword updated successfully");
                        onSuccess(result.keyword);
                        onOpenChange(false);
                    }
                } else {
                    const result = await addKeyword(data.keyword);
                    if (result.success && result.keyword) {
                        toast.success("Keyword added successfully");
                        onSuccess(result.keyword);
                        onOpenChange(false);
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error(error instanceof Error ? error.message : "Something went wrong");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {keywordToEdit ? "Edit Keyword" : "Add Keyword"}
                    </DialogTitle>
                    <DialogDescription>
                        {keywordToEdit
                            ? "Make changes to your keyword here."
                            : "Add a new keyword to improve your SEO."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="keyword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Keyword</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. house cleaning sydney" {...field} />
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
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
