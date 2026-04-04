import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";

interface GoogleSignInRequest {
  credential: string;
  idToken: string;
}

export interface GoogleSignInResult {
  newUser?: boolean;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresIn?: number;
  refreshTokenExpiresIn?: number;
  emailVerified?: boolean;
}

export async function signInWithGoogle(credential: string) {
  return commonAxios<GoogleSignInRequest, ApiResponse<GoogleSignInResult>>({
    url: "/auth/oauth/google",
    method: "POST",
    data: { credential, idToken: credential },
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
