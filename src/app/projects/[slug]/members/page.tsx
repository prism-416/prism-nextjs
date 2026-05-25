import { notFound, redirect } from "next/navigation";

import { getProjectBySlug } from "@/domains/projects/api";
import { getWorkspaceById } from "@/domains/workspaces/api";

type ProjectMembersPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectMembersPage({ params }: ProjectMembersPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const workspace = await getWorkspaceById(project.workspaceId);

  if (!workspace) {
    notFound();
  }

  redirect(`/workspaces/${encodeURIComponent(workspace.slug)}/members`);
}
