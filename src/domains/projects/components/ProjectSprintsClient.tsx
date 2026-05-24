"use client";

import { useState } from "react";

import { CreateProjectSprintDialog } from "@/domains/projects/components/CreateProjectSprintDialog";
import { ProjectSprintsPanel } from "@/domains/projects/components/ProjectSprintsPanel";
import { ProjectSprintsSkeleton } from "@/domains/projects/components/ProjectSprintsSkeleton";
import { useProjectSprints } from "@/domains/projects/hooks/useProjectSprints";
import type { ProjectSprint } from "@/domains/projects/types";

type ProjectSprintsClientProps = {
  projectId: string;
  projectSlug: string;
  initialData?: ProjectSprint[];
  defaultSprintStartsAt: string;
  defaultSprintEndsAt: string;
};

export function ProjectSprintsClient({
  projectId,
  projectSlug,
  initialData,
  defaultSprintStartsAt,
  defaultSprintEndsAt,
}: ProjectSprintsClientProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: sprints = [], isPending, isError, refetch } = useProjectSprints(projectId, initialData);

  if (isPending && sprints.length === 0) {
    return <ProjectSprintsSkeleton />;
  }

  return (
    <>
      <ProjectSprintsPanel
        projectSlug={projectSlug}
        sprints={sprints}
        isError={isError}
        onRetry={() => {
          void refetch();
        }}
        onCreateSprint={() => setIsCreateOpen(true)}
      />

      <CreateProjectSprintDialog
        open={isCreateOpen}
        projectId={projectId}
        defaultStartsAt={defaultSprintStartsAt}
        defaultEndsAt={defaultSprintEndsAt}
        onOpenChange={setIsCreateOpen}
      />
    </>
  );
}
