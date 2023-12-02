import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export async function migrateDb() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (DATABASE_URL == null || DATABASE_URL === "") {
    throw new Error("DATABASE_URL is not set");
  }

  console.log("Starting db migrations");

  const migrationClient = postgres(DATABASE_URL, { max: 1 });

  await migrate(drizzle(migrationClient), {
    migrationsFolder: "./migrations",
  });

  console.log("Finished db migrations");

  await migrationClient.end();
}

migrateDb()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
