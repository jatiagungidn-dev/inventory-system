import express, { Express, NextFunction, Request, Response } from "express";
import { env } from "./config/env.js";
import { pool } from "./db/index.js";
import productRouter from "./routes/product.routers.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { AppError } from "./utils/app-errors.js";

export const app: Express = express();

app.use(express.json());

app.use("/api/products", productRouter);

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "success", database: "Connected" });
  } catch (err) {
    console.error("Healthcheck Failed:", err);
    res.status(500).json({
      status: "error",
      database: "Disconnected",
      message: "Internal Server Error",
    });
  }
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(
    `Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`,
  );
});

let isShuttingDown = false;
const shutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`Received ${signal}. Shutting down server...`);

  const forceKillTimeout = setTimeout(() => {
    console.error("Forcefully shutting down due to timeout!");
    process.exit(1);
  }, 10_000);

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    console.log("HTTP server closed");

    await pool.end();
    console.log("PostgreSQL pool disconnected");

    clearTimeout(forceKillTimeout);
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    clearTimeout(forceKillTimeout);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
