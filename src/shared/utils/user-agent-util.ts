import { getSelectorsByUserAgent } from "react-device-detect";

/**
 * @description selector user agent 타입
 */
type SelectorByUserAgentType = {
  isSmartTV: boolean;
  isConsole: boolean;
  isWearable: boolean;
  isEmbedded: boolean;
  isMobileSafari: boolean;
  isChromium: boolean;
  isMobile: boolean;
  isMobileOnly: boolean;
  isTablet: boolean;
  isBrowser: boolean;
  isDesktop: boolean;
  isAndroid: boolean;
  isWinPhone: boolean;
  isIOS: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isOpera: boolean;
  isIE: boolean;
  osVersion: string; // '13';
  osName: string; // 'Android';
  fullBrowserVersion: string; // '116.0.0.0';
  browserVersion: string; // '116';
  browserName: string; // 'Chrome';
  mobileVendor: string; // 'Samsung';
  mobileModel: string; // 'SM-G981B';
  engineName: string; // 'Blink';
  engineVersion: string; // '116.0.0.0';
  getUA: string; // 'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36';
  isEdge: boolean;
  isYandex: boolean;
  deviceType: string; // 'mobile';
  isIOS13: boolean;
  isIPad13: boolean;
  isIPhone13: boolean;
  isIPod13: boolean;
  isElectron: boolean;
  isEdgeChromium: boolean;
  isLegacyEdge: boolean;
  isWindows: boolean;
  isMacOs: boolean;
  isMIUI: boolean;
  isSamsungBrowser: boolean;
};

/**
 * @description 서버의 디바이스 정보 가져오기
 */
export const getSelectorDevice = (ua: string | null): SelectorByUserAgentType | null => {
  if (!ua) {
    console.error("유저 에이전트가 존재하지 않습니다.");

    return null;
  }
  return getSelectorsByUserAgent(ua);
};
