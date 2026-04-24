import { z } from "zod";

const serverEnvSchema = z.object({
  MONGODB_URI: z
    .string()
    .trim()
    .min(1, "MONGODB_URI is required to connect to MongoDB."),
});

export function getServerEnv() {
  return serverEnvSchema.parse({
    MONGODB_URI: process.env.MONGODB_URI,
  });
}
