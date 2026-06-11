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
import { WorkspaceNavGroup } from "@/domains/workspaces/components/navigation/WorkspaceNavGroup";
import {
  getGlobalWorkspaceNav,
  getWorkspacePrimaryNav,
  getWorkspaceSecondaryNav,
} from "@/domains/workspaces/constants/navigation";
import { isActiveWorkspaceHref } from "@/domains/workspaces/utils/navigation";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  workspaceName?: string;
  workspaceSlug?: string;
};

export function AppSidebar({ workspaceName, workspaceSlug, ...props }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const queryClient = useQueryClient();
  const { clearSession } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const primaryNav = React.useMemo(() => (workspaceSlug ? getWorkspacePrimaryNav(workspaceSlug) : []), [workspaceSlug]);
  const secondaryNav = React.useMemo(() => getWorkspaceSecondaryNav(workspaceSlug), [workspaceSlug]);
  const globalNav = React.useMemo(() => getGlobalWorkspaceNav(), []);
  const workspaceHref = workspaceSlug ? `/workspaces/${encodeURIComponent(workspaceSlug)}` : "/workspaces";
  const contextLabel = workspaceName ?? (workspaceSlug ? "Workspace" : "Workspaces");
  const contextEyebrow = workspaceSlug ? "Workspace" : "All workspaces";

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
                onMouseEnter={() => router.prefetch(workspaceHref)}
                onFocus={() => router.prefetch(workspaceHref)}
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
