import { neon, NeonQueryFunction } from "@neondatabase/serverless";

// Handle missing DATABASE_URL gracefully during build
const createNeonClient = (): NeonQueryFunction<false, false> => {
  if (!process.env.DATABASE_URL) {
    // Return a dummy client during build time
    if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
      console.warn("DATABASE_URL is not set");
    }
    // This will be properly initialized at runtime
    return (() => Promise.resolve([])) as unknown as NeonQueryFunction<false, false>;
  }
  return neon(process.env.DATABASE_URL);
};

export const sql = createNeonClient();

