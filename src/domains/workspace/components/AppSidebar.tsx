"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Users, BarChart3, Settings, LifeBuoy, type LucideIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/atomics/organisms/Sidebar";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Members", href: "/members", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

const SECONDARY_NAV: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Support", href: "/support", icon: LifeBuoy },
];

function isActiveHref(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavGroup({ label, items, pathname }: { label: string; items: NavItem[]; pathname: string }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => {
            const Icon = item.icon;
            const active = isActiveHref(pathname, item.href);
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

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() ?? "/";

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarContent>
        <NavGroup
          label="Workspace"
          items={PRIMARY_NAV}
          pathname={pathname}
        />
        <NavGroup
          label="General"
          items={SECONDARY_NAV}
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
