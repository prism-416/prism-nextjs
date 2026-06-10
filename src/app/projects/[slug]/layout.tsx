import type * as React from "react";
import { notFound } from "next/navigation";

import { getProjectBySlug, getProjects } from "@/domains/projects/api";
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

  const [workspace, workspaces] = await Promise.all([
    getWorkspaceById(project.workspaceId).catch(() => undefined),
    getWorkspaces().catch(() => []),
  ]);

  if (!workspace) {
    notFound();
  }

  const projects = await getProjects(workspace.slug).catch(() => []);

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
