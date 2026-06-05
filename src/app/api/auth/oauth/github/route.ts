import { NextRequest } from "next/server";

import { proxyAuthPost } from "@/app/api/auth/_utils/upstream-auth";

export async function POST(request: NextRequest) {
  return proxyAuthPost(request, "/auth/oauth/github");
}
