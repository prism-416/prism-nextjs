"use client";

import { io } from "socket.io-client";

import {
  NOTIFICATION_REALTIME_NAMESPACE,
  NOTIFICATION_REALTIME_RECONNECTION_ATTEMPTS,
} from "@/domains/workspaces/constants/notification-realtime";
import type { NotificationRealtimeSocket } from "@/domains/workspaces/types/notification-realtime";
import { getSocketIoNamespaceUrl, getSocketIoPath } from "@/shared/utils/socket-io-url";

export function getNotificationRealtimeUrl() {
  return getSocketIoNamespaceUrl(NOTIFICATION_REALTIME_NAMESPACE);
}

export function createNotificationRealtimeSocket(accessToken?: string): NotificationRealtimeSocket {
  return io(getNotificationRealtimeUrl(), {
    autoConnect: false,
    auth: accessToken ? { token: accessToken } : {},
    path: getSocketIoPath(),
    reconnectionAttempts: NOTIFICATION_REALTIME_RECONNECTION_ATTEMPTS,
    withCredentials: true,
  }) as NotificationRealtimeSocket;
}
