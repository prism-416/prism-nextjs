"use client";

import * as React from "react";

import {
  ProjectMyTasksPanel,
  type ProjectMyTasksPriorityFilter,
  type ProjectMyTasksStatusFilter,
} from "@/domains/projects/components/ProjectMyTasksPanel";
import { ProjectMyTasksSkeleton } from "@/domains/projects/components/ProjectMyTasksSkeleton";
import { useProjectMyTasks } from "@/domains/projects/hooks/useProjectMyTasks";
import type { ProjectWorkItemSearchResult } from "@/domains/projects/types";

type ProjectMyTasksClientProps = {
  projectId: string;
  assigneeUsername?: string;
  initialData?: ProjectWorkItemSearchResult;
};

export function ProjectMyTasksClient({ projectId, assigneeUsername, initialData }: ProjectMyTasksClientProps) {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<ProjectMyTasksStatusFilter>("all");
  const [priority, setPriority] = React.useState<ProjectMyTasksPriorityFilter>("all");
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
  const tasks = data?.items ?? [];

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
      onQueryChange={setQuery}
      onStatusChange={setStatus}
      onPriorityChange={setPriority}
      onResetFilters={() => {
        setQuery("");
        setStatus("all");
        setPriority("all");
      }}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}
