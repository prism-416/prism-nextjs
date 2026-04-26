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
import { WorkspaceNavGroup } from "@/domains/workspace/components/navigation/WorkspaceNavGroup";
import { WORKSPACE_PRIMARY_NAV, WORKSPACE_SECONDARY_NAV } from "@/domains/workspace/constants/navigation";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() ?? "/";

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarContent>
        <WorkspaceNavGroup
          label="Workspace"
          items={WORKSPACE_PRIMARY_NAV}
          pathname={pathname}
        />
        <WorkspaceNavGroup
          label="General"
          items={WORKSPACE_SECONDARY_NAV}
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
