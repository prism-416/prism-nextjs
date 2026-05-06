"use client";

import { ProjectSprintsPanel } from "@/domains/projects/components/ProjectSprintsPanel";
import { ProjectSprintsSkeleton } from "@/domains/projects/components/ProjectSprintsSkeleton";
import { useProjectSprints } from "@/domains/projects/hooks/useProjectSprints";
import type { ProjectSprint } from "@/domains/projects/types";

type ProjectSprintsClientProps = {
  projectId: string;
  projectSlug: string;
  initialData?: ProjectSprint[];
};

export function ProjectSprintsClient({ projectId, projectSlug, initialData }: ProjectSprintsClientProps) {
  const { data: sprints = [], isPending, isError, refetch } = useProjectSprints(projectId, initialData);

  if (isPending && sprints.length === 0) {
    return <ProjectSprintsSkeleton />;
  }

  return (
    <ProjectSprintsPanel
      projectId={projectId}
      projectSlug={projectSlug}
      sprints={sprints}
      isError={isError}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}
