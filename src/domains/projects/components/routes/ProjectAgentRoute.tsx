"use client";

import { ProjectAgentClient } from "@/domains/projects/components/ProjectAgentClient";
import { useProjectRoute } from "@/domains/projects/components/ProjectRouteShell";
import type { AgentRunSearchResult } from "@/domains/projects/types";

type ProjectAgentRouteProps = {
  initialData?: AgentRunSearchResult;
};

export function ProjectAgentRoute({ initialData }: ProjectAgentRouteProps) {
  const { project, projectId, workspaceId } = useProjectRoute();

  return (
    <ProjectAgentClient
      workspaceId={workspaceId}
      projects={[{ projectId, name: project.name }]}
      lockedProjectId={projectId}
      initialData={initialData}
    />
  );
}
