import type * as React from "react";

import MainLayout from "@/atomics/templates/MainLayout";
import { AppHeader } from "@/domains/workspaces/components/AppHeader";
import { AppSidebar } from "@/domains/workspaces/components/AppSidebar";
import type { WorkspacePathOption, WorkspacePathSegment } from "@/domains/workspaces/types/path";
import { resolveWorkspacePathSegments } from "@/domains/workspaces/utils/path";

export type WorkspaceShellProps = {
  children: React.ReactNode;
  workspace?: WorkspacePathSegment;
  workspaceSlug?: string;
  workspaceOptions?: WorkspacePathOption[];
  project?: WorkspacePathSegment;
  projectOptions?: WorkspacePathOption[];
  section?: WorkspacePathSegment;
  pathSegments?: WorkspacePathSegment[];
  actions?: React.ReactNode;
  defaultSidebarOpen?: boolean;
  headerHeight?: string;
  className?: string;
  contentClassName?: string;
};

export function WorkspaceShell({
  children,
  workspace,
  workspaceSlug,
  workspaceOptions,
  project,
  projectOptions,
  section,
  pathSegments,
  actions,
  defaultSidebarOpen,
  headerHeight,
  className,
  contentClassName,
}: WorkspaceShellProps) {
  const resolvedPathSegments = resolveWorkspacePathSegments({
    workspace,
    workspaceSlug,
    workspaceOptions,
    project,
    projectOptions,
    section,
    pathSegments,
  });

  return (
    <MainLayout
      header={
        <AppHeader
          pathSegments={resolvedPathSegments}
          actions={actions}
        />
      }
      sidebar={<AppSidebar workspaceSlug={workspaceSlug} />}
      defaultSidebarOpen={defaultSidebarOpen}
      headerHeight={headerHeight}
      className={className}
      contentClassName={contentClassName}
    >
      {children}
    </MainLayout>
  );
}
