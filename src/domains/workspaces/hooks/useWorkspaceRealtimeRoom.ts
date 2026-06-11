"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { WORKSPACE_REALTIME_EVENTS } from "@/domains/workspaces/constants/workspace-realtime";
import type {
  ProjectDeletedWorkspacePayload,
  SprintDeletedPayload,
  SprintWorkItemsChangedPayload,
  WorkspaceDeletedPayload,
  WorkspaceJobDeletedPayload,
  WorkspaceJobsChangedPayload,
  WorkspaceJoinedPayload,
  WorkspaceMemberPayload,
  WorkspaceMemberRemovedPayload,
  WorkspaceRealtimeErrorPayload,
  WorkspaceRealtimeSocket,
} from "@/domains/workspaces/types/workspace-realtime";
import type { ProjectSummary } from "@/domains/projects/types";
import type { Sprint } from "@/domains/sprints/types";
import type { Workspace } from "@/domains/workspaces/types";
import {
  syncWorkspaceAccessRevoked,
  syncWorkspaceDeleted,
  syncWorkspaceJobDeleted,
  syncWorkspaceJobsChanged,
  syncWorkspaceMemberRemoved,
  syncWorkspaceMemberUpserted,
  syncWorkspaceProjectCreated,
  syncWorkspaceProjectDeleted,
  syncWorkspaceProjectUpdated,
  syncWorkspaceSprintCreated,
  syncWorkspaceSprintDeleted,
  syncWorkspaceSprintUpdated,
  syncWorkspaceUpdated,
} from "@/domains/workspaces/utils/workspace-realtime-cache";
import { createWorkspaceRealtimeSocket } from "@/domains/workspaces/utils/workspace-realtime-client";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import { QUERY_KEYS } from "@/shared/query";
import { getCookie } from "@/shared/utils/cookie";

type WorkspaceRealtimeRoomStatus = "idle" | "connecting" | "connected" | "joined" | "disconnected" | "error";

type UseWorkspaceRealtimeRoomParams = {
  workspaceId: string;
  workspaceSlug?: string;
};

function readAccessTokenSubject(accessToken: string) {
  if (typeof atob === "undefined") {
    return null;
  }

  try {
    const [, payload] = accessToken.split(".");

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const parsed = JSON.parse(atob(normalizedPayload)) as { sub?: unknown };

    return typeof parsed.sub === "string" ? parsed.sub : null;
  } catch {
    return null;
  }
}

