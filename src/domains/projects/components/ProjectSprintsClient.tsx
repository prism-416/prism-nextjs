"use client";

import { ProjectSprintsPanel } from "@/domains/projects/components/ProjectSprintsPanel";
import { ProjectSprintsSkeleton } from "@/domains/projects/components/ProjectSprintsSkeleton";
import { useProjectSprints } from "@/domains/projects/hooks/useProjectSprints";
import type { ProjectSprint } from "@/domains/projects/types";

type ProjectSprintsClientProps = {
  projectId: string;
  initialData?: ProjectSprint[];
};

export function ProjectSprintsClient({ projectId, initialData }: ProjectSprintsClientProps) {
  const { data: sprints = [], isPending, isError, refetch } = useProjectSprints(projectId, initialData);

  if (isPending && sprints.length === 0) {
    return <ProjectSprintsSkeleton />;
  }

  return (
    <ProjectSprintsPanel
      sprints={sprints}
      isError={isError}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}
