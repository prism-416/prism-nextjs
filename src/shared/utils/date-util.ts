import { format, parseISO } from "date-fns";

/**
 * 주어진 날짜를 YYYY-MM-DD 형식의 문자열로 반환합니다.
 */
export const formatToId = (date: Date | string | number = new Date()): string => {
  return format(new Date(date), "yyyy-MM-dd");
};

/**
 * YYYY-MM-DD 형식의 문자열을 Date 객체로 변환합니다.
 */
export const parseIdToDate = (id: string): Date => {
  return parseISO(id);
};

/**
 * 오늘 날짜를 YYYY-MM-DD 형식의 문자열로 반환합니다.
 */
export const getTodayId = (): string => {
  return formatToId(new Date());
};

/**
 * 주어진 날짜를 YYYY-MM-DD 형식으로 변환합니다. (호환성 유지)
 */
export const formatDateToId = (date: Date): string => {
  return formatToId(date);
};
