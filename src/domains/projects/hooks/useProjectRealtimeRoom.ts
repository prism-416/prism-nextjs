"use client";

import * as React from "react";

import { PROJECT_REALTIME_EVENTS } from "@/domains/projects/constants/realtime";
import type { ProjectRealtimeErrorPayload, ProjectRealtimeSocket } from "@/domains/projects/types/realtime";
import { createProjectRealtimeSocket } from "@/domains/projects/utils/realtime-client";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { getCookie } from "@/shared/utils/cookie";

type ProjectRealtimeRoomStatus = "idle" | "connecting" | "connected" | "joined" | "disconnected" | "error";

type UseProjectRealtimeRoomParams = {
  projectId: string;
};

export function useProjectRealtimeRoom({ projectId }: UseProjectRealtimeRoomParams) {
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

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("exception", handleException);
    socket.on(PROJECT_REALTIME_EVENTS.PROJECT_JOINED, handleProjectJoined);
    socket.connect();

    return () => {
      if (socket.connected) {
        socket.emit(PROJECT_REALTIME_EVENTS.PROJECT_LEAVE, { projectId });
      }

      socket.disconnect();
    };
  }, [projectId]);

  return {
    lastError,
    status,
  };
}
