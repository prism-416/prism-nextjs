"use client";

import * as React from "react";

import {
  ProjectMyTasksPanel,
  type ProjectMyTasksPriorityFilter,
  type ProjectMyTasksStatusFilter,
} from "@/domains/projects/components/ProjectMyTasksPanel";
import { ProjectMyTasksSkeleton } from "@/domains/projects/components/ProjectMyTasksSkeleton";
import { useProjectMyTasks } from "@/domains/projects/hooks/useProjectMyTasks";
import { useUpdateProjectWorkItem } from "@/domains/projects/hooks/useUpdateProjectWorkItem";
import type { ProjectWorkItem, ProjectWorkItemSearchResult, ProjectWorkItemStatus } from "@/domains/projects/types";

type ProjectMyTasksClientProps = {
  projectId: string;
  assigneeUsername?: string;
  initialData?: ProjectWorkItemSearchResult;
};

export function ProjectMyTasksClient({ projectId, assigneeUsername, initialData }: ProjectMyTasksClientProps) {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<ProjectMyTasksStatusFilter>("all");
  const [priority, setPriority] = React.useState<ProjectMyTasksPriorityFilter>("all");
  const [updatingTaskId, setUpdatingTaskId] = React.useState<string | null>(null);
  const [statusUpdateError, setStatusUpdateError] = React.useState<string | null>(null);
  const filters = React.useMemo(
    () => ({
      query: query.trim() || undefined,
      status: status === "all" ? undefined : status,
      priority: priority === "all" ? undefined : priority,
    }),
    [priority, query, status],
  );
  const hasActiveFilters = Boolean(filters.query || filters.status || filters.priority);
  const { data, isPending, isError, refetch } = useProjectMyTasks(
    projectId,
    assigneeUsername,
    filters,
    hasActiveFilters ? undefined : initialData,
  );
  const { mutateAsync: updateWorkItem, isPending: isUpdatingWorkItem } = useUpdateProjectWorkItem();
  const tasks = data?.items ?? [];

  const handleStatusUpdate = React.useCallback(
    async (task: ProjectWorkItem, nextStatus: ProjectWorkItemStatus) => {
      if (task.status === nextStatus || updatingTaskId) {
        return;
      }

      setStatusUpdateError(null);
      setUpdatingTaskId(task.itemId);

      try {
        await updateWorkItem({
          projectId,
          itemId: task.itemId,
          payload: {
            status: nextStatus,
          },
        });
      } catch (error) {
        setStatusUpdateError(error instanceof Error ? error.message : "Task status could not be updated.");
      } finally {
        setUpdatingTaskId(null);
      }
    },
    [projectId, updateWorkItem, updatingTaskId],
  );

  if (isPending && !data && assigneeUsername) {
    return <ProjectMyTasksSkeleton />;
  }

  return (
    <ProjectMyTasksPanel
      tasks={tasks}
      total={data?.total ?? 0}
      assigneeUsername={assigneeUsername}
      query={query}
      status={status}
      priority={priority}
      isError={isError}
      isUpdatingStatus={isUpdatingWorkItem}
      updatingTaskId={updatingTaskId}
      statusUpdateError={statusUpdateError}
      onQueryChange={setQuery}
      onStatusChange={setStatus}
      onPriorityChange={setPriority}
      onStatusUpdate={handleStatusUpdate}
      onResetFilters={() => {
        setQuery("");
        setStatus("all");
        setPriority("all");
        setStatusUpdateError(null);
      }}
      onRetry={() => {
        setStatusUpdateError(null);
        void refetch();
      }}
    />
  );
}
