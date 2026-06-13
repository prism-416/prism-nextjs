"use client";

import { ProjectDashboardClient } from "@/domains/projects/components/ProjectDashboardClient";
import { useProjectRoute } from "@/domains/projects/components/ProjectRouteShell";
import type { ProjectParticipant, ProjectWorkItemSearchResult } from "@/domains/projects/types";

type ProjectDashboardRouteProps = {
  initialData?: ProjectWorkItemSearchResult;
  initialMembers?: ProjectParticipant[];
};

export function ProjectDashboardRoute({ initialData, initialMembers }: ProjectDashboardRouteProps) {
  const { projectId, projectSlug, workspaceId } = useProjectRoute();

  return (
    <ProjectDashboardClient
      projectId={projectId}
      projectSlug={projectSlug}
      workspaceId={workspaceId}
      initialData={initialData}
      initialMembers={initialMembers}
    />
  );
}
