import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_ENV: z.enum(["local", "develop", "stage", "production"]).default("local"),
  NEXT_PUBLIC_API_HOST: z.url("NEXT_PUBLIC_API_HOST must be a valid URL."),
  NEXT_PUBLIC_SITE_URL: z.url("NEXT_PUBLIC_SITE_URL must be a valid URL."),
});

const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

export const ENV = publicEnv.NEXT_PUBLIC_ENV;
export const API_HOST = publicEnv.NEXT_PUBLIC_API_HOST;
export const SITE_URL = publicEnv.NEXT_PUBLIC_SITE_URL;

export const IS_PROD = ENV === "production";
export const IS_STAGE = ENV === "stage";
export const IS_DEV = ENV === "develop";
export const IS_LOCAL = ENV === "local";
export const IS_SERVER = typeof window === "undefined";
