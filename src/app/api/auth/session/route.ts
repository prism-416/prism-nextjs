import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { applyAuthCookies, clearAuthCookies } from "@/shared/utils/auth-cookie";
import { normalizeAuthTokens } from "@/shared/utils/auth-token";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  return NextResponse.json({
    authenticated: Boolean(accessToken),
    accessToken: accessToken || undefined,
  });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const tokens = normalizeAuthTokens(payload || undefined);

  if (!tokens) {
    return NextResponse.json({ message: "Invalid auth token payload." }, { status: 400 });
  }

  const response = NextResponse.json({
    authenticated: true,
    accessToken: tokens.accessToken,
  });

  return applyAuthCookies(response, tokens);
}

export async function DELETE() {
  return clearAuthCookies(
    NextResponse.json({
      authenticated: false,
      accessToken: undefined,
    }),
  );
}
