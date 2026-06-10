"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/atomics/organisms/Sidebar";
import type { WorkspaceNavItem } from "@/domains/workspaces/constants/navigation";
import { isActiveWorkspaceHref } from "@/domains/workspaces/utils/navigation";

type WorkspaceNavGroupProps = {
  label: string;
  items: WorkspaceNavItem[];
  pathname: string;
};

export function WorkspaceNavGroup({ label, items, pathname }: WorkspaceNavGroupProps) {
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
