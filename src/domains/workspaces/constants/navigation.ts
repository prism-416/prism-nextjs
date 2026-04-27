import { BarChart3, FolderKanban, LayoutDashboard, LifeBuoy, Settings, Users, type LucideIcon } from "lucide-react";

export type WorkspaceNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const WORKSPACE_PRIMARY_NAV: WorkspaceNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Members", href: "/members", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export const WORKSPACE_SECONDARY_NAV: WorkspaceNavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Support", href: "/support", icon: LifeBuoy },
];
