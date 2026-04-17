import { commonAxios } from "@/shared/http/common-axios";
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
  SignUpCreatedUser,
} from "../types";

export async function signInWithGoogle(idToken: string) {
  return commonAxios<GoogleOAuthSignInRequest, ApiResponse<OAuthTokenResult>>({
    url: "/auth/oauth/google",
    method: "POST",
    data: { idToken },
    version: null,
  });
}

export async function signInWithEmail(body: EmailSignInPayload) {
  return commonAxios<EmailSignInPayload, ApiResponse<AccessTokenBundle>>({
    url: "/auth/signin",
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
  return commonAxios<GithubOAuthSignInRequest, ApiResponse<OAuthTokenResult>>({
    url: "/auth/oauth/github",
    method: "POST",
    data: body,
    version: null,
  });
}
