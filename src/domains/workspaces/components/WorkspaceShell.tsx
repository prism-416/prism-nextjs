"use client";

import type * as React from "react";

import MainLayout from "@/atomics/templates/MainLayout";
import { AppHeader } from "@/domains/workspaces/components/AppHeader";
import { AppSidebar } from "@/domains/workspaces/components/AppSidebar";
import type { WorkspacePathSegment } from "@/domains/workspaces/types/path";

type WorkspaceShellProps = {
  children: React.ReactNode;
  workspace?: WorkspacePathSegment;
  project?: WorkspacePathSegment;
  actions?: React.ReactNode;
  defaultSidebarOpen?: boolean;
  headerHeight?: string;
  className?: string;
  contentClassName?: string;
};

export function WorkspaceShell({
  children,
  workspace,
  project,
  actions,
  defaultSidebarOpen,
  headerHeight,
  className,
  contentClassName,
}: WorkspaceShellProps) {
  return (
    <MainLayout
      header={
        <AppHeader
          workspace={workspace}
          project={project}
          actions={actions}
        />
      }
      sidebar={<AppSidebar />}
      defaultSidebarOpen={defaultSidebarOpen}
      headerHeight={headerHeight}
      className={className}
      contentClassName={contentClassName}
    >
      {children}
    </MainLayout>
  );
}
