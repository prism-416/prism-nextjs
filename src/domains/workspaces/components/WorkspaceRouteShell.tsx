"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import type { ProjectSummary } from "@/domains/projects/types";
import { useProjects } from "@/domains/projects/hooks/useProjects";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";
import { useWorkspaceById } from "@/domains/workspaces/hooks/useWorkspaceById";
import { useWorkspaces } from "@/domains/workspaces/hooks/useWorkspaces";
import type { Workspace } from "@/domains/workspaces/types";
import type { WorkspacePathSegment } from "@/domains/workspaces/types/path";

type WorkspaceRouteContextValue = {
  workspace: Workspace;
  workspaceSlug: string;
  projects: ProjectSummary[];
  projectSlugsById: Record<string, string>;
  projectNamesById: Record<string, string>;
};

type WorkspaceRouteShellProps = {
  children: React.ReactNode;
  workspace: Workspace;
  workspaceSlug: string;
  workspaces: Workspace[];
  projects: ProjectSummary[];
};

const WorkspaceRouteContext = React.createContext<WorkspaceRouteContextValue | null>(null);

function getWorkspaceSection(pathname: string, workspaceSlug: string): WorkspacePathSegment | undefined {
  const workspaceHref = `/workspaces/${encodeURIComponent(workspaceSlug)}`;

  if (pathname === workspaceHref) {
    return undefined;
  }

  if (pathname.startsWith(`${workspaceHref}/sprints/`)) {
    return {
      name: "Sprints",
      href: `${workspaceHref}/sprints`,
    };
  }

  const section = pathname.slice(workspaceHref.length + 1).split("/")[0];

  switch (section) {
    case "jobs":
      return { name: "Jobs" };
    case "members":
      return { name: "Members" };
    case "settings":
      return { name: "Settings" };
    case "sprints":
      return { name: "Sprints" };
    default:
      return undefined;
  }
}

export function useWorkspaceRoute() {
  const context = React.useContext(WorkspaceRouteContext);

  if (!context) {
    throw new Error("useWorkspaceRoute must be used within WorkspaceRouteShell.");
  }

  return context;
}

export function WorkspaceRouteShell({
  children,
  workspace,
  workspaceSlug,
  workspaces,
  projects,
}: WorkspaceRouteShellProps) {
  const pathname = usePathname() ?? "/";
  const { data: liveWorkspaces = workspaces } = useWorkspaces({ initialData: workspaces });
  const { data: liveWorkspace } = useWorkspaceById(workspace.workspaceId, workspace);
  const { data: liveProjects = projects } = useProjects(workspaceSlug, projects);
  const resolvedWorkspace = liveWorkspace ?? workspace;
  const section = getWorkspaceSection(pathname, workspaceSlug);
  const showProjectsSegment = section === undefined;
  const contextValue = React.useMemo<WorkspaceRouteContextValue>(
    () => ({
      workspace: resolvedWorkspace,
      workspaceSlug,
      projects: liveProjects,
      projectSlugsById: Object.fromEntries(liveProjects.map(project => [project.projectId, project.slug])),
      projectNamesById: Object.fromEntries(liveProjects.map(project => [project.projectId, project.name])),
    }),
    [liveProjects, resolvedWorkspace, workspaceSlug],
  );

  return (
    <WorkspaceRouteContext.Provider value={contextValue}>
      <WorkspaceShell
        workspaceId={resolvedWorkspace.workspaceId}
        workspace={{ name: resolvedWorkspace.name }}
        workspaceSlug={workspaceSlug}
        workspaceOptions={liveWorkspaces.map(item => ({
          id: item.workspaceId,
          name: item.name,
          href: `/workspaces/${encodeURIComponent(item.slug)}`,
          isCurrent: item.slug === workspaceSlug,
        }))}
        project={showProjectsSegment ? { name: "Projects" } : undefined}
        projectOptions={
          showProjectsSegment
            ? liveProjects.map(project => ({
                id: project.projectId,
                name: project.name,
                href: `/projects/${encodeURIComponent(project.slug)}`,
              }))
            : undefined
        }
        section={section}
      >
        {children}
      </WorkspaceShell>
    </WorkspaceRouteContext.Provider>
  );
}
