"use client";

import * as React from "react";

import { WorkspaceSprintsClient } from "@/domains/sprints/components/WorkspaceSprintsClient";
import type { Sprint } from "@/domains/sprints/types";
import { getDefaultSprintDates } from "@/domains/sprints/utils/sprint";
import { useWorkspaceRoute } from "@/domains/workspaces/components/WorkspaceRouteShell";

type WorkspaceSprintsRouteProps = {
  initialData?: Sprint[];
};

export function WorkspaceSprintsRoute({ initialData }: WorkspaceSprintsRouteProps) {
  const { workspace, workspaceSlug } = useWorkspaceRoute();
  const { defaultStartsAt, defaultEndsAt } = React.useMemo(() => getDefaultSprintDates(), []);

  return (
    <WorkspaceSprintsClient
      workspaceId={workspace.workspaceId}
      workspaceSlug={workspaceSlug}
      workspaceOwnerId={workspace.ownerId}
      initialData={initialData}
      defaultStartsAt={defaultStartsAt}
      defaultEndsAt={defaultEndsAt}
    />
  );
}
