import authClient from "@/shared/http/auth-client";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { TOKEN_TYPE_BEARER } from "@/shared/constants/api";
import { deleteCookie } from "@/shared/utils/cookie";

/**
 * ✅ Access Token을 authClient에 설정하는 함수
 */
export function setAuthToken(accessToken: string) {
  if (!accessToken) return;

  authClient.defaults.headers.common.Authorization = `${TOKEN_TYPE_BEARER} ${accessToken}`;
}

/**
 * @description axios에서 특정 쿠키 삭제
 */
export const removeAuthToken = () => {
  if (authClient.defaults.headers.common.Authorization) {
    delete authClient.defaults.headers.common.Authorization;
  }

  if (typeof document !== "undefined") {
    deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
  }
};

/**
 * @description accessToken이 다른지 비교
 */
export const isAccessTokenChanged = (accessToken: string) => {
  return authClient.defaults.headers.common.Authorization !== `${TOKEN_TYPE_BEARER} ${accessToken}`;
};
