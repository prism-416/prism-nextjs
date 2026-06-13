"use client";

import { ProjectsClient } from "@/domains/projects/components/ProjectsClient";
import { useWorkspaceRoute } from "@/domains/workspaces/components/WorkspaceRouteShell";

export function WorkspaceProjectsRoute() {
  const { workspace, workspaceSlug, projects } = useWorkspaceRoute();

  return (
    <ProjectsClient
      slug={workspaceSlug}
      workspace={workspace}
      initialData={projects}
      initialCanCreateProject={false}
    />
  );
}
