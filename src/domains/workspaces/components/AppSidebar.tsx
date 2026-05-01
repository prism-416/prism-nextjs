"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  const pathname = usePathname() ?? "/";
  const primaryNav = React.useMemo(() => getWorkspacePrimaryNav(workspaceSlug), [workspaceSlug]);
  const secondaryNav = React.useMemo(() => getWorkspaceSecondaryNav(workspaceSlug), [workspaceSlug]);

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
        <div className="flex justify-end px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <SidebarTrigger />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
