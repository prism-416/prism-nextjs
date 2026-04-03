"use server";

import { readFileSync } from "fs";
import { join } from "path";
import { headers } from "next/headers";
import { IS_LOCAL, IS_PROD, SITE_URL } from "@/shared/constants/env";
import { SERVER_ENV } from "@/shared/constants/server-env";
import { getSelectorDevice } from "@/shared/utils/user-agent-util";
import { getIsBot } from "@/shared/utils/bot-util";
import { NextRequest } from "next/server";

export interface ServerInitDataType {
  deviceInfo: ServerDeviceInfoType | null;
  // session: Session | null;
  googleClientId?: string;
  version: string;
  // gnbMenu: GnbMenusContextType | null;
  // userProfile: ServerUserProfileType;
}

// canonical url 요청 타입
export type CanonicalUrlParamsType = {
  uri?: string; // 캐노니컬 혹은 og:url에 들어갈 uri
};

// Robot Content type
export type RobotsContentType = "index, follow" | "index, nofollow" | "noindex, nofollow" | "noindex, follow";

// 디바이스 정보 타입
export type ServerDeviceInfoType = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSafari: boolean;
  isIos: boolean;
  isAos: boolean;
  isBot: boolean;
  // theme: ThemeName;
};

const defaultServerDeviceInfo: ServerDeviceInfoType = {
  isMobile: false,
  isTablet: false,
  isDesktop: false,
  isSafari: false,
  isIos: false,
  isAos: false,
  isBot: false,
};

/**
 * @description 서버의 디바이스 정보
 */
export const getServerDeviceInfo = async (): Promise<ServerDeviceInfoType> => {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent");

  if (!userAgent) return defaultServerDeviceInfo;

  const device = getSelectorDevice(userAgent);

  if (!device) {
    return defaultServerDeviceInfo;
  }

  const { isAndroid: isAos, isIOS: isIos, isMobile, isTablet, isDesktop, isSafari } = device;
  const isBot = getIsBot(userAgent);

  return { ...defaultServerDeviceInfo, isAos, isIos, isDesktop, isTablet, isMobile, isSafari, isBot };
};

/**
 * @description 서버의 유저 정보
 */
// export const getServerSession = async (): Promise<Session | null> => {
//   return auth();
// };

/**
 * @description canonical url 가져오기
 */
export const getCanonicalUrl = async ({ uri }: CanonicalUrlParamsType = {}) => {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");
  const defaultUrl = host ? `${protocol}://${host}` : SITE_URL;
  return uri ? `${defaultUrl}${uri}` : defaultUrl;
};

/**
 * @description 로봇 색인 정보 가져오기
 */
export const getRobots = async (robots: RobotsContentType): Promise<RobotsContentType> => {
  if (!IS_PROD) {
    return "noindex, nofollow";
  }

  return robots;
};

/**
 * @description 호스트 가져오기
 * @param request
 */
export const getHost = async (request?: NextRequest) => {
  if (request) {
    return request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
  }

  const headerList = await headers();

  return headerList.get("x-forwarded-host") || headerList.get("host") || "localhost:3000";
};

/**
 * @description 프로토콜 가져오기
 */
export const getProtocol = async (request?: NextRequest) => {
  if (request) {
    return request.headers.get("x-forwarded-proto") || "http";
  }

  const headerList = await headers();

  return headerList.get("x-forwarded-proto") || "http";
};

/**
 * @description Base Url 가져오기
 */
export const getBaseUrl = async (request?: NextRequest) => {
  if (request) {
    return `${await getProtocol(request)}://${await getHost(request)}`;
  }

  return `${await getProtocol()}://${await getHost()}`;
};

/**
 * @description 서버 URL 가져오기
 */
export const getServerUrl = async (request: NextRequest) => {
  if (!IS_LOCAL) {
    const host = await getHost(request);
    const protocol = await getProtocol(request);
    const baseUrl = `${protocol}://${host}`;
    const url = new URL(baseUrl);

    url.port = protocol === "https" ? "443" : protocol === "http" ? "80" : "3000";

    return url;
  }

  return request.nextUrl.clone();
};

/**
 * @description 계정 정보 접근 인증 여부 판단
 * @param token
 * @param expectedUserId
 */
export async function verifySignedToken(token?: string, expectedUserId?: string): Promise<boolean> {
  if (!token || !expectedUserId) return false;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [payloadStr, signature] = decoded.split("|");
    const payload = JSON.parse(payloadStr);

    const encoder = new TextEncoder();
    const keyData = encoder.encode(SERVER_ENV.PASSWORD_VERIFY_SECRET);
    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, [
      "sign",
      "verify",
    ]);

    const sigBuffer = encoder.encode(payloadStr);
    const sigToCompare = Buffer.from(signature, "hex");

    const expectedSigBuffer = await crypto.subtle.sign("HMAC", key, sigBuffer);
    const expectedSig = Buffer.from(expectedSigBuffer);

    const isValid =
      Buffer.compare(expectedSig, sigToCompare) === 0 &&
      payload.userId === expectedUserId &&
      Date.now() - payload.ts <= 10 * 60 * 1000;

    if (!isValid) throw new Error("Token invalid or expired");

    return true;
  } catch (err) {
    throw new Error(`verifySignedToken failed: ${(err as Error).message}`);
  }
}

/**
 * @description package.json에서 버전 정보 가져오기
 * @returns {string} 버전 정보
 */
export async function getPackageVersion(): Promise<string> {
  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8")) as { version: string };
    const { version } = pkg;
    return version || "unknown";
  } catch {
    return "unknown";
  }
}
