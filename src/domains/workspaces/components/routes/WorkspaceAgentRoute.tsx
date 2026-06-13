"use client";

import { ProjectAgentClient } from "@/domains/projects/components/ProjectAgentClient";
import type { AgentRunSearchResult } from "@/domains/projects/types";
import { useWorkspaceRoute } from "@/domains/workspaces/components/WorkspaceRouteShell";

type WorkspaceAgentRouteProps = {
  initialData?: AgentRunSearchResult;
};

export function WorkspaceAgentRoute({ initialData }: WorkspaceAgentRouteProps) {
  const { workspace, projects } = useWorkspaceRoute();

  return (
    <ProjectAgentClient
      workspaceId={workspace.workspaceId}
      projects={projects.map(project => ({ projectId: project.projectId, name: project.name }))}
      initialData={initialData}
    />
  );
}
