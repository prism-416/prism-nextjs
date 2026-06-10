"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { ProjectRealtimeRoomBridge } from "@/domains/projects/components/ProjectRealtimeRoomBridge";
import { ProjectSidebar } from "@/domains/projects/components/ProjectSidebar";
import { useProject } from "@/domains/projects/hooks/useProject";
import { useProjects } from "@/domains/projects/hooks/useProjects";
import type { Project, ProjectSummary } from "@/domains/projects/types";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";
import { useWorkspaceById } from "@/domains/workspaces/hooks/useWorkspaceById";
import { useWorkspaces } from "@/domains/workspaces/hooks/useWorkspaces";
import type { Workspace } from "@/domains/workspaces/types";
import type { WorkspacePathSegment } from "@/domains/workspaces/types/path";

type ProjectRouteContextValue = {
  project: Project;
  projectId: string;
  projectSlug: string;
  workspace: Workspace;
  workspaceId: string;
  workspaceSlug: string;
};

type ProjectRouteShellProps = {
  children: React.ReactNode;
  project: Project;
  workspace: Workspace;
  workspaces: Workspace[];
  projects: ProjectSummary[];
};

const ProjectRouteContext = React.createContext<ProjectRouteContextValue | null>(null);

function getProjectSection(pathname: string, projectSlug: string): WorkspacePathSegment | undefined {
  const projectHref = `/projects/${encodeURIComponent(projectSlug)}`;

  if (pathname === projectHref) {
    return undefined;
  }

  if (pathname.startsWith(`${projectHref}/work-items/`)) {
    return {
      name: "Dashboard",
      href: projectHref,
    };
  }

  const section = pathname.slice(projectHref.length + 1).split("/")[0];

  switch (section) {
    case "agent":
      return { name: "Agent" };
    case "documents":
      return { name: "Documents" };
    case "members":
      return { name: "Members" };
    case "my-tasks":
      return { name: "My tasks" };
    case "settings":
      return { name: "Settings" };
    case "sprints":
      return { name: "Sprints" };
    case "trash":
      return { name: "Trash" };
    default:
      return undefined;
  }
}

export function useProjectRoute() {
  const context = React.useContext(ProjectRouteContext);

  if (!context) {
    throw new Error("useProjectRoute must be used within ProjectRouteShell.");
  }

  return context;
}

export function ProjectRouteShell({ children, project, workspace, workspaces, projects }: ProjectRouteShellProps) {
  const pathname = usePathname() ?? "/";
  const { data: liveProject } = useProject(project.slug, project);
  const resolvedProject = liveProject ?? project;
  const { data: liveWorkspace } = useWorkspaceById(resolvedProject.workspaceId, workspace);
  const resolvedWorkspace = liveWorkspace ?? workspace;
  const { data: liveWorkspaces = workspaces } = useWorkspaces({ initialData: workspaces });
  const { data: liveProjects = projects } = useProjects(resolvedWorkspace.slug, projects);
  const section = getProjectSection(pathname, resolvedProject.slug);
  const contextValue = React.useMemo<ProjectRouteContextValue>(
    () => ({
      project: resolvedProject,
      projectId: resolvedProject.projectId,
      projectSlug: resolvedProject.slug,
      workspace: resolvedWorkspace,
      workspaceId: resolvedWorkspace.workspaceId,
      workspaceSlug: resolvedWorkspace.slug,
    }),
    [resolvedProject, resolvedWorkspace],
  );

  return (
    <ProjectRouteContext.Provider value={contextValue}>
      <WorkspaceShell
        workspaceId={resolvedWorkspace.workspaceId}
        workspace={{ name: resolvedWorkspace.name }}
        workspaceSlug={resolvedWorkspace.slug}
        workspaceOptions={liveWorkspaces.map(item => ({
          id: item.workspaceId,
          name: item.name,
          href: `/workspaces/${encodeURIComponent(item.slug)}`,
          isCurrent: item.slug === resolvedWorkspace.slug,
        }))}
        project={{ name: resolvedProject.name }}
        projectOptions={liveProjects.map(item => ({
          id: item.projectId,
          name: item.name,
          href: `/projects/${encodeURIComponent(item.slug)}`,
          isCurrent: item.slug === resolvedProject.slug,
        }))}
        section={section}
        sidebar={
          <ProjectSidebar
            projectName={resolvedProject.name}
            projectSlug={resolvedProject.slug}
            workspaceSlug={resolvedWorkspace.slug}
          />
        }
      >
        <ProjectRealtimeRoomBridge projectId={resolvedProject.projectId} />
        {children}
      </WorkspaceShell>
    </ProjectRouteContext.Provider>
  );
}
