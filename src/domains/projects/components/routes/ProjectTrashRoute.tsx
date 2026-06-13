"use client";

import { useProjectRoute } from "@/domains/projects/components/ProjectRouteShell";
import { ProjectTrashClient } from "@/domains/projects/components/ProjectTrashClient";
import type { ProjectParticipant, TrashedProjectWorkItemSearchResult } from "@/domains/projects/types";

type ProjectTrashRouteProps = {
  initialData?: TrashedProjectWorkItemSearchResult;
  initialMembers?: ProjectParticipant[];
};

export function ProjectTrashRoute({ initialData, initialMembers }: ProjectTrashRouteProps) {
  const { projectId, projectSlug, workspaceId } = useProjectRoute();

  return (
    <ProjectTrashClient
      projectId={projectId}
      projectSlug={projectSlug}
      workspaceId={workspaceId}
      initialData={initialData}
      initialMembers={initialMembers}
    />
  );
}
