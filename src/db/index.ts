import { Pool } from "pg";
import { env } from "../config/env.js";

const isProduction = env.NODE_ENV === "PRODUCTION";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 30_000,
  max: 10,
});

pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
  process.exit(1);
});
