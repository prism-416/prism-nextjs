import type * as React from "react";
import { notFound } from "next/navigation";

import { getProjectBySlug, getProjects } from "@/domains/projects/api";
import { ProjectRealtimeRoomBridge } from "@/domains/projects/components/ProjectRealtimeRoomBridge";
import { ProjectSidebar } from "@/domains/projects/components/ProjectSidebar";
import { getWorkspaceById, getWorkspaces } from "@/domains/workspaces/api";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";
import type { WorkspacePathSegment } from "@/domains/workspaces/types/path";

type ProjectPageShellContext = {
  projectId: string;
  projectSlug: string;
  workspaceId: string;
  workspaceSlug?: string;
};

type ProjectPageShellProps = {
  slug: string;
  section?: WorkspacePathSegment;
  children: React.ReactNode | ((context: ProjectPageShellContext) => React.ReactNode);
};

export async function ProjectPageShell({ slug, section, children }: ProjectPageShellProps) {
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const [workspace, workspaces] = await Promise.all([
    getWorkspaceById(project.workspaceId).catch(() => undefined),
    getWorkspaces().catch(() => []),
  ]);
  const projects = workspace?.slug ? await getProjects(workspace.slug).catch(() => []) : [];
  const workspaceSlug = workspace?.slug;

  const resolvedChildren =
    typeof children === "function"
      ? children({
          projectId: project.projectId,
          projectSlug: project.slug,
          workspaceId: project.workspaceId,
          workspaceSlug,
        })
      : children;

  return (
    <WorkspaceShell
      workspace={workspace ? { name: workspace.name } : undefined}
      workspaceSlug={workspaceSlug}
      workspaceOptions={workspaces.map(item => ({
        id: item.workspaceId,
        name: item.name,
        href: `/workspaces/${encodeURIComponent(item.slug)}`,
        isCurrent: item.slug === workspaceSlug,
      }))}
      project={{ name: project.name }}
      projectOptions={projects.map(item => ({
        id: item.projectId,
        name: item.name,
        href: `/projects/${encodeURIComponent(item.slug)}`,
        isCurrent: item.slug === slug,
      }))}
      section={section}
      sidebar={
        <ProjectSidebar
          projectName={project.name}
          projectSlug={slug}
          workspaceSlug={workspaceSlug}
        />
      }
    >
      <ProjectRealtimeRoomBridge projectId={project.projectId} />
      {resolvedChildren}
    </WorkspaceShell>
  );
}
