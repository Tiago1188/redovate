
import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    console.log('Checking users and businesses...');
    
    const users = await pool.query('SELECT id, email, plan_type, clerk_id FROM users');
    console.log('Users:', users.rows);

    const businesses = await pool.query('SELECT id, business_name, plan_type, user_id FROM businesses');
    console.log('Businesses:', businesses.rows);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

main();

