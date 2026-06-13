import { notFound } from "next/navigation";

import { getProjectParticipants, getTrashedProjectWorkItems } from "@/domains/projects/api";
import { getProjectBySlugCached } from "@/domains/projects/api/server";
import { ProjectTrashRoute } from "@/domains/projects/components/routes/ProjectTrashRoute";

type ProjectTrashPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectTrashPage({ params }: ProjectTrashPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlugCached(slug);

  if (!project) {
    notFound();
  }

  const [initialData, initialMembers] = await Promise.all([
    getTrashedProjectWorkItems(project.projectId).catch(() => undefined),
    getProjectParticipants(project.workspaceId).catch(() => undefined),
  ]);

  return (
    <ProjectTrashRoute
      initialData={initialData}
      initialMembers={initialMembers}
    />
  );
}
