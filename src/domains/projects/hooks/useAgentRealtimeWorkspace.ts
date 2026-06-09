"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { AGENT_REALTIME_EVENTS } from "@/domains/projects/constants/agent-realtime";
import type {
  AgentRealtimeErrorPayload,
  AgentRealtimeSocket,
  AgentStepRealtimePayload,
  AgentWorkspaceJoinedPayload,
} from "@/domains/projects/types/agent-realtime";
import type { AgentRun } from "@/domains/projects/types";
import { syncAgentRunCreated, syncAgentRunUpdated, syncAgentStepUpserted } from "@/domains/projects/utils/agent-cache";
import { createAgentRealtimeSocket } from "@/domains/projects/utils/agent-realtime-client";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { QUERY_KEYS } from "@/shared/query";
import { getCookie } from "@/shared/utils/cookie";

export type AgentRealtimeWorkspaceStatus = "idle" | "connecting" | "connected" | "joined" | "disconnected" | "error";

type UseAgentRealtimeWorkspaceParams = {
  workspaceId: string;
};

export function useAgentRealtimeWorkspace({ workspaceId }: UseAgentRealtimeWorkspaceParams) {
  const queryClient = useQueryClient();
  const [status, setStatus] = React.useState<AgentRealtimeWorkspaceStatus>("idle");
  const [lastError, setLastError] = React.useState<AgentRealtimeErrorPayload | null>(null);

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

    const socket: AgentRealtimeSocket = createAgentRealtimeSocket(accessToken);

    const resyncWorkspace = () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.agentRuns(workspaceId),
      });
    };

    const handleConnect = () => {
      setStatus("connected");
      socket.emit(AGENT_REALTIME_EVENTS.AGENT_WORKSPACE_JOIN, { workspaceId });
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

    const handleException = (payload: AgentRealtimeErrorPayload) => {
      setStatus("error");
      setLastError(payload);
    };

    const handleWorkspaceJoined = (payload: AgentWorkspaceJoinedPayload) => {
      if (payload.workspaceId !== workspaceId) {
        return;
      }

      setStatus("joined");
      resyncWorkspace();
    };

    const handleAgentRunCreated = (payload: AgentRun) => {
      if (payload.workspaceId === workspaceId) {
        syncAgentRunCreated(queryClient, payload);
      }
    };

    const handleAgentRunUpdated = (payload: AgentRun) => {
      if (payload.workspaceId === workspaceId) {
        syncAgentRunUpdated(queryClient, payload);
      }
    };

    const handleAgentStepUpserted = (payload: AgentStepRealtimePayload) => {
      if (payload.workspaceId === workspaceId) {
        syncAgentStepUpserted(queryClient, workspaceId, payload);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("exception", handleException);
    socket.on(AGENT_REALTIME_EVENTS.AGENT_WORKSPACE_JOINED, handleWorkspaceJoined);
    socket.on(AGENT_REALTIME_EVENTS.AGENT_RUN_CREATED, handleAgentRunCreated);
    socket.on(AGENT_REALTIME_EVENTS.AGENT_RUN_UPDATED, handleAgentRunUpdated);
    socket.on(AGENT_REALTIME_EVENTS.AGENT_STEP_CREATED, handleAgentStepUpserted);
    socket.on(AGENT_REALTIME_EVENTS.AGENT_STEP_UPDATED, handleAgentStepUpserted);
    socket.connect();

    return () => {
      if (socket.connected) {
        socket.emit(AGENT_REALTIME_EVENTS.AGENT_WORKSPACE_LEAVE, { workspaceId });
      }

      socket.disconnect();
    };
  }, [workspaceId, queryClient]);

  return {
    lastError,
    status,
  };
}
