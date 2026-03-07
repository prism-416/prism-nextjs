import { AxiosError } from "axios";
import { ErrorResponseType } from "@/shared/types/api";

export interface ApiError extends AxiosError {
  data?: ErrorResponseType<unknown>;
}

export function handleApiError(error: ApiError, $alert: (message: string) => void) {
  console.log("HandleApiError", error);

  if (error.status === 500 || (error.status === 400 && !error.data?.code)) {
    $alert("We couldn't process your request.");
  }
}

/**
 * @description 에러 파싱 함수
 */
export function errorParsing(err: unknown): ErrorResponseType<unknown> {
  const error = err as AxiosError & { data: unknown };
  return error?.data as ErrorResponseType<unknown>;
}
