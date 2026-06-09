import type { QueryClient } from "@tanstack/react-query";

import type { Project, ProjectSummary } from "@/domains/projects/types";
import type { Sprint } from "@/domains/sprints/types";
import type { Workspace, WorkspaceJob, WorkspaceMember } from "@/domains/workspaces/types";
import type { WorkspaceMemberPayload } from "@/domains/workspaces/types/workspace-realtime";
import { QUERY_KEYS } from "@/shared/query";

function sortByCreatedAtDesc<T extends { createdAt: string }>(a: T, b: T) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function sortByName<T extends { name: string }>(a: T, b: T) {
  return a.name.localeCompare(b.name);
}

function getMemberSortName(member: WorkspaceMember) {
  return member.fullName?.trim() || member.username?.trim() || member.userId || "";
}

function sortMembers(a: WorkspaceMember, b: WorkspaceMember) {
  return getMemberSortName(a).localeCompare(getMemberSortName(b));
}

function upsertById<T>(items: T[] | undefined, item: T, getId: (value: T) => string, sort?: (a: T, b: T) => number) {
  const itemId = getId(item);
  const next = [...(items ?? [])];
  const index = next.findIndex(value => getId(value) === itemId);

  if (index >= 0) {
    next[index] = item;
  } else {
    next.push(item);
  }

  return sort ? next.sort(sort) : next;
}

function removeById<T>(items: T[] | undefined, id: string, getId: (value: T) => string) {
  return (items ?? []).filter(item => getId(item) !== id);
}

function toWorkspaceMember(payload: WorkspaceMemberPayload): WorkspaceMember {
  return {
    userId: payload.userId,
    fullName: payload.fullName ?? "",
    username: payload.username ?? payload.userId ?? "",
    role: payload.role,
    jobIds: Array.isArray(payload.jobIds) ? payload.jobIds : [],
    jobNames: Array.isArray(payload.jobNames) ? payload.jobNames : [],
    joinedAt: payload.joinedAt ?? null,
  };
}

export function syncWorkspaceUpdated(queryClient: QueryClient, workspace: Workspace) {
  queryClient.setQueryData<Workspace>(QUERY_KEYS.workspace.detail(workspace.workspaceId), previous => ({
    ...previous,
    ...workspace,
  }));
  queryClient.setQueryData<Workspace[]>(QUERY_KEYS.workspace.list(), previous =>
    upsertById(previous, workspace, item => item.workspaceId, sortByCreatedAtDesc),
  );
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.members(workspace.workspaceId) });
}

export function syncWorkspaceDeleted(queryClient: QueryClient, workspaceId: string) {
  queryClient.removeQueries({ queryKey: QUERY_KEYS.workspace.detail(workspaceId) });
  queryClient.setQueryData<Workspace[]>(QUERY_KEYS.workspace.list(), previous =>
    removeById(previous, workspaceId, item => item.workspaceId),
  );
}

export function syncWorkspaceProjectCreated(queryClient: QueryClient, project: ProjectSummary, workspaceSlug?: string) {
  queryClient.setQueryData<ProjectSummary[]>(QUERY_KEYS.project.list(project.workspaceId), previous =>
    upsertById(previous, project, item => item.projectId, sortByCreatedAtDesc),
  );

  if (workspaceSlug) {
    queryClient.setQueryData<ProjectSummary[]>(QUERY_KEYS.project.listByWorkspaceSlug(workspaceSlug), previous =>
      upsertById(previous, project, item => item.projectId, sortByCreatedAtDesc),
    );
  }
}

export function syncWorkspaceProjectUpdated(queryClient: QueryClient, project: ProjectSummary) {
  queryClient.setQueryData<Project>(QUERY_KEYS.project.detail(project.projectId), previous => ({
    ...previous,
    ...project,
  }));
  queryClient.setQueryData<Project>(QUERY_KEYS.project.detailBySlug(project.slug), previous => ({
    ...previous,
    ...project,
  }));
  queryClient.setQueriesData<ProjectSummary[]>({ queryKey: QUERY_KEYS.project.lists() }, previous =>
    previous?.some(item => item.projectId === project.projectId)
      ? upsertById(previous, project, item => item.projectId, sortByCreatedAtDesc)
      : previous,
  );
}

