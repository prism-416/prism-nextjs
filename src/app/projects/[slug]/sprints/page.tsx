import { notFound, redirect } from "next/navigation";

import { getProjectBySlug } from "@/domains/projects/api";
import { getWorkspaceById } from "@/domains/workspaces/api";

type ProjectSprintsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectSprintsPage({ params }: ProjectSprintsPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const workspace = await getWorkspaceById(project.workspaceId);

  if (!workspace) {
    notFound();
  }

  redirect(`/workspaces/${encodeURIComponent(workspace.slug)}/sprints`);
}
