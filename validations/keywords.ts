import { z } from "zod";

export const KeywordSchema = z.object({
    id: z.string(),
    keyword: z.string().min(1, "Keyword is required").max(100, "Keyword too long"),
});

export type Keyword = z.infer<typeof KeywordSchema>;
