"use client";

import { WorkspaceMembersClient } from "@/domains/workspaces/components/WorkspaceMembersClient";
import { useWorkspaceRoute } from "@/domains/workspaces/components/WorkspaceRouteShell";
import type { WorkspaceJob, WorkspaceMember } from "@/domains/workspaces/types";

type WorkspaceMembersRouteProps = {
  initialData?: WorkspaceMember[];
  initialJobs?: WorkspaceJob[];
};

export function WorkspaceMembersRoute({ initialData, initialJobs }: WorkspaceMembersRouteProps) {
  const { workspace } = useWorkspaceRoute();

  return (
    <WorkspaceMembersClient
      workspace={workspace}
      initialData={initialData}
      initialJobs={initialJobs}
    />
  );
}
