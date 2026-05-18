import { notFound } from "next/navigation";

import {
  getProjectMembers,
  getProjectWorkItem,
  getProjectWorkItemChildren,
  getProjectWorkItemComments,
} from "@/domains/projects/api";
import { ProjectWorkItemClient } from "@/domains/projects/components/ProjectWorkItemClient";
import { getCurrentUser } from "@/shared/api/auth";

type ProjectWorkItemContentProps = {
  projectId: string;
  projectSlug: string;
  itemId: string;
};

export async function ProjectWorkItemContent({ projectId, projectSlug, itemId }: ProjectWorkItemContentProps) {
  const initialWorkItem = await getProjectWorkItem(projectId, itemId);

  if (!initialWorkItem) {
    notFound();
  }

  const [initialChildren, initialComments, initialMembers, initialCurrentUser] = await Promise.all([
    getProjectWorkItemChildren(projectId, itemId).catch(() => undefined),
    getProjectWorkItemComments(projectId, itemId).catch(() => undefined),
    getProjectMembers(projectId).catch(() => undefined),
    getCurrentUser().catch(() => undefined),
  ]);

  return (
    <ProjectWorkItemClient
      projectId={projectId}
      projectSlug={projectSlug}
      itemId={itemId}
      initialWorkItem={initialWorkItem}
      initialChildren={initialChildren}
      initialComments={initialComments}
      initialMembers={initialMembers}
      initialCurrentUser={initialCurrentUser}
    />
  );
}
