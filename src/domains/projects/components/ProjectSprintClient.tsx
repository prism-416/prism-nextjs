"use client";

import { ProjectErrorState } from "@/domains/projects/components/ProjectErrorState";
import { ProjectSprintPanel } from "@/domains/projects/components/ProjectSprintPanel";
import { ProjectSprintSkeleton } from "@/domains/projects/components/ProjectSprintSkeleton";
import { useProjectSprint } from "@/domains/projects/hooks/useProjectSprint";
import { useProjectSprintWorkItems } from "@/domains/projects/hooks/useProjectSprintWorkItems";
import type { ProjectSprint, ProjectWorkItemSearchResult } from "@/domains/projects/types";

type ProjectSprintClientProps = {
  projectId: string;
  projectSlug: string;
  sprintId: string;
  initialSprint?: ProjectSprint;
  initialWorkItems?: ProjectWorkItemSearchResult;
};

export function ProjectSprintClient({
  projectId,
  projectSlug,
  sprintId,
  initialSprint,
  initialWorkItems,
}: ProjectSprintClientProps) {
  const {
    data: sprint,
    isPending: isSprintPending,
    isError: isSprintError,
    refetch: refetchSprint,
  } = useProjectSprint(projectId, sprintId, initialSprint);
  const {
    data: workItems,
    isError: isWorkItemsError,
    refetch: refetchWorkItems,
  } = useProjectSprintWorkItems(projectId, sprintId, undefined, initialWorkItems);

  if (isSprintPending && !sprint) {
    return <ProjectSprintSkeleton />;
  }

  if (isSprintError || !sprint) {
    return (
      <ProjectErrorState
        title="Sprint could not be loaded."
        description="Check the sprint route or try again."
        onRetry={() => {
          void refetchSprint();
        }}
      />
    );
  }

  return (
    <ProjectSprintPanel
      projectSlug={projectSlug}
      sprint={sprint}
      workItems={workItems ?? { items: [], total: 0, limit: 50, offset: 0 }}
      isWorkItemsError={isWorkItemsError}
      onRetryWorkItems={() => {
        void refetchWorkItems();
      }}
    />
  );
}
