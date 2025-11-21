import { Pool } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
    throw new Error(
        'DATABASE_URL is not defined. Please create a .env.local file in the root directory with:\n' +
        'DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require\n\n' +
        'Get your database URL from Neon (https://neon.tech) or your PostgreSQL provider.'
    );
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;
