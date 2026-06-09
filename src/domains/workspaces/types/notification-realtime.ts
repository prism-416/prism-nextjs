import type { Socket } from "socket.io-client";

import type { NOTIFICATION_REALTIME_EVENTS } from "@/domains/workspaces/constants/notification-realtime";
import type { Notification, Workspace } from "@/domains/workspaces/types";

export type NotificationRealtimeErrorPayload = {
  code: string;
  message: string;
};

export type NotificationRealtimeServerToClientEvents = {
  exception: (payload: NotificationRealtimeErrorPayload) => void;
  [NOTIFICATION_REALTIME_EVENTS.NOTIFICATION_CREATED]: (payload: Notification) => void;
  [NOTIFICATION_REALTIME_EVENTS.WORKSPACE_ADDED]: (payload: Workspace & { recipientUserId: string }) => void;
};

export type NotificationRealtimeClientToServerEvents = Record<string, never>;

export type NotificationRealtimeSocket = Socket<
  NotificationRealtimeServerToClientEvents,
  NotificationRealtimeClientToServerEvents
>;
