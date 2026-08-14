import { Pool } from "pg";
import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const FILE_PATH = path.join(
  process.cwd(),
  "src",
  "db",
  "migrations",
  "001_init.sql",
);

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL?.includes("localhost")
    ? false
    : {
        rejectUnauthorized: false,
      },
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

async function runMigration(): Promise<void> {
  await pool.query("BEGIN");
  try {
    const sql = await fs.readFile(FILE_PATH, "utf-8");
    console.log("[db] Executing 001_init.sql");

    await pool.query(sql);
    await pool.query("COMMIT");
    console.log("[db] DDL Migration Executed Successfully");
  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
    console.error("[db] Migration Failed", err);
    process.exitCode = 1;
  } finally {
    console.log("[db] Connection Closed");
  }
}

pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
  process.exitCode = 1;
});

runMigration();
