import type { Socket } from "socket.io-client";

import type { NOTIFICATION_REALTIME_EVENTS } from "@/domains/workspaces/constants/notification-realtime";
import type { Notification } from "@/domains/workspaces/types";

export type NotificationRealtimeErrorPayload = {
  code: string;
  message: string;
};

export type NotificationRealtimeServerToClientEvents = {
  exception: (payload: NotificationRealtimeErrorPayload) => void;
  [NOTIFICATION_REALTIME_EVENTS.NOTIFICATION_CREATED]: (payload: Notification) => void;
};

export type NotificationRealtimeClientToServerEvents = Record<string, never>;

export type NotificationRealtimeSocket = Socket<
  NotificationRealtimeServerToClientEvents,
  NotificationRealtimeClientToServerEvents
>;
