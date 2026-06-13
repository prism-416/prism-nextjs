"use client";

import * as React from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { PROJECT_MUTATION_KEYS } from "@/domains/projects/constants/mutations";
import { PROJECT_REALTIME_EVENTS } from "@/domains/projects/constants/realtime";
import type {
  ProjectCommentDeletedPayload,
  ProjectCommentPayload,
  ProjectDeletedPayload,
  ProjectDocumentCreatedPayload,
  ProjectDocumentDeletedPayload,
  ProjectRealtimeErrorPayload,
  ProjectRealtimeSocket,
  ProjectWorkItemDeletedPayload,
  ProjectWorkItemsReorderedPayload,
} from "@/domains/projects/types/realtime";
import type { ProjectSummary, ProjectWorkItem } from "@/domains/projects/types";
import { createProjectRealtimeSocket } from "@/domains/projects/utils/realtime-client";
import {
  syncProjectCommentCreated,
  syncProjectCommentDeleted,
  syncProjectCommentUpdated,
} from "@/domains/projects/utils/comment-cache";
import { syncProjectDocumentsChanged } from "@/domains/projects/utils/document-cache";
import {
  syncProjectWorkItemCreated,
  syncProjectWorkItemDeleted,
  syncProjectWorkItemUpdated,
  syncProjectWorkItemsReordered,
} from "@/domains/projects/utils/work-item-cache";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { QUERY_KEYS } from "@/shared/query";
import { getCookie } from "@/shared/utils/cookie";

type ProjectRealtimeRoomStatus = "idle" | "connecting" | "connected" | "joined" | "disconnected" | "error";

type UseProjectRealtimeRoomParams = {
  projectId: string;
  projectSlug: string;
  workspaceId: string;
  workspaceSlug?: string;
};

export function useProjectRealtimeRoom({
  projectId,
  projectSlug,
  workspaceId,
  workspaceSlug,
}: UseProjectRealtimeRoomParams) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [status, setStatus] = React.useState<ProjectRealtimeRoomStatus>("idle");
  const [lastError, setLastError] = React.useState<ProjectRealtimeErrorPayload | null>(null);
  const workspaceHref = workspaceSlug ? `/workspaces/${encodeURIComponent(workspaceSlug)}` : "/workspaces";

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

    const resyncProject = () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.detail(projectId) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.detailBySlug(projectSlug) });
    };

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
        resyncProject();
      }
    };

    const handleProjectDeleted = (payload: ProjectDeletedPayload) => {
      if (payload.projectId !== projectId) {
        return;
      }

      queryClient.removeQueries({ queryKey: QUERY_KEYS.project.detail(projectId) });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.project.detailBySlug(projectSlug) });
      queryClient.setQueryData<ProjectSummary[]>(QUERY_KEYS.project.list(workspaceId), previous =>
        previous?.filter(item => item.projectId !== projectId),
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.lists() });
      router.replace(workspaceHref);
    };

    const handleWorkItemCreated = (payload: ProjectWorkItem) => {
      if (payload.projectId === projectId) {
        syncProjectWorkItemCreated(queryClient, payload);
      }
    };

    const handleWorkItemUpdated = (payload: ProjectWorkItem) => {
      if (payload.projectId === projectId) {
        const hasPendingLocalUpdate =
          queryClient.isMutating({ mutationKey: PROJECT_MUTATION_KEYS.workItems.update(projectId) }) > 0;
        if (!hasPendingLocalUpdate) {
          syncProjectWorkItemUpdated(queryClient, payload);
        }
      }
    };

    const handleWorkItemDeleted = (payload: ProjectWorkItemDeletedPayload) => {
      if (payload.projectId === projectId) {
        syncProjectWorkItemDeleted(queryClient, payload);
      }
    };

    const handleWorkItemsReordered = (payload: ProjectWorkItemsReorderedPayload) => {
      if (payload.projectId === projectId) {
        const hasPendingLocalReorder =
          queryClient.isMutating({ mutationKey: PROJECT_MUTATION_KEYS.workItems.reorder(projectId) }) > 0;
        const hasPendingLocalUpdate =
          queryClient.isMutating({ mutationKey: PROJECT_MUTATION_KEYS.workItems.update(projectId) }) > 0;
        if (!hasPendingLocalReorder && !hasPendingLocalUpdate) {
          syncProjectWorkItemsReordered(queryClient, payload.workItems);
        }
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

    const handleDocumentCreated = (payload: ProjectDocumentCreatedPayload) => {
      if (payload.projectId === projectId) {
        syncProjectDocumentsChanged(queryClient, projectId);
      }
    };

    const handleDocumentDeleted = (payload: ProjectDocumentDeletedPayload) => {
      if (payload.projectId === projectId) {
        syncProjectDocumentsChanged(queryClient, projectId);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("exception", handleException);
    socket.on(PROJECT_REALTIME_EVENTS.PROJECT_JOINED, handleProjectJoined);
    socket.on(PROJECT_REALTIME_EVENTS.PROJECT_DELETED, handleProjectDeleted);
    socket.on(PROJECT_REALTIME_EVENTS.WORK_ITEM_CREATED, handleWorkItemCreated);
    socket.on(PROJECT_REALTIME_EVENTS.WORK_ITEM_UPDATED, handleWorkItemUpdated);
    socket.on(PROJECT_REALTIME_EVENTS.WORK_ITEMS_REORDERED, handleWorkItemsReordered);
    socket.on(PROJECT_REALTIME_EVENTS.WORK_ITEM_DELETED, handleWorkItemDeleted);
    socket.on(PROJECT_REALTIME_EVENTS.COMMENT_CREATED, handleCommentCreated);
    socket.on(PROJECT_REALTIME_EVENTS.COMMENT_UPDATED, handleCommentUpdated);
    socket.on(PROJECT_REALTIME_EVENTS.COMMENT_DELETED, handleCommentDeleted);
    socket.on(PROJECT_REALTIME_EVENTS.DOCUMENT_CREATED, handleDocumentCreated);
    socket.on(PROJECT_REALTIME_EVENTS.DOCUMENT_DELETED, handleDocumentDeleted);
    socket.connect();

    return () => {
      if (socket.connected) {
        socket.emit(PROJECT_REALTIME_EVENTS.PROJECT_LEAVE, { projectId });
      }

      socket.disconnect();
    };
  }, [projectId, projectSlug, queryClient, router, workspaceHref, workspaceId]);

  return {
    lastError,
    status,
  };
}
