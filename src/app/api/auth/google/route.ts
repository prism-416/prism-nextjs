import { NextRequest, NextResponse } from "next/server";

import { applyAuthCookies } from "@/shared/utils/auth-cookie";
import { getGoogleIdTokenSigninEndpoint, normalizeAuthTokens } from "@/shared/utils/auth-token";

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as { credential?: string } | null;
  const credential = payload?.credential?.trim();

  if (!credential) {
    return NextResponse.json({ message: "Google ID token is required." }, { status: 400 });
  }

  try {
    const response = await fetch(getGoogleIdTokenSigninEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        credential,
        idToken: credential,
      }),
      cache: "no-store",
    });

    const responsePayload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

    if (!response.ok) {
      console.error("[POST /api/auth/google] Backend returned", response.status, response.statusText, responsePayload);
      return NextResponse.json(
        {
          message: (responsePayload?.message as string) || "Failed to exchange Google ID token.",
        },
        { status: response.status },
      );
    }

    const data = (responsePayload?.data as Record<string, unknown> | undefined) || responsePayload || undefined;
    const tokens = normalizeAuthTokens(data);

    if (!tokens) {
      console.error("[POST /api/auth/google] Could not extract tokens from backend response:", responsePayload);
      return NextResponse.json(
        {
          message: "Failed to exchange Google ID token.",
        },
        { status: 401 },
      );
    }

    const nextResponse = NextResponse.json({
      authenticated: true,
      accessToken: tokens.accessToken,
      isNewUser: data?.isNewUser === true,
    });

    return applyAuthCookies(nextResponse, tokens);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to exchange Google ID token.",
      },
      { status: 500 },
    );
  }
}
