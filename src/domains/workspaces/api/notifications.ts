import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";

import type {
  Notification,
  NotificationProjectTarget,
  NotificationSearchParams,
  NotificationSearchResult,
} from "../types";

export async function getNotifications(params?: NotificationSearchParams) {
  const response = await commonAxios<NotificationSearchParams | null, ApiResponse<NotificationSearchResult>>({
    url: "/notifications",
    method: "GET",
    data: params ?? null,
    version: null,
  });

  return response?.data ?? { notifications: [], total: 0, unreadCount: 0, limit: params?.limit ?? 20, offset: 0 };
}

export async function markNotificationRead(notificationId: string) {
  const response = await commonAxios<null, ApiResponse<Notification>>({
    url: `/notifications/${encodeURIComponent(notificationId)}/read`,
    method: "PATCH",
    version: null,
  });

  return response?.data;
}

export async function markAllNotificationsRead() {
  await commonAxios<null, ApiResponse<null>>({
    url: "/notifications/read-all",
    method: "PATCH",
    version: null,
  });
}

export async function clearNotification(notificationId: string) {
  await commonAxios<null, ApiResponse<null>>({
    url: `/notifications/${encodeURIComponent(notificationId)}`,
    method: "DELETE",
    version: null,
  });
}

export async function getNotificationProjectTarget(projectId: string) {
  const response = await commonAxios<null, ApiResponse<NotificationProjectTarget>>({
    url: `/projects/${encodeURIComponent(projectId)}`,
    method: "GET",
    version: null,
  });

  return response?.data;
}
