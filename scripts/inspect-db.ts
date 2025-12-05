import { sql } from "@/lib/db";

async function inspect() {
  console.log("Inspecting users table...");
  try {
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users';
    `;
    console.log("Columns:", columns);

    const users = await sql`SELECT * FROM users LIMIT 5`;
    console.log("Users:", users);

  } catch (e) {
    console.error(e);
  }
}

inspect();

