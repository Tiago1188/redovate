import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    const client = await pool.connect();
    try {
        const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema...');
        await client.query(schemaSql);
        console.log('Schema applied successfully.');
    } catch (err) {
        console.error('Error applying schema:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
