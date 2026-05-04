"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/app/_providers/AuthProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/atomics/organisms/Sidebar";
import { WorkspaceNavGroup } from "@/domains/workspaces/components/navigation/WorkspaceNavGroup";
import { getWorkspacePrimaryNav, getWorkspaceSecondaryNav } from "@/domains/workspaces/constants/navigation";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  workspaceSlug?: string;
};

export function AppSidebar({ workspaceSlug, ...props }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const queryClient = useQueryClient();
  const { clearSession } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const primaryNav = React.useMemo(() => getWorkspacePrimaryNav(workspaceSlug), [workspaceSlug]);
  const secondaryNav = React.useMemo(() => getWorkspaceSecondaryNav(workspaceSlug), [workspaceSlug]);

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
      <SidebarContent>
        <WorkspaceNavGroup
          label="Workspace"
          items={primaryNav}
          pathname={pathname}
        />
        <WorkspaceNavGroup
          label="General"
          items={secondaryNav}
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

export default AppSidebar;
