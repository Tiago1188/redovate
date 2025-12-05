"use server";

import { sql } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { User, PlanType } from "@/types";

export async function getUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const result = await sql`
      SELECT * FROM users WHERE clerk_id = ${userId}
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0] as User;
  } catch (error) {
    console.error("Database error in getUser:", error);
    return null;
  }
}

export async function syncUser(): Promise<User | null> {
  try {
    const user = await currentUser();
    if (!user) {
      console.log("syncUser: No user found in Clerk context");
      return null;
    }

    // DEBUG: Check DB connection status
    if (!process.env.DATABASE_URL) {
      console.error("CRITICAL: DATABASE_URL is not set in syncUser environment!");
    }

    // Try to get existing user first
    const existingUser = await getUser();
    if (existingUser) return existingUser;

    // Determine email
    const primaryEmailId = user.primaryEmailAddressId;
    const emailObject = user.emailAddresses.find(e => e.id === primaryEmailId);
    const email = emailObject?.emailAddress || user.emailAddresses[0]?.emailAddress;

    if (!email) {
      console.error("syncUser: No email address found for user", user.id);
      return null;
    }

    // Determine name
    const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || null;

    // Insert new user
    const result = await sql`
      INSERT INTO users (clerk_id, email, full_name, role, plan_type)
      VALUES (${user.id}, ${email}, ${fullName}, 'user', NULL)
      ON CONFLICT (clerk_id) DO UPDATE 
      SET email = EXCLUDED.email, 
          full_name = EXCLUDED.full_name,
          last_login = now()
      RETURNING *
    `;

    if (result.length === 0) {
      console.error("syncUser: Insert returned no rows. This likely means the database connection is using the dummy client (DATABASE_URL missing).");
      return null;
    }

    return result[0] as User;
  } catch (error) {
    console.error("syncUser: Error syncing user:", error);
    return null;
  }
}

export async function updateUserPlan(plan: PlanType): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Ensure user exists first
    const user = await syncUser();
    if (!user) {
      return { success: false, error: "User not found or could not be synced" };
    }

    await sql`
      UPDATE users 
      SET plan_type = ${plan}, updated_at = now()
      WHERE clerk_id = ${userId}
    `;

    // Revalidate the entire application to ensure the user state is fresh everywhere
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Error updating user plan:", error);
    return { success: false, error: "Failed to update plan" };
  }
}
