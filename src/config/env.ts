import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["DEVELOPMENT", "PRODUCTION", "TEST"])
    .default("DEVELOPMENT"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environtment variables configuration",
    JSON.stringify(parsedEnv.error.format(), null, 2),
  );
  process.exit(1);
}

export const env = parsedEnv.data;
