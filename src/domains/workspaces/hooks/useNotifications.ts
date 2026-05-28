"use client";

import { getNotifications } from "@/domains/workspaces/api";
import type { NotificationSearchParams, NotificationSearchResult } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const DEFAULT_NOTIFICATION_LIMIT = 20;

export function useNotifications(params?: NotificationSearchParams) {
  const searchParams = {
    limit: params?.limit ?? DEFAULT_NOTIFICATION_LIMIT,
    offset: params?.offset ?? 0,
    unreadOnly: params?.unreadOnly,
  };

  return useApiQuery<NotificationSearchResult>({
    queryKey: QUERY_KEYS.workspace.notificationList(searchParams),
    queryFn: () => getNotifications(searchParams),
    staleTime: 60 * 1000,
  });
}