export function syncWorkspaceProjectDeleted(queryClient: QueryClient, workspaceId: string, projectId: string) {
  queryClient.removeQueries({ queryKey: QUERY_KEYS.project.detail(projectId) });
  queryClient.setQueryData<ProjectSummary[]>(QUERY_KEYS.project.list(workspaceId), previous =>
    removeById(previous, projectId, item => item.projectId),
  );
  queryClient.setQueriesData<ProjectSummary[]>({ queryKey: QUERY_KEYS.project.lists() }, previous =>
    previous?.some(item => item.projectId === projectId)
      ? removeById(previous, projectId, item => item.projectId)
      : previous,
  );
}

export function syncWorkspaceSprintCreated(queryClient: QueryClient, sprint: Sprint) {
  queryClient.setQueryData<Sprint[]>(QUERY_KEYS.workspace.sprints(sprint.workspaceId), previous =>
    upsertById(previous, sprint, item => item.sprintId, sortByCreatedAtDesc),
  );
}

export function syncWorkspaceSprintUpdated(queryClient: QueryClient, sprint: Sprint) {
  queryClient.setQueryData<Sprint>(
    QUERY_KEYS.workspace.sprintDetail(sprint.workspaceId, sprint.sprintId),
    previous => ({
      ...previous,
      ...sprint,
    }),
  );
  queryClient.setQueryData<Sprint[]>(QUERY_KEYS.workspace.sprints(sprint.workspaceId), previous =>
    upsertById(previous, sprint, item => item.sprintId, sortByCreatedAtDesc),
  );
}

export function syncWorkspaceSprintDeleted(queryClient: QueryClient, workspaceId: string, sprintId: string) {
  queryClient.removeQueries({ queryKey: QUERY_KEYS.workspace.sprintDetail(workspaceId, sprintId) });
  queryClient.setQueryData<Sprint[]>(QUERY_KEYS.workspace.sprints(workspaceId), previous =>
    removeById(previous, sprintId, item => item.sprintId),
  );
}

export function syncWorkspaceMemberUpserted(queryClient: QueryClient, payload: WorkspaceMemberPayload) {
  if (!payload.userId) {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.members(payload.workspaceId) });
    return;
  }

  const member = toWorkspaceMember(payload);

  queryClient.setQueryData<WorkspaceMember[]>(QUERY_KEYS.workspace.members(payload.workspaceId), previous =>
    upsertById(previous, member, item => item.userId, sortMembers),
  );
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.members(payload.workspaceId) });
}

export function syncWorkspaceMemberRemoved(queryClient: QueryClient, workspaceId: string, userId: string) {
  queryClient.setQueryData<WorkspaceMember[]>(QUERY_KEYS.workspace.members(workspaceId), previous =>
    removeById(previous, userId, item => item.userId),
  );
}

export function syncWorkspaceAccessRevoked(queryClient: QueryClient, workspaceId: string, workspaceSlug?: string) {
  queryClient.setQueryData<Workspace[]>(QUERY_KEYS.workspace.list(), previous =>
    removeById(previous, workspaceId, item => item.workspaceId),
  );
  queryClient.removeQueries({ queryKey: QUERY_KEYS.workspace.detail(workspaceId) });
  queryClient.removeQueries({ queryKey: QUERY_KEYS.workspace.members(workspaceId) });
  queryClient.removeQueries({ queryKey: QUERY_KEYS.workspace.jobs(workspaceId) });
  queryClient.removeQueries({ queryKey: QUERY_KEYS.workspace.sprints(workspaceId) });
  queryClient.removeQueries({ queryKey: QUERY_KEYS.project.list(workspaceId) });

  if (workspaceSlug) {
    queryClient.removeQueries({ queryKey: QUERY_KEYS.project.listByWorkspaceSlug(workspaceSlug) });
  }

  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.list() });
}

export function syncWorkspaceJobsChanged(queryClient: QueryClient, workspaceId: string, jobs: WorkspaceJob[]) {
  queryClient.setQueryData<WorkspaceJob[]>(QUERY_KEYS.workspace.jobs(workspaceId), previous => {
    const next = [...(previous ?? [])];

    for (const job of jobs) {
      const index = next.findIndex(item => item.jobId === job.jobId);
      if (index >= 0) {
        next[index] = job;
      } else {
        next.push(job);
      }
    }

    return next.sort(sortByName);
  });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.members(workspaceId) });
}

export function syncWorkspaceJobDeleted(queryClient: QueryClient, workspaceId: string, jobId: string) {
  queryClient.setQueryData<WorkspaceJob[]>(QUERY_KEYS.workspace.jobs(workspaceId), previous =>
    removeById(previous, jobId, item => item.jobId),
  );
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.members(workspaceId) });
}
