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
};

export async function ProjectMembersContent({ slug, workspaceSlug }: ProjectMembersContentProps) {
  const initialData = await getProjectBySlug(slug);

  if (!initialData) {
    notFound();
  }

  const [initialMembers, initialJobs, initialAssignableMembers] = await Promise.all([
    getProjectMembers(initialData.projectId).catch(() => undefined),
    getWorkspaceJobs(initialData.workspaceId).catch(() => undefined),
    getProjectAssignableMembers(initialData.workspaceId).catch(() => undefined),
  ]);

  return (
    <ProjectMembersClient
      slug={slug}
      workspaceSlug={workspaceSlug}
      initialData={initialData}
      initialMembers={initialMembers}
      initialJobs={initialJobs}
      initialAssignableMembers={initialAssignableMembers}
    />
  );
}
