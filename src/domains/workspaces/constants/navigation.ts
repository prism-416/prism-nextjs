import {
  BriefcaseBusiness,
  CalendarRange,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type WorkspaceNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

type WorkspaceScopedNavItem = Omit<WorkspaceNavItem, "href"> & {
  href: (workspaceSlug: string) => string;
};

const WORKSPACE_PRIMARY_NAV: WorkspaceScopedNavItem[] = [
  {
    label: "Projects",
    href: workspaceSlug => `/workspaces/${encodeURIComponent(workspaceSlug)}`,
    icon: FolderKanban,
    exact: true,
  },
  {
    label: "Sprints",
    href: workspaceSlug => `/workspaces/${encodeURIComponent(workspaceSlug)}/sprints`,
    icon: CalendarRange,
  },
  { label: "Members", href: workspaceSlug => `/workspaces/${encodeURIComponent(workspaceSlug)}/members`, icon: Users },
  {
    label: "Jobs",
    href: workspaceSlug => `/workspaces/${encodeURIComponent(workspaceSlug)}/jobs`,
    icon: BriefcaseBusiness,
  },
];

const WORKSPACE_SECONDARY_NAV: WorkspaceScopedNavItem[] = [
  {
    label: "Settings",
    href: workspaceSlug => `/workspaces/${encodeURIComponent(workspaceSlug)}/settings`,
    icon: Settings,
  },
];

const GLOBAL_WORKSPACE_NAV: WorkspaceNavItem[] = [
  { label: "All workspaces", href: "/workspaces", icon: LayoutDashboard, exact: true },
];

export function getWorkspacePrimaryNav(workspaceSlug?: string): WorkspaceNavItem[] {
  if (!workspaceSlug) {
    return GLOBAL_WORKSPACE_NAV;
  }

  return WORKSPACE_PRIMARY_NAV.map(item => ({
    ...item,
    href: item.href(workspaceSlug),
  }));
}

export function getWorkspaceSecondaryNav(workspaceSlug?: string): WorkspaceNavItem[] {
  if (!workspaceSlug) {
    return [];
  }

  return [
    ...WORKSPACE_SECONDARY_NAV.map(item => ({
      ...item,
      href: item.href(workspaceSlug),
    })),
    ...GLOBAL_WORKSPACE_NAV,
  ];
}
