"use client";

import type * as React from "react";
import dynamic from "next/dynamic";

import MainLayout from "@/atomics/templates/MainLayout";
import { AppHeader } from "@/domains/workspaces/components/AppHeader";
import { AppSidebar } from "@/domains/workspaces/components/AppSidebar";
import type { WorkspacePathOption, WorkspacePathSegment } from "@/domains/workspaces/types/path";
import { resolveWorkspacePathSegments } from "@/domains/workspaces/utils/path";

const WorkspaceRealtimeRoomBridge = dynamic(
  () =>
    import("@/domains/workspaces/components/WorkspaceRealtimeRoomBridge").then(
      module => module.WorkspaceRealtimeRoomBridge,
    ),
  { ssr: false },
);

export type WorkspaceShellProps = {
  children: React.ReactNode;
  workspaceId?: string;
  workspace?: WorkspacePathSegment;
  workspaceSlug?: string;
  workspaceOptions?: WorkspacePathOption[];
  project?: WorkspacePathSegment;
  projectOptions?: WorkspacePathOption[];
  section?: WorkspacePathSegment;
  pathSegments?: WorkspacePathSegment[];
  sidebar?: React.ReactNode;
  actions?: React.ReactNode;
  defaultSidebarOpen?: boolean;
  headerHeight?: string;
  className?: string;
  contentClassName?: string;
};

export function WorkspaceShell({
  children,
  workspaceId,
  workspace,
  workspaceSlug,
  workspaceOptions,
  project,
  projectOptions,
  section,
  pathSegments,
  sidebar,
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
  const resolvedSidebar =
    sidebar === undefined ? (
      <AppSidebar
        workspaceId={workspaceId}
        workspaceName={workspace?.name}
        workspaceSlug={workspaceSlug}
      />
    ) : (
      sidebar
    );

  return (
    <MainLayout
      header={
        <AppHeader
          pathSegments={resolvedPathSegments}
          actions={actions}
        />
      }
      sidebar={resolvedSidebar}
      defaultSidebarOpen={defaultSidebarOpen}
      headerHeight={headerHeight}
      className={className}
      contentClassName={contentClassName}
    >
      {workspaceId ? (
        <WorkspaceRealtimeRoomBridge
          workspaceId={workspaceId}
          workspaceSlug={workspaceSlug}
        />
      ) : null}
      {children}
    </MainLayout>
  );
}
