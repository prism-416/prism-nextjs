"use client";

import { getCurrentUser } from "@/shared/api/auth";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";
import type { CurrentUser } from "@/shared/types/auth";

export function useCurrentUser() {
  return useApiQuery<CurrentUser | undefined>({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
