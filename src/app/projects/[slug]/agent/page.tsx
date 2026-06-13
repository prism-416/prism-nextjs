import { notFound } from "next/navigation";

import { getWorkspaceAgentRunHistory } from "@/domains/projects/api";
import { getProjectBySlugCached } from "@/domains/projects/api/server";
import { ProjectAgentRoute } from "@/domains/projects/components/routes/ProjectAgentRoute";

type ProjectAgentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectAgentPage({ params }: ProjectAgentPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlugCached(slug);

  if (!project) {
    notFound();
  }

  const initialData = await getWorkspaceAgentRunHistory(project.workspaceId).catch(() => undefined);

  return <ProjectAgentRoute initialData={initialData} />;
}
