import { API_HOST } from "@/shared/constants/env";

export { API_HOST } from "@/shared/constants/env";

// Content-Type (JSON)
export const JSON_CONTENT_TYPE = "application/json";

// Multipart
export const MULTIPART_CONTENT_TYPE = "multipart/form-data";

// x-www-form-urlencoded
export const X_WWW_FORM_CONTENT_TYPE = "application/x-www-form-urlencoded";

// Content-Type (JSON)
export const OCTET_STREAM_TYPE = "application/octet-stream";

// Bearer 토큰 타입
export const TOKEN_TYPE_BEARER = "Bearer";

// Social Login Endpoints
export const GOOGLE_LOGIN_URL = `${API_HOST}/api/auth/google/login`;
export const GITHUB_LOGIN_URL = `${API_HOST}/api/auth/github/login`;
