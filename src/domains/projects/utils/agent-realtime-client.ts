"use client";

import { io } from "socket.io-client";

import {
  AGENT_REALTIME_NAMESPACE,
  AGENT_REALTIME_RECONNECTION_ATTEMPTS,
} from "@/domains/projects/constants/agent-realtime";
import type { AgentRealtimeSocket } from "@/domains/projects/types/agent-realtime";
import { getSocketIoNamespaceUrl, getSocketIoPath } from "@/shared/utils/socket-io-url";

export function getAgentRealtimeUrl() {
  return getSocketIoNamespaceUrl(AGENT_REALTIME_NAMESPACE);
}

export function createAgentRealtimeSocket(accessToken?: string): AgentRealtimeSocket {
  return io(getAgentRealtimeUrl(), {
    autoConnect: false,
    auth: accessToken ? { token: accessToken } : {},
    path: getSocketIoPath(),
    reconnectionAttempts: AGENT_REALTIME_RECONNECTION_ATTEMPTS,
    withCredentials: true,
  }) as AgentRealtimeSocket;
}
