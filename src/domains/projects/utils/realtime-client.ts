"use client";

import { io } from "socket.io-client";

import {
  PROJECT_REALTIME_NAMESPACE,
  PROJECT_REALTIME_RECONNECTION_ATTEMPTS,
} from "@/domains/projects/constants/realtime";
import type { ProjectRealtimeSocket } from "@/domains/projects/types/realtime";
import { API_HOST } from "@/shared/constants/env";

export function getProjectRealtimeUrl() {
  return new URL(PROJECT_REALTIME_NAMESPACE, API_HOST).toString();
}

export function createProjectRealtimeSocket(accessToken?: string): ProjectRealtimeSocket {
  return io(getProjectRealtimeUrl(), {
    autoConnect: false,
    auth: accessToken ? { token: accessToken } : {},
    reconnectionAttempts: PROJECT_REALTIME_RECONNECTION_ATTEMPTS,
    withCredentials: true,
  }) as ProjectRealtimeSocket;
}
