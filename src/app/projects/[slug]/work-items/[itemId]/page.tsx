import { notFound } from "next/navigation";

import {
  getProjectParticipants,
  getProjectWorkItem,
  getProjectWorkItemChildren,
  getProjectWorkItemComments,
} from "@/domains/projects/api";
import { getProjectBySlugCached } from "@/domains/projects/api/server";
import { ProjectWorkItemRoute } from "@/domains/projects/components/routes/ProjectWorkItemRoute";

type ProjectWorkItemPageProps = {
  params: Promise<{
    slug: string;
    itemId: string;
  }>;
};

export default async function ProjectWorkItemPage({ params }: ProjectWorkItemPageProps) {
  const { slug, itemId } = await params;
  const project = await getProjectBySlugCached(slug);

  if (!project) {
    notFound();
  }

  const [initialWorkItem, initialChildren, initialComments, initialMembers] = await Promise.all([
    getProjectWorkItem(project.projectId, itemId).catch(() => undefined),
    getProjectWorkItemChildren(project.projectId, itemId).catch(() => undefined),
    getProjectWorkItemComments(project.projectId, itemId).catch(() => undefined),
    getProjectParticipants(project.workspaceId).catch(() => undefined),
  ]);

  return (
    <ProjectWorkItemRoute
      itemId={itemId}
      initialWorkItem={initialWorkItem}
      initialChildren={initialChildren}
      initialComments={initialComments}
      initialMembers={initialMembers}
    />
  );
}
