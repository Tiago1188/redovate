'use client';

import { Edit, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Keyword } from "@/validations/keywords";

interface KeywordsTableProps {
    keywords: Keyword[];
    onEdit: (keyword: Keyword) => void;
    onDelete: (keyword: string) => void;
}

export function KeywordsTable({ keywords, onEdit, onDelete }: KeywordsTableProps) {
    if (keywords.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10">
                <h3 className="mt-2 text-lg font-semibold">No keywords added</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                    Add keywords to help customers find your business online.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Keyword</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {keywords.map((keyword) => (
                        <TableRow key={keyword.id}>
                            <TableCell className="font-medium">
                                <Badge variant="secondary" className="text-sm font-normal px-3 py-1">
                                    {keyword.keyword}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(keyword)}
                                        className="h-8 px-2 lg:px-3"
                                    >
                                        <Edit className="mr-2 h-3 w-3" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(keyword.keyword)}
                                        className="h-8 px-2 lg:px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="mr-2 h-3 w-3" />
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
