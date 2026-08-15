import { pool } from "./index.js";
import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_PATH = path.join(__dirname, "migrations", "001_init.sql");

async function runMigration() {
  const client = await pool.connect();
  try {
    const sql = await fs.readFile(FILE_PATH, "utf-8");
    console.log("[db] Executing Migrations:\n", sql);

    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    console.log("[db] Migration Executed Successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[db] Migration Failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
    console.log("[db] Connection Closed");
  }
}

runMigration();
