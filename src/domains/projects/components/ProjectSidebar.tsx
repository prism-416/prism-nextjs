"use client";

import * as React from "react";
import {
  ArrowLeft,
  CalendarRange,
  Files,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Users,
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
};

type ProjectSidebarNavGroupProps = {
  label: string;
  items: ProjectSidebarNavItem[];
  pathname: string;
  hash: string;
};

const URL_BASE = "https://prism.local";

function getHrefParts(href: string) {
  const url = new URL(href, URL_BASE);

  return {
    hash: url.hash,
    pathname: url.pathname,
  };
}

function isActiveProjectHref(pathname: string, hash: string, item: ProjectSidebarNavItem) {
  const itemUrl = getHrefParts(item.href);

  if (itemUrl.hash) {
    if (itemUrl.hash === "#overview") {
      return pathname === itemUrl.pathname && (hash === "" || hash === itemUrl.hash);
    }

    return pathname === itemUrl.pathname && hash === itemUrl.hash;
  }

  if (item.exact) {
    return pathname === itemUrl.pathname;
  }

  return pathname === itemUrl.pathname || pathname.startsWith(`${itemUrl.pathname}/`);
}

function ProjectSidebarNavGroup({ label, items, pathname, hash }: ProjectSidebarNavGroupProps) {
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
            const active = isActiveProjectHref(pathname, hash, item);

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
  const [hash, setHash] = React.useState("");
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const projectHref = `/projects/${encodeURIComponent(projectSlug)}`;
  const workspaceHref = workspaceSlug ? `/workspaces/${encodeURIComponent(workspaceSlug)}` : "/workspaces";
  const projectLabel = projectName ?? "Project";
  const primaryNav = React.useMemo<ProjectSidebarNavItem[]>(
    () => [
      { label: "Overview", href: `${projectHref}#overview`, icon: FolderKanban, exact: true },
      { label: "Members", href: `${projectHref}#members`, icon: Users, exact: true },
      { label: "Sprints", href: `${projectHref}#sprints`, icon: CalendarRange, exact: true },
      { label: "Documents", href: `${projectHref}#documents`, icon: Files, exact: true },
      { label: "My tasks", href: `${projectHref}#my-tasks`, icon: ListTodo, exact: true },
    ],
    [projectHref],
  );
  const secondaryNav = React.useMemo<ProjectSidebarNavItem[]>(
    () => [
      { label: "Workspace projects", href: workspaceHref, icon: ArrowLeft, exact: true },
      { label: "All workspaces", href: "/workspaces", icon: LayoutDashboard, exact: true },
    ],
    [workspaceHref],
  );

  React.useEffect(() => {
    function syncHash() {
      setHash(window.location.hash);
    }

    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);

    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [pathname]);

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
                aria-label={`${projectLabel} overview`}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
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
          hash={hash}
        />
        <ProjectSidebarNavGroup
          label="Workspace"
          items={secondaryNav}
          pathname={pathname}
          hash={hash}
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
