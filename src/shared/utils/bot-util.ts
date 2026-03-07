/**
 * @description 봇 여부
 * @param userAgent
 * @returns boolean
 */
export function getIsBot(userAgent: string | null): boolean {
  if (!userAgent) return false;

  // 허용 되는 봇
  const combinedBotPattern = new RegExp(
    ["Googlebot", "Bingbot", "YandexBot", "NaverBot", "Daumoa", "Yeti", "Slurp", "DuckDuckBot"].join("|"),
    "i",
  );

  return combinedBotPattern.test(userAgent);
}
