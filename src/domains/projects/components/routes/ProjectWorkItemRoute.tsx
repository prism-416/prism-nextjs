"use client";

import { useProjectRoute } from "@/domains/projects/components/ProjectRouteShell";
import { ProjectWorkItemClient } from "@/domains/projects/components/ProjectWorkItemClient";
import type { ProjectParticipant, ProjectWorkItem, ProjectWorkItemCommentSearchResult } from "@/domains/projects/types";

type ProjectWorkItemRouteProps = {
  itemId: string;
  initialWorkItem?: ProjectWorkItem;
  initialChildren?: ProjectWorkItem[];
  initialComments?: ProjectWorkItemCommentSearchResult;
  initialMembers?: ProjectParticipant[];
};

export function ProjectWorkItemRoute({
  itemId,
  initialWorkItem,
  initialChildren,
  initialComments,
  initialMembers,
}: ProjectWorkItemRouteProps) {
  const { projectId, projectSlug } = useProjectRoute();

  return (
    <ProjectWorkItemClient
      projectId={projectId}
      projectSlug={projectSlug}
      itemId={itemId}
      initialWorkItem={initialWorkItem}
      initialChildren={initialChildren}
      initialComments={initialComments}
      initialMembers={initialMembers}
    />
  );
}
