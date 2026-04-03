import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  PASSWORD_VERIFY_SECRET: z.string().min(1, "PASSWORD_VERIFY_SECRET is required."),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required.").optional(),
});

export const SERVER_ENV = serverEnvSchema.parse({
  PASSWORD_VERIFY_SECRET: process.env.PASSWORD_VERIFY_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
});
