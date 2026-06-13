import { notFound } from "next/navigation";

import { getProjectDocuments } from "@/domains/projects/api";
import { getProjectBySlugCached } from "@/domains/projects/api/server";
import { ProjectDocumentsRoute } from "@/domains/projects/components/routes/ProjectDocumentsRoute";

type ProjectDocumentsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDocumentsPage({ params }: ProjectDocumentsPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlugCached(slug);

  if (!project) {
    notFound();
  }

  const initialData = await getProjectDocuments(project.projectId).catch(() => undefined);

  return <ProjectDocumentsRoute initialData={initialData} />;
}
