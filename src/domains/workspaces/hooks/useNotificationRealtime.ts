"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { NOTIFICATION_REALTIME_EVENTS } from "@/domains/workspaces/constants/notification-realtime";
import type { Notification, NotificationSearchResult, Workspace } from "@/domains/workspaces/types";
import type {
  NotificationRealtimeErrorPayload,
  NotificationRealtimeSocket,
} from "@/domains/workspaces/types/notification-realtime";
import { prependNotificationToCache } from "@/domains/workspaces/utils/notification-cache";
import { createNotificationRealtimeSocket } from "@/domains/workspaces/utils/notification-realtime-client";
import { syncWorkspaceUpdated } from "@/domains/workspaces/utils/workspace-realtime-cache";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { QUERY_KEYS } from "@/shared/query/queryKeys";
import { getCookie } from "@/shared/utils/cookie";

type NotificationRealtimeStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

export function useNotificationRealtime() {
  const queryClient = useQueryClient();
  const [status, setStatus] = React.useState<NotificationRealtimeStatus>("idle");
  const [lastError, setLastError] = React.useState<NotificationRealtimeErrorPayload | null>(null);

  React.useEffect(() => {
    const accessToken = getCookie(ACCESS_TOKEN_COOKIE_NAME);

    if (!accessToken) {
      setStatus("error");
      setLastError({
        code: "WEBSOCKET_MISSING_ACCESS_TOKEN",
        message: "Missing websocket access token.",
      });
      return undefined;
    }

    setStatus("connecting");
    setLastError(null);

    const socket: NotificationRealtimeSocket = createNotificationRealtimeSocket(accessToken);

    const handleConnect = () => {
      setStatus("connected");
    };

    const handleDisconnect = () => {
      setStatus("disconnected");
    };

    const handleConnectError = (error: Error) => {
      setStatus("error");
      setLastError({
        code: "WEBSOCKET_CONNECT_ERROR",
        message: error.message,
      });
    };

    const handleException = (payload: NotificationRealtimeErrorPayload) => {
      setStatus("error");
      setLastError(payload);
    };

    const handleNotificationCreated = (payload: Notification) => {
      queryClient.setQueriesData<NotificationSearchResult>(
        {
          queryKey: QUERY_KEYS.workspace.notifications(),
        },
        previous => prependNotificationToCache(previous, payload),
      );
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.workspace.notifications(),
      });
    };

    const handleWorkspaceAdded = (payload: Workspace & { recipientUserId: string }) => {
      const workspace: Workspace = {
        workspaceId: payload.workspaceId,
        ownerId: payload.ownerId,
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        createdAt: payload.createdAt,
        memberCount: payload.memberCount,
        projectCount: payload.projectCount,
      };

      syncWorkspaceUpdated(queryClient, workspace);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("exception", handleException);
    socket.on(NOTIFICATION_REALTIME_EVENTS.NOTIFICATION_CREATED, handleNotificationCreated);
    socket.on(NOTIFICATION_REALTIME_EVENTS.WORKSPACE_ADDED, handleWorkspaceAdded);
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return {
    lastError,
    status,
  };
}
