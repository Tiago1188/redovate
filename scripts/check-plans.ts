
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    console.log('Checking users and businesses...');

    const users = await sql`SELECT id, email, plan_type, clerk_id FROM users`;
    console.log('Users:', users);

    const businesses = await sql`SELECT id, business_name, plan_type, user_id FROM businesses`;
    console.log('Businesses:', businesses);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
