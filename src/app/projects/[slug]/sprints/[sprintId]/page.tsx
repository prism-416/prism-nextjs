import { notFound, redirect } from "next/navigation";

import { getProjectBySlug } from "@/domains/projects/api";
import { getWorkspaceById } from "@/domains/workspaces/api";

type ProjectSprintPageProps = {
  params: Promise<{
    slug: string;
    sprintId: string;
  }>;
};

export default async function ProjectSprintPage({ params }: ProjectSprintPageProps) {
  const { slug, sprintId } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const workspace = await getWorkspaceById(project.workspaceId);

  if (!workspace) {
    notFound();
  }

  redirect(`/workspaces/${encodeURIComponent(workspace.slug)}/sprints/${encodeURIComponent(sprintId)}`);
}
