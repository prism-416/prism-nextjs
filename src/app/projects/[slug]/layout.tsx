import type * as React from "react";
import { notFound } from "next/navigation";

import { getProjectBySlug, getProjectsByWorkspaceId } from "@/domains/projects/api";
import { ProjectRouteShell } from "@/domains/projects/components/ProjectRouteShell";
import { getWorkspaceById, getWorkspaces } from "@/domains/workspaces/api";

type ProjectLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Fetch all three in parallel: they only depend on project.workspaceId (known
  // above), so there is no reason to wait for the workspace before fetching its
  // projects. Keying projects on the id rather than the resolved slug removes a
  // full round trip from the project route's render path.
  const [workspace, workspaces, projects] = await Promise.all([
    getWorkspaceById(project.workspaceId).catch(() => undefined),
    getWorkspaces().catch(() => []),
    getProjectsByWorkspaceId(project.workspaceId).catch(() => []),
  ]);

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
