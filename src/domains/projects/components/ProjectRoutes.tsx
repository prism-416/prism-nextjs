"use client";

import { ProjectAgentClient } from "@/domains/projects/components/ProjectAgentClient";
import { ProjectDashboardClient } from "@/domains/projects/components/ProjectDashboardClient";
import { ProjectDocumentsClient } from "@/domains/projects/components/ProjectDocumentsClient";
import { ProjectMyTasksClient } from "@/domains/projects/components/ProjectMyTasksClient";
import { ProjectMyTasksSkeleton } from "@/domains/projects/components/ProjectMyTasksSkeleton";
import { ProjectSettingsClient } from "@/domains/projects/components/ProjectSettingsClient";
import { ProjectTrashClient } from "@/domains/projects/components/ProjectTrashClient";
import { ProjectWorkItemClient } from "@/domains/projects/components/ProjectWorkItemClient";
import { useProjectRoute } from "@/domains/projects/components/ProjectRouteShell";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";

export function ProjectDashboardRoute() {
  const { projectId, projectSlug, workspaceId } = useProjectRoute();

  return (
    <ProjectDashboardClient
      projectId={projectId}
      projectSlug={projectSlug}
      workspaceId={workspaceId}
    />
  );
}

export function ProjectAgentRoute() {
  const { project, projectId, workspaceId } = useProjectRoute();

  return (
    <ProjectAgentClient
      workspaceId={workspaceId}
      projects={[{ projectId, name: project.name }]}
      lockedProjectId={projectId}
    />
  );
}

export function ProjectDocumentsRoute() {
  const { projectId, workspaceId } = useProjectRoute();

  return (
    <ProjectDocumentsClient
      projectId={projectId}
      workspaceId={workspaceId}
    />
  );
}

export function ProjectMyTasksRoute() {
  const { projectId, projectSlug, workspaceId } = useProjectRoute();
  const { data: currentUser, isPending } = useCurrentUser();

  if (isPending && !currentUser) {
    return <ProjectMyTasksSkeleton />;
  }

  return (
    <ProjectMyTasksClient
      projectId={projectId}
      projectSlug={projectSlug}
      workspaceId={workspaceId}
      assigneeUsername={currentUser?.username}
    />
  );
}

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

export function ProjectTrashRoute() {
  const { projectId, projectSlug, workspaceId } = useProjectRoute();

  return (
    <ProjectTrashClient
      projectId={projectId}
      projectSlug={projectSlug}
      workspaceId={workspaceId}
    />
  );
}

export function ProjectWorkItemRoute({ itemId }: { itemId: string }) {
  const { projectId, projectSlug } = useProjectRoute();

  return (
    <ProjectWorkItemClient
      projectId={projectId}
      projectSlug={projectSlug}
      itemId={itemId}
    />
  );
}
