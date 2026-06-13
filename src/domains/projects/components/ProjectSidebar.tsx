"use client";

import * as React from "react";
import {
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarRange,
  Files,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
  Trash2,
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
import {
  getProjects,
  getProjectDocuments,
  getProjectWorkItems,
  getTrashedProjectWorkItems,
  getWorkspaceAgentRunHistory,
} from "@/domains/projects/api";
import { PROJECT_DASHBOARD_WORK_ITEM_FILTERS } from "@/domains/projects/constants/dashboard";
import type { ProjectDocumentSearchResult } from "@/domains/projects/types";
import { getWorkspaceSprints } from "@/domains/sprints/api";
import { getWorkspaceJobs, getWorkspaceMembers } from "@/domains/workspaces/api";
import { getCurrentUser } from "@/shared/api/auth";
import { QUERY_KEYS } from "@/shared/query";

type ProjectSidebarProps = React.ComponentProps<typeof Sidebar> & {
  projectId?: string;
  projectName?: string;
  projectSlug: string;
  workspaceId?: string;
  workspaceName?: string;
  workspaceSlug?: string;
};

type ProjectSidebarNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  activePathPrefixes?: string[];
  prefetchData?: () => void;
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
  const router = useRouter();

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
                    onMouseEnter={() => {
                      router.prefetch(item.href);
                      item.prefetchData?.();
                    }}
                    onFocus={() => {
                      router.prefetch(item.href);
                      item.prefetchData?.();
                    }}
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

export function ProjectSidebar({
  projectId,
  projectName,
  projectSlug,
  workspaceId,
  workspaceName,
  workspaceSlug,
  ...props
}: ProjectSidebarProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const queryClient = useQueryClient();
  const { clearSession } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const projectHref = `/projects/${encodeURIComponent(projectSlug)}`;
  const workspaceHref = workspaceSlug ? `/workspaces/${encodeURIComponent(workspaceSlug)}` : "/workspaces";
  const projectLabel = projectName ?? "Project";
  const workspaceLabel = workspaceName ?? "Workspace";
  const prefetchDashboardData = React.useCallback(() => {
    if (!projectId) {
      return;
    }

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.project.workItemList(projectId, PROJECT_DASHBOARD_WORK_ITEM_FILTERS),
      queryFn: () => getProjectWorkItems(projectId, PROJECT_DASHBOARD_WORK_ITEM_FILTERS),
      staleTime: 5 * 60 * 1000,
    });

    if (workspaceId) {
      void queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.workspace.members(workspaceId),
        queryFn: () => getWorkspaceMembers(workspaceId),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [projectId, queryClient, workspaceId]);
  const prefetchAgentData = React.useCallback(() => {
    if (!workspaceId) {
      return;
    }

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.project.agentRunHistory(workspaceId),
      queryFn: () => getWorkspaceAgentRunHistory(workspaceId),
      staleTime: 5 * 1000,
    });
  }, [queryClient, workspaceId]);
  const prefetchDocumentsData = React.useCallback(() => {
    if (!projectId) {
      return;
    }

    const searchParams = { limit: 50, offset: 0 };
    void queryClient.prefetchInfiniteQuery({
      queryKey: QUERY_KEYS.project.documentList(projectId, {
        ...searchParams,
        infinite: true,
      }),
      queryFn: ({ pageParam }) =>
        getProjectDocuments(projectId, {
          ...searchParams,
          offset: typeof pageParam === "number" ? pageParam : 0,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage: ProjectDocumentSearchResult) => {
        const nextOffset = lastPage.offset + lastPage.items.length;
        return nextOffset < lastPage.total ? nextOffset : undefined;
      },
      staleTime: 5 * 60 * 1000,
    });
  }, [projectId, queryClient]);
  const prefetchMyTasksData = React.useCallback(() => {
    if (!projectId) {
      return;
    }

    void queryClient
      .fetchQuery({
        queryKey: QUERY_KEYS.auth.me(),
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000,
      })
      .then(currentUser => {
        if (!currentUser?.username) {
          return;
        }

        const searchParams = { assigneeUsername: currentUser.username };
        void queryClient.prefetchQuery({
          queryKey: QUERY_KEYS.project.myTasks(projectId, currentUser.username, searchParams),
          queryFn: () => getProjectWorkItems(projectId, searchParams),
          staleTime: 5 * 60 * 1000,
        });
      })
      .catch(() => undefined);

    if (workspaceId) {
      void queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.workspace.members(workspaceId),
        queryFn: () => getWorkspaceMembers(workspaceId),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [projectId, queryClient, workspaceId]);
  const prefetchTrashData = React.useCallback(() => {
    if (!projectId) {
      return;
    }

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.project.workItemTrash(projectId),
      queryFn: () => getTrashedProjectWorkItems(projectId),
      staleTime: 60 * 1000,
    });

    if (workspaceId) {
      void queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.workspace.members(workspaceId),
        queryFn: () => getWorkspaceMembers(workspaceId),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [projectId, queryClient, workspaceId]);
  const prefetchSettingsData = React.useCallback(() => {
    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.auth.me(),
      queryFn: getCurrentUser,
      staleTime: 5 * 60 * 1000,
    });

    if (workspaceId) {
      void queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.workspace.members(workspaceId),
        queryFn: () => getWorkspaceMembers(workspaceId),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [queryClient, workspaceId]);
  const prefetchWorkspaceMembersData = React.useCallback(() => {
    if (!workspaceId) {
      return;
    }

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.workspace.members(workspaceId),
      queryFn: () => getWorkspaceMembers(workspaceId),
      staleTime: 5 * 60 * 1000,
    });

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.workspace.jobs(workspaceId),
      queryFn: () => getWorkspaceJobs(workspaceId),
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient, workspaceId]);
  const prefetchWorkspaceJobsData = React.useCallback(() => {
    if (!workspaceId) {
      return;
    }

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.workspace.jobs(workspaceId),
      queryFn: () => getWorkspaceJobs(workspaceId),
      staleTime: 5 * 60 * 1000,
    });

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.workspace.members(workspaceId),
      queryFn: () => getWorkspaceMembers(workspaceId),
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient, workspaceId]);
  const prefetchWorkspaceSprintsData = React.useCallback(() => {
    if (!workspaceId) {
      return;
    }

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.workspace.sprints(workspaceId),
      queryFn: () => getWorkspaceSprints(workspaceId),
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient, workspaceId]);
  const prefetchWorkspaceProjectsData = React.useCallback(() => {
    if (!workspaceId || !workspaceSlug) {
      return;
    }

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.project.listByWorkspaceSlug(workspaceSlug),
      queryFn: () => getProjects(workspaceSlug),
      staleTime: 5 * 60 * 1000,
    });

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.workspace.members(workspaceId),
      queryFn: () => getWorkspaceMembers(workspaceId),
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient, workspaceId, workspaceSlug]);
  const primaryNav = React.useMemo<ProjectSidebarNavItem[]>(
    () => [
      {
        label: "Dashboard",
        href: projectHref,
        icon: LayoutDashboard,
        exact: true,
        activePathPrefixes: [`${projectHref}/work-items`],
        prefetchData: prefetchDashboardData,
      },
      { label: "Agent", href: `${projectHref}/agent`, icon: Bot, exact: true, prefetchData: prefetchAgentData },
      {
        label: "Documents",
        href: `${projectHref}/documents`,
        icon: Files,
        exact: true,
        prefetchData: prefetchDocumentsData,
      },
      {
        label: "My tasks",
        href: `${projectHref}/my-tasks`,
        icon: ListTodo,
        exact: true,
        prefetchData: prefetchMyTasksData,
      },
    ],
    [prefetchAgentData, prefetchDashboardData, prefetchDocumentsData, prefetchMyTasksData, projectHref],
  );
  const workspaceNav = React.useMemo<ProjectSidebarNavItem[]>(
    () =>
      workspaceSlug
        ? [
            {
              label: "Projects",
              href: workspaceHref,
              icon: FolderKanban,
              exact: true,
              prefetchData: prefetchWorkspaceProjectsData,
            },
            {
              label: "Sprints",
              href: `${workspaceHref}/sprints`,
              icon: CalendarRange,
              prefetchData: prefetchWorkspaceSprintsData,
            },
            {
              label: "Members",
              href: `${workspaceHref}/members`,
              icon: Users,
              prefetchData: prefetchWorkspaceMembersData,
            },
            {
              label: "Jobs",
              href: `${workspaceHref}/jobs`,
              icon: BriefcaseBusiness,
              prefetchData: prefetchWorkspaceJobsData,
            },
          ]
        : [],
    [
      prefetchWorkspaceJobsData,
      prefetchWorkspaceMembersData,
      prefetchWorkspaceProjectsData,
      prefetchWorkspaceSprintsData,
      workspaceHref,
      workspaceSlug,
    ],
  );
  const projectAdminNav = React.useMemo<ProjectSidebarNavItem[]>(
    () => [
      {
        label: "Settings",
        href: `${projectHref}/settings`,
        icon: Settings,
        exact: true,
        prefetchData: prefetchSettingsData,
      },
      {
        label: "Trash",
        href: `${projectHref}/trash`,
        icon: Trash2,
        exact: true,
        prefetchData: prefetchTrashData,
      },
    ],
    [prefetchSettingsData, prefetchTrashData, projectHref],
  );
  const globalNav = React.useMemo<ProjectSidebarNavItem[]>(
    () => [{ label: "All workspaces", href: "/workspaces", icon: LayoutDashboard, exact: true }],
    [],
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
      <SidebarHeader className="gap-1 border-b border-sidebar-border pb-2">
        <SidebarMenu>
          {workspaceSlug ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="sm"
                tooltip={workspaceLabel}
              >
                <Link
                  href={workspaceHref}
                  aria-label={`Open ${workspaceLabel} workspace`}
                  onMouseEnter={() => {
                    router.prefetch(workspaceHref);
                    prefetchWorkspaceProjectsData();
                  }}
                  onFocus={() => {
                    router.prefetch(workspaceHref);
                    prefetchWorkspaceProjectsData();
                  }}
                >
                  <Building2 />
                  <span>{workspaceLabel}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : null}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={projectLabel}
            >
              <Link
                href={projectHref}
                aria-label={`${projectLabel} dashboard`}
                onMouseEnter={() => {
                  router.prefetch(projectHref);
                  prefetchDashboardData();
                }}
                onFocus={() => {
                  router.prefetch(projectHref);
                  prefetchDashboardData();
                }}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  <FolderKanban className="size-4" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-xs text-sidebar-foreground/70">Current project</span>
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
          label="Workspace"
          items={workspaceNav}
          pathname={pathname}
        />
        <ProjectSidebarNavGroup
          label="Manage project"
          items={projectAdminNav}
          pathname={pathname}
        />
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator className="mx-0" />
        <SidebarMenu>
          {globalNav.map(item => {
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
                    onMouseEnter={() => router.prefetch(item.href)}
                    onFocus={() => router.prefetch(item.href)}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
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
