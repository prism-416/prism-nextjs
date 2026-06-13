import { notFound, redirect } from "next/navigation";

import { getProjectBySlugCached } from "@/domains/projects/api/server";
import { getWorkspacesCached } from "@/domains/workspaces/api/server";

type ProjectSprintPageProps = {
  params: Promise<{
    slug: string;
    sprintId: string;
  }>;
};

export default async function ProjectSprintPage({ params }: ProjectSprintPageProps) {
  const { slug, sprintId } = await params;
  const project = await getProjectBySlugCached(slug);

  if (!project) {
    notFound();
  }

  const workspaces = await getWorkspacesCached();
  const workspace = workspaces.find(item => item.workspaceId === project.workspaceId);

  if (!workspace) {
    notFound();
  }

  redirect(`/workspaces/${encodeURIComponent(workspace.slug)}/sprints/${encodeURIComponent(sprintId)}`);
}
