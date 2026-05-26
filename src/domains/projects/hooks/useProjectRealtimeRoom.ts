"use client";

import * as React from "react";

import { useQueryClient } from "@tanstack/react-query";

import { PROJECT_REALTIME_EVENTS } from "@/domains/projects/constants/realtime";
import type {
  ProjectCommentDeletedPayload,
  ProjectCommentPayload,
  ProjectRealtimeErrorPayload,
  ProjectRealtimeSocket,
  ProjectWorkItemDeletedPayload,
  ProjectWorkItemsReorderedPayload,
} from "@/domains/projects/types/realtime";
import type { ProjectWorkItem } from "@/domains/projects/types";
import { createProjectRealtimeSocket } from "@/domains/projects/utils/realtime-client";
import {
  syncProjectCommentCreated,
  syncProjectCommentDeleted,
  syncProjectCommentUpdated,
} from "@/domains/projects/utils/comment-cache";
import {
  syncProjectWorkItemCreated,
  syncProjectWorkItemDeleted,
  syncProjectWorkItemUpdated,
  syncProjectWorkItemsReordered,
} from "@/domains/projects/utils/work-item-cache";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { getCookie } from "@/shared/utils/cookie";

type ProjectRealtimeRoomStatus = "idle" | "connecting" | "connected" | "joined" | "disconnected" | "error";

type UseProjectRealtimeRoomParams = {
  projectId: string;
};

export function useProjectRealtimeRoom({ projectId }: UseProjectRealtimeRoomParams) {
  const queryClient = useQueryClient();
  const [status, setStatus] = React.useState<ProjectRealtimeRoomStatus>("idle");
  const [lastError, setLastError] = React.useState<ProjectRealtimeErrorPayload | null>(null);

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

    const socket: ProjectRealtimeSocket = createProjectRealtimeSocket(accessToken);

    const handleConnect = () => {
      setStatus("connected");
      socket.emit(PROJECT_REALTIME_EVENTS.PROJECT_JOIN, { projectId });
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

    const handleException = (payload: ProjectRealtimeErrorPayload) => {
      setStatus("error");
      setLastError(payload);
    };

    const handleProjectJoined = (payload: { projectId: string }) => {
      if (payload.projectId === projectId) {
        setStatus("joined");
      }
    };

    const handleWorkItemCreated = (payload: ProjectWorkItem) => {
      if (payload.projectId === projectId) {
        syncProjectWorkItemCreated(queryClient, payload);
      }
    };

    const handleWorkItemUpdated = (payload: ProjectWorkItem) => {
      if (payload.projectId === projectId) {
        syncProjectWorkItemUpdated(queryClient, payload);
      }
    };

    const handleWorkItemDeleted = (payload: ProjectWorkItemDeletedPayload) => {
      if (payload.projectId === projectId) {
        syncProjectWorkItemDeleted(queryClient, payload);
      }
    };

    const handleWorkItemsReordered = (payload: ProjectWorkItemsReorderedPayload) => {
      if (payload.projectId === projectId) {
        syncProjectWorkItemsReordered(queryClient, payload.workItems);
      }
    };

    const handleCommentCreated = (payload: ProjectCommentPayload) => {
      if (payload.projectId === projectId) {
        syncProjectCommentCreated(queryClient, payload);
      }
    };

    const handleCommentUpdated = (payload: ProjectCommentPayload) => {
      if (payload.projectId === projectId) {
        syncProjectCommentUpdated(queryClient, payload);
      }
    };

    const handleCommentDeleted = (payload: ProjectCommentDeletedPayload) => {
      if (payload.projectId === projectId) {
        syncProjectCommentDeleted(queryClient, payload);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("exception", handleException);
    socket.on(PROJECT_REALTIME_EVENTS.PROJECT_JOINED, handleProjectJoined);
    socket.on(PROJECT_REALTIME_EVENTS.WORK_ITEM_CREATED, handleWorkItemCreated);
    socket.on(PROJECT_REALTIME_EVENTS.WORK_ITEM_UPDATED, handleWorkItemUpdated);
    socket.on(PROJECT_REALTIME_EVENTS.WORK_ITEMS_REORDERED, handleWorkItemsReordered);
    socket.on(PROJECT_REALTIME_EVENTS.WORK_ITEM_DELETED, handleWorkItemDeleted);
    socket.on(PROJECT_REALTIME_EVENTS.COMMENT_CREATED, handleCommentCreated);
    socket.on(PROJECT_REALTIME_EVENTS.COMMENT_UPDATED, handleCommentUpdated);
    socket.on(PROJECT_REALTIME_EVENTS.COMMENT_DELETED, handleCommentDeleted);
    socket.connect();

    return () => {
      if (socket.connected) {
        socket.emit(PROJECT_REALTIME_EVENTS.PROJECT_LEAVE, { projectId });
      }

      socket.disconnect();
    };
  }, [projectId, queryClient]);

  return {
    lastError,
    status,
  };
}
