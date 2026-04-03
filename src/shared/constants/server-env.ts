import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  AUTH_REFRESH_PATH: z.string().min(1, "AUTH_REFRESH_PATH is required."),
  AUTH_LOGOUT_PATH: z.string().min(1, "AUTH_LOGOUT_PATH is required."),
  AUTH_GOOGLE_SIGNIN_PATH: z.string().min(1, "AUTH_GOOGLE_SIGNIN_PATH is required.").optional(),
  PASSWORD_VERIFY_SECRET: z.string().min(1, "PASSWORD_VERIFY_SECRET is required."),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required.").optional(),
});

export const SERVER_ENV = serverEnvSchema.parse({
  AUTH_REFRESH_PATH: process.env.AUTH_REFRESH_PATH,
  AUTH_LOGOUT_PATH: process.env.AUTH_LOGOUT_PATH,
  AUTH_GOOGLE_SIGNIN_PATH: process.env.AUTH_GOOGLE_SIGNIN_PATH,
  PASSWORD_VERIFY_SECRET: process.env.PASSWORD_VERIFY_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
});
