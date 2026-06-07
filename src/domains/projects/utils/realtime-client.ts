"use client";

import { io } from "socket.io-client";

import {
  PROJECT_REALTIME_NAMESPACE,
  PROJECT_REALTIME_RECONNECTION_ATTEMPTS,
} from "@/domains/projects/constants/realtime";
import type { ProjectRealtimeSocket } from "@/domains/projects/types/realtime";
import { getSocketIoNamespaceUrl, getSocketIoPath } from "@/shared/utils/socket-io-url";

export function getProjectRealtimeUrl() {
  return getSocketIoNamespaceUrl(PROJECT_REALTIME_NAMESPACE);
}

export function createProjectRealtimeSocket(accessToken?: string): ProjectRealtimeSocket {
  return io(getProjectRealtimeUrl(), {
    autoConnect: false,
    auth: accessToken ? { token: accessToken } : {},
    path: getSocketIoPath(),
    reconnectionAttempts: PROJECT_REALTIME_RECONNECTION_ATTEMPTS,
    withCredentials: true,
  }) as ProjectRealtimeSocket;
}
