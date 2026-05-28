"use client";

import { useQueryClient } from "@tanstack/react-query";

import { clearNotification, markAllNotificationsRead, markNotificationRead } from "@/domains/workspaces/api";
import type { Notification, NotificationSearchResult } from "@/domains/workspaces/types";
import {
  markAllNotificationsReadInCache,
  markNotificationReadInCache,
  removeNotificationFromCache,
} from "@/domains/workspaces/utils/notification-cache";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

export function useNotificationActions() {
  const queryClient = useQueryClient();

  const updateCache = (
    updater: (previous: NotificationSearchResult | undefined) => NotificationSearchResult | undefined,
  ) => {
    queryClient.setQueriesData<NotificationSearchResult>({ queryKey: QUERY_KEYS.workspace.notifications() }, updater);
  };

  const readMutation = useApiMutation<Notification | undefined, Error, string>({
    mutationFn: markNotificationRead,
    onSuccess: (_notification, notificationId) => {
      updateCache(previous => markNotificationReadInCache(previous, notificationId));
    },
  });

  const readAllMutation = useApiMutation<void, Error, void>({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      updateCache(markAllNotificationsReadInCache);
    },
  });

  const clearMutation = useApiMutation<void, Error, string>({
    mutationFn: clearNotification,
    onSuccess: (_void, notificationId) => {
      updateCache(previous => removeNotificationFromCache(previous, notificationId));
    },
  });

  return {
    readNotification: readMutation.mutateAsync,
    readAllNotifications: readAllMutation.mutateAsync,
    clearNotification: clearMutation.mutateAsync,
    isMarkingAllRead: readAllMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}
