import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";

import type {
  AccessTokenBundle,
  EmailSignInPayload,
  EmailSignUpPayload,
  EmailVerificationResult,
  GoogleOAuthSignInRequest,
  GoogleOAuthSignInResult,
  GoogleSignUpPayload,
  SignUpCreatedUser,
} from "../types";

export async function signInWithGoogle(idToken: string) {
  return commonAxios<GoogleOAuthSignInRequest, ApiResponse<GoogleOAuthSignInResult>>({
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

export async function signUpWithOAuthGoogle(body: GoogleSignUpPayload) {
  return commonAxios<GoogleSignUpPayload, ApiResponse<SignUpCreatedUser>>({
    url: "/auth/oauth/google/signup",
    method: "POST",
    data: body,
    version: null,
  });
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
