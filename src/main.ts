import express, { Express, Request, Response } from "express";
import { env } from "./config/env.js";
import { pool } from "./db/index.js";

const app: Express = express();

app.use(express.json());

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "OK", database: "CONNECTED" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "ERROR",
      database: "DISCONNECTED",
      message: "Internal Server Error",
    });
  }
});

const server = app.listen(env.PORT, () => {
  console.log(
    `Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`,
  );
});

const shutdown = async () => {
  console.log("Shutting down server...");
  server.close(async () => {
    console.log("HTTP server closed");
    await pool.end();
    console.log("PostgreSQL pool disconnected");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
