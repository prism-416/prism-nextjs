"use client";

import { ProjectMyTasksClient } from "@/domains/projects/components/ProjectMyTasksClient";
import { ProjectMyTasksSkeleton } from "@/domains/projects/components/ProjectMyTasksSkeleton";
import { useProjectRoute } from "@/domains/projects/components/ProjectRouteShell";
import type { ProjectParticipant, ProjectWorkItemSearchResult } from "@/domains/projects/types";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import type { CurrentUser } from "@/shared/types/auth";

type ProjectMyTasksRouteProps = {
  initialCurrentUser?: CurrentUser;
  initialData?: ProjectWorkItemSearchResult;
  initialMembers?: ProjectParticipant[];
};

export function ProjectMyTasksRoute({ initialCurrentUser, initialData, initialMembers }: ProjectMyTasksRouteProps) {
  const { projectId, projectSlug, workspaceId } = useProjectRoute();
  const { data: currentUser, isPending } = useCurrentUser(initialCurrentUser);

  if (isPending && !currentUser) {
    return <ProjectMyTasksSkeleton />;
  }

  return (
    <ProjectMyTasksClient
      projectId={projectId}
      projectSlug={projectSlug}
      workspaceId={workspaceId}
      assigneeUsername={currentUser?.username}
      initialData={initialData}
      initialMembers={initialMembers}
    />
  );
}
