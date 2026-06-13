"use client";

import { WorkspaceJobsClient } from "@/domains/workspaces/components/WorkspaceJobsClient";
import { useWorkspaceRoute } from "@/domains/workspaces/components/WorkspaceRouteShell";
import type { WorkspaceJob } from "@/domains/workspaces/types";

type WorkspaceJobsRouteProps = {
  initialData?: WorkspaceJob[];
};

export function WorkspaceJobsRoute({ initialData }: WorkspaceJobsRouteProps) {
  const { workspace } = useWorkspaceRoute();

  return (
    <WorkspaceJobsClient
      workspace={workspace}
      initialData={initialData}
      initialCanManageJobs={false}
    />
  );
}
