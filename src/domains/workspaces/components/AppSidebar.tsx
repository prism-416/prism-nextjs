"use client";

import * as React from "react";
import { Building2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/app/_providers/AuthProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/atomics/organisms/Sidebar";
import { getProjects, getWorkspaceAgentRunHistory } from "@/domains/projects/api";
import { getWorkspaceSprints } from "@/domains/sprints/api";
import {
  WorkspaceNavGroup,
  type WorkspaceNavItemWithPrefetch,
} from "@/domains/workspaces/components/navigation/WorkspaceNavGroup";
import {
  getGlobalWorkspaceNav,
  getWorkspacePrimaryNav,
  getWorkspaceSecondaryNav,
} from "@/domains/workspaces/constants/navigation";
import {
  getWorkspaceJobs,
  getWorkspaceMembers,
  getWorkspaceRepositories,
  getWorkspaces,
} from "@/domains/workspaces/api";
import { isActiveWorkspaceHref } from "@/domains/workspaces/utils/navigation";
import { getCurrentUser } from "@/shared/api/auth";
import { QUERY_KEYS } from "@/shared/query";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  workspaceId?: string;
  workspaceName?: string;
  workspaceSlug?: string;
};

export function AppSidebar({ workspaceId, workspaceName, workspaceSlug, ...props }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const queryClient = useQueryClient();
  const { clearSession } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const workspaceHref = workspaceSlug ? `/workspaces/${encodeURIComponent(workspaceSlug)}` : "/workspaces";
  const contextLabel = workspaceName ?? (workspaceSlug ? "Workspace" : "Workspaces");
  const contextEyebrow = workspaceSlug ? "Workspace" : "All workspaces";
  const prefetchWorkspaceListData = React.useCallback(() => {
    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.workspace.list(),
      queryFn: getWorkspaces,
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);
  const prefetchWorkspaceProjectsData = React.useCallback(() => {
    if (!workspaceId || !workspaceSlug) {
      prefetchWorkspaceListData();
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
  }, [prefetchWorkspaceListData, queryClient, workspaceId, workspaceSlug]);
  const prefetchWorkspaceAgentData = React.useCallback(() => {
    if (!workspaceId) {
      return;
    }

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.project.agentRunHistory(workspaceId),
      queryFn: () => getWorkspaceAgentRunHistory(workspaceId),
      staleTime: 5 * 1000,
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
  const prefetchWorkspaceSettingsData = React.useCallback(() => {
    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.auth.me(),
      queryFn: getCurrentUser,
      staleTime: 5 * 60 * 1000,
    });

    if (!workspaceId) {
      return;
    }

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.workspace.members(workspaceId),
      queryFn: () => getWorkspaceMembers(workspaceId),
      staleTime: 5 * 60 * 1000,
    });

    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.workspace.repositories(workspaceId),
      queryFn: () => getWorkspaceRepositories(workspaceId),
      staleTime: 60 * 1000,
    });
  }, [queryClient, workspaceId]);
  const primaryNav = React.useMemo<WorkspaceNavItemWithPrefetch[]>(
    () =>
      (workspaceSlug ? getWorkspacePrimaryNav(workspaceSlug) : getWorkspacePrimaryNav()).map(item => {
        switch (item.label) {
          case "Projects":
            return { ...item, prefetchData: prefetchWorkspaceProjectsData };
          case "Agent":
            return { ...item, prefetchData: prefetchWorkspaceAgentData };
          case "Sprints":
            return { ...item, prefetchData: prefetchWorkspaceSprintsData };
          case "Members":
            return { ...item, prefetchData: prefetchWorkspaceMembersData };
          case "Jobs":
            return { ...item, prefetchData: prefetchWorkspaceJobsData };
          default:
            return item;
        }
      }),
    [
      prefetchWorkspaceAgentData,
      prefetchWorkspaceJobsData,
      prefetchWorkspaceMembersData,
      prefetchWorkspaceProjectsData,
      prefetchWorkspaceSprintsData,
      workspaceSlug,
    ],
  );
  const secondaryNav = React.useMemo<WorkspaceNavItemWithPrefetch[]>(
    () =>
      getWorkspaceSecondaryNav(workspaceSlug).map(item => ({
        ...item,
        prefetchData: prefetchWorkspaceSettingsData,
      })),
    [prefetchWorkspaceSettingsData, workspaceSlug],
  );
  const globalNav = React.useMemo<WorkspaceNavItemWithPrefetch[]>(
    () => getGlobalWorkspaceNav().map(item => ({ ...item, prefetchData: prefetchWorkspaceListData })),
    [prefetchWorkspaceListData],
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
      <SidebarHeader className="border-b border-sidebar-border pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={contextLabel}
            >
              <Link
                href={workspaceHref}
                aria-label={`Open ${contextLabel}`}
                onMouseEnter={() => {
                  router.prefetch(workspaceHref);
                  prefetchWorkspaceProjectsData();
                }}
                onFocus={() => {
                  router.prefetch(workspaceHref);
                  prefetchWorkspaceProjectsData();
                }}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-xs text-sidebar-foreground/70">{contextEyebrow}</span>
                  <span className="truncate text-sm font-medium">{contextLabel}</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <WorkspaceNavGroup
          label="Workspace"
          items={primaryNav}
          pathname={pathname}
        />
        <WorkspaceNavGroup
          label="Manage"
          items={secondaryNav}
          pathname={pathname}
        />
      </SidebarContent>

      <SidebarFooter>
        {workspaceSlug ? (
          <>
            <SidebarSeparator className="mx-0" />
            <SidebarMenu>
              {globalNav.map(item => {
                const Icon = item.icon;
                const active = isActiveWorkspaceHref(pathname, item.href, item.exact);

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
          </>
        ) : null}
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

export default AppSidebar;
