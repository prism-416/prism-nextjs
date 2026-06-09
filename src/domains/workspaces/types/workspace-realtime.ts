import type { Socket } from "socket.io-client";

import type { ProjectSummary } from "@/domains/projects/types";
import type { Sprint } from "@/domains/sprints/types";
import type { WORKSPACE_REALTIME_EVENTS } from "@/domains/workspaces/constants/workspace-realtime";
import type { Workspace, WorkspaceJob, WorkspaceMember } from "@/domains/workspaces/types";

export type WorkspaceRealtimeErrorPayload = {
  code: string;
  message: string;
};

export type WorkspaceJoinedPayload = {
  workspaceId: string;
};

export type WorkspaceLeftPayload = {
  workspaceId: string;
};

export type WorkspaceDeletedPayload = {
  workspaceId: string;
};

export type ProjectDeletedWorkspacePayload = {
  workspaceId: string;
  projectId: string;
};

export type SprintDeletedPayload = {
  workspaceId: string;
  sprintId: string;
};

export type SprintWorkItemsChangedPayload = {
  workspaceId: string;
  sprintId: string;
  itemIds: string[];
};

export type WorkspaceMemberPayload = WorkspaceMember & {
  workspaceId: string;
};

export type WorkspaceMemberRemovedPayload = {
  workspaceId: string;
  userId: string;
};

export type WorkspaceJobsChangedPayload = {
  workspaceId: string;
  jobs: WorkspaceJob[];
};

export type WorkspaceJobDeletedPayload = {
  workspaceId: string;
  jobId: string;
};

export type WorkspaceRealtimeServerToClientEvents = {
  exception: (payload: WorkspaceRealtimeErrorPayload) => void;
  [WORKSPACE_REALTIME_EVENTS.WORKSPACE_JOINED]: (payload: WorkspaceJoinedPayload) => void;
  [WORKSPACE_REALTIME_EVENTS.WORKSPACE_LEFT]: (payload: WorkspaceLeftPayload) => void;
  [WORKSPACE_REALTIME_EVENTS.WORKSPACE_UPDATED]: (payload: Workspace) => void;
  [WORKSPACE_REALTIME_EVENTS.WORKSPACE_DELETED]: (payload: WorkspaceDeletedPayload) => void;
  [WORKSPACE_REALTIME_EVENTS.PROJECT_CREATED]: (payload: ProjectSummary) => void;
  [WORKSPACE_REALTIME_EVENTS.PROJECT_UPDATED]: (payload: ProjectSummary) => void;
  [WORKSPACE_REALTIME_EVENTS.PROJECT_DELETED]: (payload: ProjectDeletedWorkspacePayload) => void;
  [WORKSPACE_REALTIME_EVENTS.SPRINT_CREATED]: (payload: Sprint) => void;
  [WORKSPACE_REALTIME_EVENTS.SPRINT_UPDATED]: (payload: Sprint) => void;
  [WORKSPACE_REALTIME_EVENTS.SPRINT_DELETED]: (payload: SprintDeletedPayload) => void;
  [WORKSPACE_REALTIME_EVENTS.SPRINT_WORK_ITEMS_CHANGED]: (payload: SprintWorkItemsChangedPayload) => void;
  [WORKSPACE_REALTIME_EVENTS.WORKSPACE_MEMBER_CREATED]: (payload: WorkspaceMemberPayload) => void;
  [WORKSPACE_REALTIME_EVENTS.WORKSPACE_MEMBER_UPDATED]: (payload: WorkspaceMemberPayload) => void;
  [WORKSPACE_REALTIME_EVENTS.WORKSPACE_MEMBER_REMOVED]: (payload: WorkspaceMemberRemovedPayload) => void;
  [WORKSPACE_REALTIME_EVENTS.WORKSPACE_JOBS_CHANGED]: (payload: WorkspaceJobsChangedPayload) => void;
  [WORKSPACE_REALTIME_EVENTS.WORKSPACE_JOB_DELETED]: (payload: WorkspaceJobDeletedPayload) => void;
};

export type WorkspaceRealtimeClientToServerEvents = {
  [WORKSPACE_REALTIME_EVENTS.WORKSPACE_JOIN]: (payload: { workspaceId: string }) => void;
  [WORKSPACE_REALTIME_EVENTS.WORKSPACE_LEAVE]: (payload: { workspaceId: string }) => void;
};

export type WorkspaceRealtimeSocket = Socket<
  WorkspaceRealtimeServerToClientEvents,
  WorkspaceRealtimeClientToServerEvents
>;
