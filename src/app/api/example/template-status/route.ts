import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { ENV } from "@/shared/constants/env";
import { METADATA } from "@/shared/constants/metadata";
import { getPackageVersion } from "@/shared/utils/server-util";

export async function GET() {
  const cookieStore = await cookies();
  const hasAccessToken = Boolean(cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value);
  const version = await getPackageVersion();

  return NextResponse.json({
    appName: METADATA.siteName,
    version,
    environment: ENV,
    hasAccessToken,
    generatedAt: new Date().toISOString(),
  });
}
