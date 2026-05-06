import { notFound } from "next/navigation";

import {
  getProjectAssignableMembers,
  getProjectBySlug,
  getProjectMembers,
  getWorkspaceJobs,
} from "@/domains/projects/api";
import { ProjectMembersClient } from "@/domains/projects/components/ProjectMembersClient";

type ProjectMembersContentProps = {
  slug: string;
  workspaceSlug?: string;
  canManageMembers: boolean;
  currentUserId?: string;
};

export async function ProjectMembersContent({
  slug,
  workspaceSlug,
  canManageMembers,
  currentUserId,
}: ProjectMembersContentProps) {
  const initialData = await getProjectBySlug(slug);

  if (!initialData) {
    notFound();
  }

  const [initialMembers, initialJobs, initialAssignableMembers] = await Promise.all([
    getProjectMembers(initialData.projectId).catch(() => undefined),
    canManageMembers ? getWorkspaceJobs(initialData.workspaceId).catch(() => undefined) : undefined,
    canManageMembers ? getProjectAssignableMembers(initialData.workspaceId).catch(() => undefined) : undefined,
  ]);

  return (
    <ProjectMembersClient
      slug={slug}
      workspaceSlug={workspaceSlug}
      initialData={initialData}
      initialMembers={initialMembers}
      initialJobs={initialJobs}
      initialAssignableMembers={initialAssignableMembers}
      canManageMembers={canManageMembers}
      currentUserId={currentUserId}
    />
  );
}
