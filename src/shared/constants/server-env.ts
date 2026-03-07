import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  AUTH_REFRESH_PATH: z.string().min(1, "AUTH_REFRESH_PATH is required."),
  AUTH_LOGOUT_PATH: z.string().min(1, "AUTH_LOGOUT_PATH is required."),
  PASSWORD_VERIFY_SECRET: z.string().min(1, "PASSWORD_VERIFY_SECRET is required."),
});

export const SERVER_ENV = serverEnvSchema.parse({
  AUTH_REFRESH_PATH: process.env.AUTH_REFRESH_PATH,
  AUTH_LOGOUT_PATH: process.env.AUTH_LOGOUT_PATH,
  PASSWORD_VERIFY_SECRET: process.env.PASSWORD_VERIFY_SECRET,
});
