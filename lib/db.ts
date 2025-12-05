import { neon, NeonQueryFunction } from "@neondatabase/serverless";

// Handle missing DATABASE_URL gracefully during build
const createNeonClient = (): NeonQueryFunction<false, false> => {
  if (!process.env.DATABASE_URL) {
    // Return a dummy client during build time
    if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
      console.warn("DATABASE_URL is not set");
    }
    
    // In development, warn loudly if DATABASE_URL is missing
    if (process.env.NODE_ENV !== "production") {
      console.warn("---------------------------------------------------------");
      console.warn("WARNING: DATABASE_URL is not set in environment variables.");
      console.warn("Database operations will return empty results (dummy client).");
      console.warn("Please ensure .env or .env.local contains DATABASE_URL.");
      console.warn("---------------------------------------------------------");
    }

    // This will be properly initialized at runtime
    return (() => Promise.resolve([])) as unknown as NeonQueryFunction<false, false>;
  }
  return neon(process.env.DATABASE_URL);
};

export const sql = createNeonClient();
