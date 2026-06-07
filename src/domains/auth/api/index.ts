import { commonAxios } from "@/shared/http/common-axios";
import { API_HOST, JSON_CONTENT_TYPE } from "@/shared/constants/api";
import type { ApiResponse } from "@/shared/types/api";

import type {
  AccessTokenBundle,
  EmailSignInPayload,
  EmailSignUpPayload,
  EmailVerificationResult,
  GithubOAuthAuthorizeResult,
  GithubOAuthSignInRequest,
  GoogleOAuthSignInRequest,
  OAuthTokenResult,
  RequestEmailVerificationPayload,
  RequestEmailVerificationResult,
  SignUpCreatedUser,
} from "../types";

async function postLocalAuth<TBody, TResult>(url: string, body: TBody) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": JSON_CONTENT_TYPE,
    },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => null)) as ApiResponse<TResult> | null;

  if (!response.ok) {
    return payload ?? { message: "Authentication request failed." };
  }

  return payload;
}

async function postUpstreamAuth<TBody, TResult>(url: string, body: TBody) {
  const response = await fetch(`${API_HOST}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": JSON_CONTENT_TYPE,
    },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => null)) as ApiResponse<TResult> | null;

  if (!response.ok) {
    return payload ?? { message: "Authentication request failed." };
  }

  return payload;
}

export async function signInWithGoogle(idToken: string) {
  return postLocalAuth<GoogleOAuthSignInRequest, OAuthTokenResult>("/api/auth/oauth/google", { idToken });
}

export async function signInWithEmail(body: EmailSignInPayload) {
  return postLocalAuth<EmailSignInPayload, AccessTokenBundle>("/api/auth/signin", body);
}

export async function requestEmailVerification(body: RequestEmailVerificationPayload) {
  return commonAxios<RequestEmailVerificationPayload, ApiResponse<RequestEmailVerificationResult>>({
    url: "/auth/email-verification",
    method: "POST",
    data: body,
    version: null,
  });
}

export async function logout() {
  return commonAxios<null, unknown>({
    url: "/auth/logout",
    method: "POST",
    version: null,
  });
}

export async function checkUsernameAvailability(username: string) {
  await commonAxios<null, unknown>({
    url: `/auth/username/${encodeURIComponent(username)}`,
    method: "GET",
    version: null,
  });
  return true;
}

export async function signUpWithEmail(body: EmailSignUpPayload) {
  return commonAxios<EmailSignUpPayload, ApiResponse<SignUpCreatedUser>>({
    url: "/auth/signup",
    method: "POST",
    data: body,
    version: null,
  });
}

export async function verifyEmail(token: string) {
  return commonAxios<null, ApiResponse<EmailVerificationResult>>({
    url: `/auth/verify?token=${encodeURIComponent(token)}`,
    method: "POST",
    version: null,
  });
}

// --- GitHub OAuth ---

export async function getGithubAuthorizationUrl() {
  return commonAxios<null, ApiResponse<GithubOAuthAuthorizeResult>>({
    url: "/auth/oauth/github/authorize",
    method: "GET",
    version: null,
  });
}

export async function signInWithGithub(body: GithubOAuthSignInRequest) {
  return postUpstreamAuth<GithubOAuthSignInRequest, OAuthTokenResult>("/auth/oauth/github", body);
}
