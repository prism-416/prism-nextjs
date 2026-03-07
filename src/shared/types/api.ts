import { AxiosRequestConfig } from "axios";
import { ApiVersion } from "@/shared/types/domain";

/**
 * @description 예외 코드 (Spec 30.x)
 * 기존 정의를 무시하고, 아래 도메인별 코드를 모두 포함합니다.
 */
type ErrorType =
  // 30.2. 공통 에러 코드
  | "E500" // 서버 내부 오류가 발생했습니다.
  | "E400" // 잘못된 요청입니다.
  | "E401" // 인증이 필요합니다.
  | "E403" // 접근 권한이 없습니다.
  | "E404" // 요청한 리소스를 찾을 수 없습니다.
  | "E2000" // 필수 필드가 누락되었습니다.
  | "E2002" // 필드 데이터 타입 에러
  | "E2003" // 필드 유효성 에러
  // 30.3. 회원 도메인 에러 코드
  | "U001" // 이메일 중복 오류
  // 30.4. 카트 도메인 에러 코드
  | "P101" // CART_DUPLICATE
  | "P102" // CART_UNAVAILABLE_OPTION
  // 30.5. 프로모코드 도메인 에러 코드
  | "P301" // UNIVERSAL_CODE_INACTIVE_STATUS
  | "P302" // UNIVERSAL_CODE_NOT_INVALID_DATE_RANGE
  | "P303" // UNIVERSAL_CODE_INVALID_USER_TARGET
  | "P304" // UNIVERSAL_CODE_MIN_ORDER_AMOUNT_NOT_SATISFIED
  | "P305" // UNIVERSAL_CODE_USAGE_COUNT_LIMIT_EXCEEDED
  // 30.6. 쿠폰 도메인 에러 코드
  | "P201" // Coupon has already been used.
  | "P202" // Coupon is not within valid usage period.
  | "P203" // Coupon is not within valid issuance period.
  | "P204" // User does not own this coupon.
  | "P205" // Coupon type mismatch.
  | "P206" // Coupon is not applicable to the specified product.
  | "P207" // Minimum order amount not satisfied.
  | "P208" // Discount amount is incorrect.
  | "P209" // Coupon is not in ACTIVE status.
  | "P210" // Coupon is not for a specified target product.
  | "P211" // Invalid delivery type for free delivery coupon.
  | "P212" // Coupon has already been downloaded by this user.
  | "P213" // Coupon print method does not match requested method.
  // 30.7. 리뷰 도메인 에러 코드
  | "P401" // DUPLICATE_REVIEW
  // 30.8. 주문 도메인 에러 코드
  | "O001"; // 주문 오류 샘플

/**
 * @description 에러 응답 타입
 */
export interface ErrorResponseType<T> {
  code?: ErrorType;
  message?: string;
  data?: T;
}

/**
 * @desc Axios 요청 타입
 */
export interface AxiosRequestType extends AxiosRequestConfig {
  retry?: boolean;
  isSsr?: boolean;
  version?: ApiVersion;
}

/**
 * API 응답 기본 구조
 */
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  code?: string;
}

/**
 * 페이지네이션 응답
 */
export interface PageResponse<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
}
