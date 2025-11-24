'use server';

import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getBusinessData } from "@/actions/business";
import { exceedsLimit } from "@/lib/plan-limits";
import { getUserPlanType } from "@/actions/user";
import { KeywordSchema, type Keyword } from "@/validations/keywords";

export { type Keyword };

export async function getKeywords() {
    const { userId } = await auth();
    if (!userId) return [];

    const business = await getBusinessData();
    if (!business) return [];

    // Ensure keywords are in the correct format (array of strings)
    const keywords = Array.isArray(business.keywords) ? business.keywords : [];

    // Map to object format for the UI if needed, or keep as strings
    // The UI expects objects with IDs for optimistic updates, so we'll map them
    // Since we store them as strings, we'll generate IDs based on the keyword itself or index
    // But wait, the plan said "Each keyword will be stored as a simple string".
    // However, the validation schema expects an object with ID.
    // Let's stick to the plan: "Each keyword will be stored as a simple string in the JSONB array."
    // But for the UI, we need stable IDs. 
    // Let's return objects with IDs for the client, but store strings in DB.

    return keywords.map((k: string) => ({
        id: k, // Use the keyword itself as ID since they should be unique
        keyword: k
    })) as Keyword[];
}

export async function addKeyword(keyword: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const business = await getBusinessData();
    if (!business) throw new Error("Business not found");

    const planType = await getUserPlanType(userId) || "free";
    const currentKeywords = Array.isArray(business.keywords) ? business.keywords : [];

    if (exceedsLimit(planType, "maxKeywords", currentKeywords.length + 1)) {
        throw new Error("Plan limit reached. Upgrade to add more keywords.");
    }

    // Check for duplicates
    if (currentKeywords.includes(keyword)) {
        throw new Error("Keyword already exists");
    }

    const updatedKeywords = [...currentKeywords, keyword];

    const sql = neon(process.env.DATABASE_URL!);
    await sql`
    UPDATE businesses 
    SET keywords = ${JSON.stringify(updatedKeywords)}, updated_at = now() 
    WHERE id = ${business.id}
  `;

    revalidatePath("/dashboard/keywords");
    return { success: true, keyword: { id: keyword, keyword } };
}

export async function updateKeyword(oldKeyword: string, newKeyword: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const business = await getBusinessData();
    if (!business) throw new Error("Business not found");

    const currentKeywords = Array.isArray(business.keywords) ? business.keywords : [];
    const index = currentKeywords.indexOf(oldKeyword);

    if (index === -1) throw new Error("Keyword not found");

    // Check if new keyword already exists (and it's not the same as the old one)
    if (oldKeyword !== newKeyword && currentKeywords.includes(newKeyword)) {
        throw new Error("Keyword already exists");
    }

    const updatedKeywords = [...currentKeywords];
    updatedKeywords[index] = newKeyword;

    const sql = neon(process.env.DATABASE_URL!);
    await sql`
    UPDATE businesses 
    SET keywords = ${JSON.stringify(updatedKeywords)}, updated_at = now() 
    WHERE id = ${business.id}
  `;

    revalidatePath("/dashboard/keywords");
    return { success: true, keyword: { id: newKeyword, keyword: newKeyword } };
}

export async function deleteKeyword(keywordToDelete: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const business = await getBusinessData();
    if (!business) throw new Error("Business not found");

    const currentKeywords = Array.isArray(business.keywords) ? business.keywords : [];
    const updatedKeywords = currentKeywords.filter(k => k !== keywordToDelete);

    const sql = neon(process.env.DATABASE_URL!);
    await sql`
    UPDATE businesses 
    SET keywords = ${JSON.stringify(updatedKeywords)}, updated_at = now() 
    WHERE id = ${business.id}
  `;

    revalidatePath("/dashboard/keywords");
    return { success: true };
}
