"use client";

import { ProjectSettingsClient } from "@/domains/projects/components/ProjectSettingsClient";
import { useProjectRoute } from "@/domains/projects/components/ProjectRouteShell";

export function ProjectSettingsRoute() {
  const { project, workspace } = useProjectRoute();

  return (
    <ProjectSettingsClient
      project={project}
      workspaceOwnerId={workspace.ownerId}
      workspaceSlug={workspace.slug}
    />
  );
}
