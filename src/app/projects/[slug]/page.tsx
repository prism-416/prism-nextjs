import { notFound } from "next/navigation";

import { getProjectParticipants, getProjectWorkItems } from "@/domains/projects/api";
import { getProjectBySlugCached } from "@/domains/projects/api/server";
import { ProjectDashboardRoute } from "@/domains/projects/components/routes/ProjectDashboardRoute";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlugCached(slug);

  if (!project) {
    notFound();
  }

  const [initialData, initialMembers] = await Promise.all([
    getProjectWorkItems(project.projectId).catch(() => undefined),
    getProjectParticipants(project.workspaceId).catch(() => undefined),
  ]);

  return (
    <ProjectDashboardRoute
      initialData={initialData}
      initialMembers={initialMembers}
    />
  );
}
