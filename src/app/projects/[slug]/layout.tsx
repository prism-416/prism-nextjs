import type * as React from "react";
import { notFound } from "next/navigation";

import { getProjectBySlugCached, getProjectsByWorkspaceIdCached } from "@/domains/projects/api/server";
import { ProjectRouteShell } from "@/domains/projects/components/ProjectRouteShell";
import { getWorkspaceByIdCached, getWorkspacesCached } from "@/domains/workspaces/api/server";

type ProjectLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { slug } = await params;
  const project = await getProjectBySlugCached(slug);

  if (!project) {
    notFound();
  }

  // The workspace list already contains the current workspace. Reuse it on the
  // normal path and reserve the detail request as a fallback.
  const [workspaces, projects] = await Promise.all([
    getWorkspacesCached().catch(() => []),
    getProjectsByWorkspaceIdCached(project.workspaceId).catch(() => []),
  ]);
  const workspace =
    workspaces.find(item => item.workspaceId === project.workspaceId) ??
    (await getWorkspaceByIdCached(project.workspaceId).catch(() => undefined));

  if (!workspace) {
    notFound();
  }

  return (
    <ProjectRouteShell
      project={project}
      workspace={workspace}
      workspaces={workspaces}
      projects={projects}
    >
      {children}
    </ProjectRouteShell>
  );
}
