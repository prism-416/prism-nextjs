import { NextRequest, NextResponse } from "next/server";

import { API_HOST, JSON_CONTENT_TYPE } from "@/shared/constants/api";
import { applyAuthCookies, clearAuthCookies } from "@/shared/utils/auth-cookie";
import { getAuthTokensFromResponse } from "@/shared/utils/auth-response";

async function readJsonRequestBody(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  return payload;
}

function getUpstreamErrorResponse(payload: Record<string, unknown> | null, status: number) {
  return NextResponse.json(payload ?? { message: "Authentication request failed." }, { status });
}

export async function proxyAuthPost(request: NextRequest, upstreamPath: string) {
  const body = await readJsonRequestBody(request);

  if (!body) {
    return NextResponse.json({ message: "Invalid authentication payload." }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_HOST}${upstreamPath}`, {
      method: "POST",
      headers: {
        "Content-Type": JSON_CONTENT_TYPE,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    const tokens = getAuthTokensFromResponse(payload, response.headers);

    if (response.status === 401 || response.status === 403) {
      return clearAuthCookies(getUpstreamErrorResponse(payload, response.status));
    }

    if (!response.ok || !tokens) {
      return getUpstreamErrorResponse(payload, response.ok ? 502 : response.status);
    }

    return applyAuthCookies(NextResponse.json(payload, { status: response.status }), tokens);
  } catch {
    return NextResponse.json({ message: "Authentication request failed." }, { status: 502 });
  }
}
