import type { WorkspacePathOption, WorkspacePathSegment, WorkspacePathSwitcher } from "@/domains/workspaces/types/path";

const WORKSPACES_OVERVIEW_OPTION: WorkspacePathOption = {
  id: "workspaces-overview",
  name: "Workspaces",
  href: "/workspaces",
};

export type WorkspacePathResolveParams = {
  workspace?: WorkspacePathSegment;
  workspaceSlug?: string;
  workspaceOptions?: WorkspacePathOption[];
  project?: WorkspacePathSegment;
  projectOptions?: WorkspacePathOption[];
  section?: WorkspacePathSegment;
  pathSegments?: WorkspacePathSegment[];
};

export function getWorkspaceHref(workspaceSlug?: string) {
  return workspaceSlug ? `/workspaces/${encodeURIComponent(workspaceSlug)}` : undefined;
}

function getSwitcher(
  options: WorkspacePathOption[] | undefined,
  ariaLabel: string,
  emptyLabel: string,
): WorkspacePathSwitcher | undefined {
  if (!options) {
    return undefined;
  }

  return {
    ariaLabel,
    emptyLabel,
    options,
  };
}

function getWorkspaceSwitcherOptions(options: WorkspacePathOption[]) {
  const hasOverviewOption = options.some(option => option.href === WORKSPACES_OVERVIEW_OPTION.href);

  if (hasOverviewOption) {
    return options;
  }

  const hasCurrentWorkspace = options.some(option => option.isCurrent);

  return [
    {
      ...WORKSPACES_OVERVIEW_OPTION,
      isCurrent: !hasCurrentWorkspace,
    },
    ...options,
  ];
}

function getProjectSwitcherOptions(options: WorkspacePathOption[], workspaceSlug?: string) {
  const projectsHref = getWorkspaceHref(workspaceSlug);

  if (!projectsHref) {
    return options;
  }

  const hasProjectsOption = options.some(option => option.href === projectsHref);

  if (hasProjectsOption) {
    return options;
  }

  const hasCurrentProject = options.some(option => option.isCurrent);

  return [
    {
      id: "projects-overview",
      name: "Projects",
      href: projectsHref,
      isCurrent: !hasCurrentProject,
    },
    ...options,
  ];
}

export function resolveWorkspacePathSegments({
  workspace,
  workspaceSlug,
  workspaceOptions,
  project,
  projectOptions,
  section,
  pathSegments,
}: WorkspacePathResolveParams) {
  if (pathSegments) {
    return pathSegments;
  }

  if (!workspace) {
    return undefined;
  }

  const workspaceSegment: WorkspacePathSegment = {
    ...workspace,
    href: workspace.href ?? getWorkspaceHref(workspaceSlug),
    kind: workspace.kind ?? "workspace",
    switcher:
      workspace.switcher ??
      getSwitcher(
        workspaceOptions ? getWorkspaceSwitcherOptions(workspaceOptions) : workspaceOptions,
        `${workspace.name}, switch workspace`,
        "No workspaces yet.",
      ),
  };

  const segments = [workspaceSegment];

  if (project || projectOptions) {
    const projectName = project?.name ?? "Projects";

    segments.push({
      ...project,
      name: projectName,
      kind: project?.kind ?? "project",
      switcher:
        project?.switcher ??
        getSwitcher(
          projectOptions ? getProjectSwitcherOptions(projectOptions, workspaceSlug) : projectOptions,
          `${projectName}, switch project`,
          "No projects yet.",
        ),
    });
  }

  if (section) {
    segments.push({
      ...section,
      kind: section.kind ?? "section",
    });
  }

  return segments;
}
