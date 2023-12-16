import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (DATABASE_URL == null || DATABASE_URL === "") {
  throw new Error("DATABASE_URL is not set");
}

const queryClient = postgres(DATABASE_URL);

export const db = drizzle(queryClient);
