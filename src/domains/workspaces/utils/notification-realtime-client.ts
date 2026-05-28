"use client";

import { io } from "socket.io-client";

import {
  NOTIFICATION_REALTIME_NAMESPACE,
  NOTIFICATION_REALTIME_RECONNECTION_ATTEMPTS,
} from "@/domains/workspaces/constants/notification-realtime";
import type { NotificationRealtimeSocket } from "@/domains/workspaces/types/notification-realtime";
import { API_HOST } from "@/shared/constants/env";

export function getNotificationRealtimeUrl() {
  return new URL(NOTIFICATION_REALTIME_NAMESPACE, API_HOST).toString();
}

export function createNotificationRealtimeSocket(accessToken?: string): NotificationRealtimeSocket {
  return io(getNotificationRealtimeUrl(), {
    autoConnect: false,
    auth: accessToken ? { token: accessToken } : {},
    reconnectionAttempts: NOTIFICATION_REALTIME_RECONNECTION_ATTEMPTS,
    withCredentials: true,
  }) as NotificationRealtimeSocket;
}
