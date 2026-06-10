"use client";

import { ApiError, handleApiError } from "@/shared/lib/errorHandler";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

interface Props {
  children: React.ReactNode;
}

const DEFAULT_QUERY_STALE_TIME_MS = 5 * 60 * 1000;
const DEFAULT_QUERY_GC_TIME_MS = 30 * 60 * 1000;

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
            staleTime: DEFAULT_QUERY_STALE_TIME_MS,
            gcTime: DEFAULT_QUERY_GC_TIME_MS,
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
