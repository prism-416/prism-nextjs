"use client";

import { io } from "socket.io-client";

import {
  WORKSPACE_REALTIME_NAMESPACE,
  WORKSPACE_REALTIME_RECONNECTION_ATTEMPTS,
} from "@/domains/workspaces/constants/workspace-realtime";
import type { WorkspaceRealtimeSocket } from "@/domains/workspaces/types/workspace-realtime";
import { getSocketIoNamespaceUrl, getSocketIoPath } from "@/shared/utils/socket-io-url";

export function getWorkspaceRealtimeUrl() {
  return getSocketIoNamespaceUrl(WORKSPACE_REALTIME_NAMESPACE);
}

export function createWorkspaceRealtimeSocket(accessToken?: string): WorkspaceRealtimeSocket {
  return io(getWorkspaceRealtimeUrl(), {
    autoConnect: false,
    auth: accessToken ? { token: accessToken } : {},
    path: getSocketIoPath(),
    reconnectionAttempts: WORKSPACE_REALTIME_RECONNECTION_ATTEMPTS,
    withCredentials: true,
  }) as WorkspaceRealtimeSocket;
}
