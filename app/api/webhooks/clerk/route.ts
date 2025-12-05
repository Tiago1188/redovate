import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local", {
      status: 500,
    });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    if (!id || !email_addresses) {
      return new Response("Error occured -- missing data", {
        status: 400,
      });
    }

    const email = email_addresses[0]?.email_address;
    const fullName = `${first_name || ""} ${last_name || ""}`.trim() || null;

    // Use sql to upsert the user
    try {
      await sql`
        INSERT INTO users (clerk_id, email, full_name, role, plan_type)
        VALUES (${id}, ${email}, ${fullName}, 'user', NULL)
        ON CONFLICT (clerk_id) DO UPDATE 
        SET email = EXCLUDED.email, 
            full_name = EXCLUDED.full_name,
            last_login = now(),
            updated_at = now();
      `;
      console.log(`User ${id} synced successfully via webhook.`);
    } catch (error) {
      console.error("Error syncing user via webhook:", error);
      return new Response("Error syncing user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (!id) {
        return new Response("Error occured -- missing data", {
            status: 400,
        });
    }

    try {
        await sql`DELETE FROM users WHERE clerk_id = ${id}`;
        console.log(`User ${id} deleted via webhook.`);
    } catch (error) {
        console.error("Error deleting user via webhook:", error);
        return new Response("Error deleting user", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}

