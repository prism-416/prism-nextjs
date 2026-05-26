import type { Socket } from "socket.io-client";

import type { PROJECT_REALTIME_EVENTS } from "@/domains/projects/constants/realtime";
import type { Project, ProjectWorkItem } from "@/domains/projects/types";

export type ProjectRealtimeErrorPayload = {
  code: string;
  message: string;
};

export type ProjectJoinedPayload = {
  projectId: string;
};

export type ProjectLeftPayload = {
  projectId: string;
};

export type ProjectDeletedPayload = {
  projectId: string;
};

export type ProjectWorkItemDeletedPayload = {
  projectId: string;
  itemId: string;
};

export type ProjectWorkItemsReorderedPayload = {
  projectId: string;
  workItems: ProjectWorkItem[];
};

export type ProjectCommentPayload = {
  commentId: string;
  projectId: string;
  itemId: string;
  authorUserId: string;
  body: string;
  createdAt: string;
  updatedAt: string | null;
};

export type ProjectCommentDeletedPayload = {
  projectId: string;
  itemId: string;
  commentId: string;
};

export type ProjectDocumentCreatedPayload = {
  documentId: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description: string | null;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  createdBy: string;
  createdAt: string;
};

export type ProjectDocumentDeletedPayload = {
  projectId: string;
  documentId: string;
};

export type ProjectRealtimeServerToClientEvents = {
  exception: (payload: ProjectRealtimeErrorPayload) => void;
  [PROJECT_REALTIME_EVENTS.PROJECT_JOINED]: (payload: ProjectJoinedPayload) => void;
  [PROJECT_REALTIME_EVENTS.PROJECT_LEFT]: (payload: ProjectLeftPayload) => void;
  [PROJECT_REALTIME_EVENTS.PROJECT_UPDATED]: (payload: Project) => void;
  [PROJECT_REALTIME_EVENTS.PROJECT_DELETED]: (payload: ProjectDeletedPayload) => void;
  [PROJECT_REALTIME_EVENTS.WORK_ITEM_CREATED]: (payload: ProjectWorkItem) => void;
  [PROJECT_REALTIME_EVENTS.WORK_ITEM_UPDATED]: (payload: ProjectWorkItem) => void;
  [PROJECT_REALTIME_EVENTS.WORK_ITEMS_REORDERED]: (payload: ProjectWorkItemsReorderedPayload) => void;
  [PROJECT_REALTIME_EVENTS.WORK_ITEM_DELETED]: (payload: ProjectWorkItemDeletedPayload) => void;
  [PROJECT_REALTIME_EVENTS.COMMENT_CREATED]: (payload: ProjectCommentPayload) => void;
  [PROJECT_REALTIME_EVENTS.COMMENT_UPDATED]: (payload: ProjectCommentPayload) => void;
  [PROJECT_REALTIME_EVENTS.COMMENT_DELETED]: (payload: ProjectCommentDeletedPayload) => void;
  [PROJECT_REALTIME_EVENTS.DOCUMENT_CREATED]: (payload: ProjectDocumentCreatedPayload) => void;
  [PROJECT_REALTIME_EVENTS.DOCUMENT_DELETED]: (payload: ProjectDocumentDeletedPayload) => void;
};

export type ProjectRealtimeClientToServerEvents = {
  [PROJECT_REALTIME_EVENTS.PROJECT_JOIN]: (payload: { projectId: string }) => void;
  [PROJECT_REALTIME_EVENTS.PROJECT_LEAVE]: (payload: { projectId: string }) => void;
};

export type ProjectRealtimeSocket = Socket<ProjectRealtimeServerToClientEvents, ProjectRealtimeClientToServerEvents>;