export function useWorkspaceRealtimeRoom({ workspaceId, workspaceSlug }: UseWorkspaceRealtimeRoomParams) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const currentUserIdRef = React.useRef<string | null>(null);
  const [status, setStatus] = React.useState<WorkspaceRealtimeRoomStatus>("idle");
  const [lastError, setLastError] = React.useState<WorkspaceRealtimeErrorPayload | null>(null);

  React.useEffect(() => {
    currentUserIdRef.current = currentUser?.userId ?? null;
  }, [currentUser?.userId]);

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

    const accessTokenSubject = readAccessTokenSubject(accessToken);
    const socket: WorkspaceRealtimeSocket = createWorkspaceRealtimeSocket(accessToken);

    const resyncWorkspace = () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.detail(workspaceId) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.members(workspaceId) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.jobs(workspaceId) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.sprints(workspaceId) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.list(workspaceId) });

      if (workspaceSlug) {
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.listByWorkspaceSlug(workspaceSlug) });
      }
    };

    const handleConnect = () => {
      setStatus("connected");
      socket.emit(WORKSPACE_REALTIME_EVENTS.WORKSPACE_JOIN, { workspaceId });
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

    const handleException = (payload: WorkspaceRealtimeErrorPayload) => {
      setStatus("error");
      setLastError(payload);
    };

    const handleWorkspaceJoined = (payload: WorkspaceJoinedPayload) => {
      if (payload.workspaceId !== workspaceId) {
        return;
      }

      setStatus("joined");
      resyncWorkspace();
    };

    const handleWorkspaceUpdated = (payload: Workspace) => {
      if (payload.workspaceId === workspaceId) {
        syncWorkspaceUpdated(queryClient, payload);
      }
    };

    const handleWorkspaceDeleted = (payload: WorkspaceDeletedPayload) => {
      if (payload.workspaceId === workspaceId) {
        syncWorkspaceDeleted(queryClient, payload.workspaceId, workspaceSlug);
        router.replace("/workspaces");
      }
    };

    const handleProjectCreated = (payload: ProjectSummary) => {
      if (payload.workspaceId === workspaceId) {
        syncWorkspaceProjectCreated(queryClient, payload, workspaceSlug);
      }
    };

    const handleProjectUpdated = (payload: ProjectSummary) => {
      if (payload.workspaceId === workspaceId) {
        syncWorkspaceProjectUpdated(queryClient, payload);
      }
    };

    const handleProjectDeleted = (payload: ProjectDeletedWorkspacePayload) => {
      if (payload.workspaceId === workspaceId) {
        syncWorkspaceProjectDeleted(queryClient, payload.workspaceId, payload.projectId);
      }
    };

    const handleSprintCreated = (payload: Sprint) => {
      if (payload.workspaceId === workspaceId) {
        syncWorkspaceSprintCreated(queryClient, payload);
      }
    };

    const handleSprintUpdated = (payload: Sprint) => {
      if (payload.workspaceId === workspaceId) {
        syncWorkspaceSprintUpdated(queryClient, payload);
      }
    };

    const handleSprintDeleted = (payload: SprintDeletedPayload) => {
      if (payload.workspaceId === workspaceId) {
        syncWorkspaceSprintDeleted(queryClient, payload.workspaceId, payload.sprintId);
      }
    };

    const handleSprintWorkItemsChanged = (payload: SprintWorkItemsChangedPayload) => {
      if (payload.workspaceId === workspaceId) {
        void queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.workspace.sprintDetail(payload.workspaceId, payload.sprintId), "work-items"],
        });
      }
    };

    const handleWorkspaceMemberUpserted = (payload: WorkspaceMemberPayload) => {
      if (payload.workspaceId === workspaceId) {
        syncWorkspaceMemberUpserted(queryClient, payload);
      }
    };

    const handleWorkspaceMemberRemoved = (payload: WorkspaceMemberRemovedPayload) => {
      if (payload.workspaceId === workspaceId) {
        const currentUserId = currentUserIdRef.current ?? accessTokenSubject;

        if (payload.userId === currentUserId) {
          syncWorkspaceAccessRevoked(queryClient, payload.workspaceId, workspaceSlug);
          router.replace("/workspaces");
          return;
        }

        syncWorkspaceMemberRemoved(queryClient, payload.workspaceId, payload.userId);
      }
    };

    const handleWorkspaceJobsChanged = (payload: WorkspaceJobsChangedPayload) => {
      if (payload.workspaceId === workspaceId) {
        syncWorkspaceJobsChanged(queryClient, payload.workspaceId, payload.jobs);
      }
    };

    const handleWorkspaceJobDeleted = (payload: WorkspaceJobDeletedPayload) => {
      if (payload.workspaceId === workspaceId) {
        syncWorkspaceJobDeleted(queryClient, payload.workspaceId, payload.jobId);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("exception", handleException);
    socket.on(WORKSPACE_REALTIME_EVENTS.WORKSPACE_JOINED, handleWorkspaceJoined);
    socket.on(WORKSPACE_REALTIME_EVENTS.WORKSPACE_UPDATED, handleWorkspaceUpdated);
    socket.on(WORKSPACE_REALTIME_EVENTS.WORKSPACE_DELETED, handleWorkspaceDeleted);
    socket.on(WORKSPACE_REALTIME_EVENTS.PROJECT_CREATED, handleProjectCreated);
    socket.on(WORKSPACE_REALTIME_EVENTS.PROJECT_UPDATED, handleProjectUpdated);
    socket.on(WORKSPACE_REALTIME_EVENTS.PROJECT_DELETED, handleProjectDeleted);
    socket.on(WORKSPACE_REALTIME_EVENTS.SPRINT_CREATED, handleSprintCreated);
    socket.on(WORKSPACE_REALTIME_EVENTS.SPRINT_UPDATED, handleSprintUpdated);
    socket.on(WORKSPACE_REALTIME_EVENTS.SPRINT_DELETED, handleSprintDeleted);
    socket.on(WORKSPACE_REALTIME_EVENTS.SPRINT_WORK_ITEMS_CHANGED, handleSprintWorkItemsChanged);
    socket.on(WORKSPACE_REALTIME_EVENTS.WORKSPACE_MEMBER_CREATED, handleWorkspaceMemberUpserted);
    socket.on(WORKSPACE_REALTIME_EVENTS.WORKSPACE_MEMBER_UPDATED, handleWorkspaceMemberUpserted);
    socket.on(WORKSPACE_REALTIME_EVENTS.WORKSPACE_MEMBER_REMOVED, handleWorkspaceMemberRemoved);
    socket.on(WORKSPACE_REALTIME_EVENTS.WORKSPACE_JOBS_CHANGED, handleWorkspaceJobsChanged);
    socket.on(WORKSPACE_REALTIME_EVENTS.WORKSPACE_JOB_DELETED, handleWorkspaceJobDeleted);
    socket.connect();

    return () => {
      if (socket.connected) {
        socket.emit(WORKSPACE_REALTIME_EVENTS.WORKSPACE_LEAVE, { workspaceId });
      }

      socket.disconnect();
    };
  }, [queryClient, router, workspaceId, workspaceSlug]);

  return {
    lastError,
    status,
  };
}
