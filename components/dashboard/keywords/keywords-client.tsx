'use client';

import { useState, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type Keyword, deleteKeyword } from "@/actions/keywords";
import { generateKeywords } from "@/actions/ai/keywords";
import { useAIUsageStore } from "@/stores/use-ai-usage-store";
import { KeywordsHeader } from "./keywords-header";
import { KeywordsTable } from "./keywords-table";
import { KeywordDialog } from "./keyword-dialog";
import { GenerateDialog } from "./generate-dialog";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";

interface KeywordsClientProps {
    initialKeywords: Keyword[];
    maxKeywords: number;
}

type KeywordAction =
    | { type: 'add'; keyword: Keyword }
    | { type: 'update'; keyword: Keyword }
    | { type: 'delete'; id: string };

export function KeywordsClient({ initialKeywords, maxKeywords }: KeywordsClientProps) {
    const router = useRouter();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
    const [keywordToEdit, setKeywordToEdit] = useState<Keyword | undefined>(undefined);
    const [keywordToDelete, setKeywordToDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const incrementUsage = useAIUsageStore((state) => state.incrementUsage);
    const [, startTransition] = useTransition();

    const [optimisticKeywords, mutateOptimisticKeywords] = useOptimistic(
        initialKeywords,
        (state, action: KeywordAction) => {
            switch (action.type) {
                case 'add':
                    return [...state, action.keyword];
                case 'update':
                    return state.map((k) => (k.id === action.keyword.id ? action.keyword : k));
                case 'delete':
                    return state.filter((k) => k.keyword !== action.id);
                default:
                    return state;
            }
        }
    );

    const filteredKeywords = optimisticKeywords.filter(k =>
        k.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddManual = () => {
        setKeywordToEdit(undefined);
        setIsAddDialogOpen(true);
    };

    const handleEdit = (keyword: Keyword) => {
        setKeywordToEdit(keyword);
        setIsAddDialogOpen(true);
    };

    const handleDeleteClick = (keyword: string) => {
        setKeywordToDelete(keyword);
    };

    const handleOpenGenerate = () => {
        if (optimisticKeywords.length >= maxKeywords && maxKeywords < 999) {
            toast.error("Plan limit reached. Cannot generate more keywords.");
            return;
        }
        setIsGenerateDialogOpen(true);
    };

    const handleGenerateAI = async (countToGenerate: number) => {
        try {
            const result = await generateKeywords(countToGenerate);

            if (!result.success || !result.keywords) {
                throw new Error(result.error || "Failed to generate keywords");
            }

            // Add keywords optimistically
            result.keywords.forEach(k => {
                startTransition(() => {
                    mutateOptimisticKeywords({
                        type: 'add',
                        keyword: { id: k, keyword: k }
                    });
                });
            });

            toast.success(`Successfully generated ${result.keywords.length} keywords!`);
            incrementUsage();
            setIsGenerateDialogOpen(false);
            router.refresh();

        } catch (error) {
            toast.error("Something went wrong while generating keywords.");
            console.error(error);
            throw error;
        }
    };

    const handleKeywordCreated = (keyword: Keyword) => {
        startTransition(() => {
            mutateOptimisticKeywords({ type: 'add', keyword });
        });
        router.refresh();
    };

    const handleKeywordUpdated = (_keyword: Keyword) => {
        router.refresh();
    };

    const handleKeywordDeleted = (keywordId: string) => {
        startTransition(() => {
            mutateOptimisticKeywords({ type: 'delete', id: keywordId });
        });
        router.refresh();
    };

    const remainingSlots = maxKeywords >= 999 ? 999 : maxKeywords - optimisticKeywords.length;

    return (
        <div className="space-y-6 p-6">
            <KeywordsHeader
                currentCount={optimisticKeywords.length}
                maxCount={maxKeywords}
                onAdd={handleAddManual}
                onGenerate={handleOpenGenerate}
                isGenerating={false}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            <KeywordsTable
                keywords={filteredKeywords}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <KeywordDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                keywordToEdit={keywordToEdit}
                onSuccess={(keyword) => {
                    if (keywordToEdit) {
                        handleKeywordUpdated(keyword);
                    } else {
                        handleKeywordCreated(keyword);
                    }
                }}
            />

            <GenerateDialog
                open={isGenerateDialogOpen}
                onOpenChange={setIsGenerateDialogOpen}
                onGenerate={handleGenerateAI}
                maxCount={maxKeywords}
                remainingSlots={remainingSlots}
            />

            <DeleteDialog
                open={!!keywordToDelete}
                onOpenChange={(open) => !open && setKeywordToDelete(null)}
                title="Delete Keyword"
                description={
                    <span>
                        This action cannot be undone. This will permanently delete the keyword
                        <span className="font-medium"> &quot;{keywordToDelete}&quot; </span>
                        from your business profile.
                    </span>
                }
                onDelete={async () => {
                    if (keywordToDelete) {
                        const result = await deleteKeyword(keywordToDelete);
                        if (result.success) {
                            toast.success("Keyword deleted successfully");
                            setKeywordToDelete(null);
                            handleKeywordDeleted(keywordToDelete);
                        } else {
                            throw new Error("Failed to delete keyword");
                        }
                    }
                }}
            />
        </div>
    );
}
