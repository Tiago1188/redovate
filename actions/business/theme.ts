'use server';

import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  [key: string]: string;
}

export interface ThemeData {
  font: string;
  colors: ThemeColors;
  themeId?: string;
}

export async function updateBusinessTheme(businessId: string, themeData: ThemeData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify ownership
    const ownershipCheck = await sql`
      SELECT b.id 
      FROM businesses b
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ${businessId} AND u.clerk_id = ${userId}
    `;

    if (ownershipCheck.length === 0) {
      throw new Error("Unauthorized access to business");
    }

    // Update theme
    await sql`
      UPDATE businesses 
      SET theme = ${JSON.stringify(themeData)}, updated_at = now() 
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error updating business theme:", error);
    throw new Error("Failed to update business theme");
  }
}

export async function getBusinessTheme(businessId: string): Promise<ThemeData | null> {
  try {
    const result = await sql`
      SELECT theme FROM businesses WHERE id = ${businessId}
    `;

    if (result.length === 0) {
      return null;
    }

    const theme = result[0].theme;

    // Ensure default structure if theme is empty or partial
    if (!theme || Object.keys(theme).length === 0) {
      return null;
    }

    return theme as ThemeData;
  } catch (error) {
    console.error("Error fetching business theme:", error);
    return null;
  }
}
