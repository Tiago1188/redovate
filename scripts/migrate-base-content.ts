import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

async function addBaseContentColumn() {
    try {
        console.log('Adding base_content column to businesses table...');

        await sql`
      ALTER TABLE businesses
      ADD COLUMN IF NOT EXISTS base_content JSONB DEFAULT '{}'::jsonb;
    `;

        console.log('✅ Successfully added base_content column');
    } catch (error) {
        console.error('Error adding base_content column:', error);
        throw error;
    }
}

addBaseContentColumn();
