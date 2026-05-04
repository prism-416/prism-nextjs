"use client";

import { ApiError, handleApiError } from "@/shared/lib/errorHandler";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

interface Props {
  children: React.ReactNode;
}

/**
 * @desc TanStack query provider
 */
export default function TanStackQueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error: unknown) => {
              const err = error as ApiError;
              const status = err?.status;
              if (status === 404 || err?.data?.code === "E404") {
                console.log("404 에러는 재시도하지 않음.");
                // 404 에러는 재시도하지 않음
                return false;
              }
              return failureCount < 3; // 최대 3번 재시도
            },
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프, 최대 30초
            refetchOnWindowFocus: false, // 창 포커스 시 자동 리페치 비활성화
            refetchOnReconnect: true, // 오프라인 → 온라인 복귀 시 refetch
            staleTime: 60 * 1000, // 1분 (데이터가 신선하게 유지되는 시간)
            gcTime: 5 * 60 * 1000, // 5분 (메모리에서 데이터 삭제까지의 시간)
          },
          mutations: {
            retry: 3, // 변이 작업도 최대 3번 재시도
            onError: (error: unknown) => handleApiError(error as ApiError, message => console.log(message)),
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
