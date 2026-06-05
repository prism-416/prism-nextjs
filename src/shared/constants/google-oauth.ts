/**
 * Google OAuth client IDs are public. Prefer NEXT_PUBLIC_GOOGLE_CLIENT_ID so the
 * value is available in production client bundles; GOOGLE_CLIENT_ID remains as a
 * server/runtime fallback for local development.
 */
export function resolveGoogleClientId() {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || process.env.GOOGLE_CLIENT_ID?.trim() || undefined;
}
