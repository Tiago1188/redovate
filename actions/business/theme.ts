'use server';

import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";

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
    const ownershipCheck = await pool.query(
      `SELECT b.id 
       FROM businesses b
       JOIN users u ON b.user_id = u.id
       WHERE b.id = $1 AND u.clerk_id = $2`,
      [businessId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      throw new Error("Unauthorized access to business");
    }

    // Update theme
    await pool.query(
      `UPDATE businesses 
       SET theme = $1, updated_at = now() 
       WHERE id = $2`,
      [JSON.stringify(themeData), businessId]
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating business theme:", error);
    throw new Error("Failed to update business theme");
  }
}

export async function getBusinessTheme(businessId: string): Promise<ThemeData | null> {
  try {
    const result = await pool.query(
      `SELECT theme FROM businesses WHERE id = $1`,
      [businessId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const theme = result.rows[0].theme;
    
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

