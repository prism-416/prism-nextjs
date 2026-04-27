export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  accessTokenExpiresIn?: number;
  refreshTokenExpiresIn?: number;
}

export interface AuthSessionResponse {
  authenticated: boolean;
  accessToken?: string;
  isNewUser?: boolean;
  emailVerified?: boolean;
}

export interface AuthSessionPayload extends Partial<AuthTokens> {
  access_token?: string;
  refresh_token?: string;
  expiresIn?: number;
  expires_in?: number;
}

export interface CurrentUser {
  userId: string;
  email: string;
  fullName: string;
  username: string;
}

export interface AuthMeResponse {
  user: CurrentUser;
}
