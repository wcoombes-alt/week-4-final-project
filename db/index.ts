import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: ReturnType<typeof postgres> | undefined;
let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for database operations.");
  }

  client ??= postgres(databaseUrl, { max: 1 });
  database ??= drizzle(client, { schema });

  return database;
}

export function tryGetDb() {
  if (!process.env.DATABASE_URL) {
    return undefined;
  }

  return getDb();
}
