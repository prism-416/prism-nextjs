"use client";

import * as React from "react";
import {
  Bot,
  Files,
  FolderKanban,
  LayoutDashboard,
  Layers,
  ListTodo,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/app/_providers/AuthProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/atomics/organisms/Sidebar";

type ProjectSidebarProps = React.ComponentProps<typeof Sidebar> & {
  projectName?: string;
  projectSlug: string;
  workspaceSlug?: string;
};

type ProjectSidebarNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  activePathPrefixes?: string[];
};

type ProjectSidebarNavGroupProps = {
  label: string;
  items: ProjectSidebarNavItem[];
  pathname: string;
};

const URL_BASE = "https://prism.local";

function getHrefPathname(href: string) {
  const url = new URL(href, URL_BASE);

  return url.pathname;
}

function isActiveProjectHref(pathname: string, item: ProjectSidebarNavItem) {
  const itemPathname = getHrefPathname(item.href);
  const matchesAdditionalPath = item.activePathPrefixes?.some(prefix => {
    const prefixPathname = getHrefPathname(prefix);

    return pathname === prefixPathname || pathname.startsWith(`${prefixPathname}/`);
  });

  if (matchesAdditionalPath) {
    return true;
  }

  if (item.exact) {
    return pathname === itemPathname;
  }

  return pathname === itemPathname || pathname.startsWith(`${itemPathname}/`);
}

function ProjectSidebarNavGroup({ label, items, pathname }: ProjectSidebarNavGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => {
            const Icon = item.icon;
            const active = isActiveProjectHref(pathname, item);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.label}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function ProjectSidebar({ projectName, projectSlug, workspaceSlug, ...props }: ProjectSidebarProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const queryClient = useQueryClient();
  const { clearSession } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const projectHref = `/projects/${encodeURIComponent(projectSlug)}`;
  const workspaceHref = workspaceSlug ? `/workspaces/${encodeURIComponent(workspaceSlug)}` : "/workspaces";
  const projectLabel = projectName ?? "Project";
  const primaryNav = React.useMemo<ProjectSidebarNavItem[]>(
    () => [
      {
        label: "Dashboard",
        href: projectHref,
        icon: LayoutDashboard,
        exact: true,
        activePathPrefixes: [`${projectHref}/work-items`],
      },
      { label: "Agent", href: `${projectHref}/agent`, icon: Bot, exact: true },
      { label: "Documents", href: `${projectHref}/documents`, icon: Files, exact: true },
      { label: "My tasks", href: `${projectHref}/my-tasks`, icon: ListTodo, exact: true },
    ],
    [projectHref],
  );
  const generalNav = React.useMemo<ProjectSidebarNavItem[]>(
    () => [
      { label: "Settings", href: `${projectHref}/settings`, icon: Settings, exact: true },
      { label: "Workspace projects", href: workspaceHref, icon: Layers, exact: true },
      { label: "All workspaces", href: "/workspaces", icon: LayoutDashboard, exact: true },
    ],
    [projectHref, workspaceHref],
  );

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await clearSession();
      queryClient.clear();
      router.replace("/sign-in");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={projectLabel}
            >
              <Link
                href={projectHref}
                aria-label={`${projectLabel} dashboard`}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  <FolderKanban className="size-4" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-xs text-sidebar-foreground/70">Project</span>
                  <span className="truncate text-sm font-medium">{projectLabel}</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ProjectSidebarNavGroup
          label="Project"
          items={primaryNav}
          pathname={pathname}
        />
        <ProjectSidebarNavGroup
          label="General"
          items={generalNav}
          pathname={pathname}
        />
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator className="mx-0" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              tooltip="Logout"
              onClick={() => {
                void handleLogout();
              }}
              disabled={isLoggingOut}
            >
              <LogOut />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex justify-end px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <SidebarTrigger />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
