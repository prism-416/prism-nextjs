"use client";

import * as React from "react";

import { ProjectsClient } from "@/domains/projects/components/ProjectsClient";
import { WorkspaceSprintClient } from "@/domains/sprints/components/WorkspaceSprintClient";
import { WorkspaceSprintsClient } from "@/domains/sprints/components/WorkspaceSprintsClient";
import { getDefaultSprintDates } from "@/domains/sprints/utils/sprint";
import { WorkspaceJobsClient } from "@/domains/workspaces/components/WorkspaceJobsClient";
import { WorkspaceMembersClient } from "@/domains/workspaces/components/WorkspaceMembersClient";
import { WorkspaceSettingsClient } from "@/domains/workspaces/components/WorkspaceSettingsClient";
import { useWorkspaceRoute } from "@/domains/workspaces/components/WorkspaceRouteShell";

export function WorkspaceProjectsRoute() {
  const { workspace, workspaceSlug } = useWorkspaceRoute();

  return (
    <ProjectsClient
      slug={workspaceSlug}
      workspace={workspace}
      initialCanCreateProject={false}
    />
  );
}

export function WorkspaceMembersRoute() {
  const { workspace } = useWorkspaceRoute();

  return <WorkspaceMembersClient workspace={workspace} />;
}

export function WorkspaceJobsRoute() {
  const { workspace } = useWorkspaceRoute();

  return (
    <WorkspaceJobsClient
      workspace={workspace}
      initialCanManageJobs={false}
    />
  );
}

export function WorkspaceSettingsRoute() {
  const { workspace } = useWorkspaceRoute();

  return <WorkspaceSettingsClient workspace={workspace} />;
}

export function WorkspaceSprintsRoute() {
  const { workspace, workspaceSlug } = useWorkspaceRoute();
  const { defaultStartsAt, defaultEndsAt } = React.useMemo(() => getDefaultSprintDates(), []);

  return (
    <WorkspaceSprintsClient
      workspaceId={workspace.workspaceId}
      workspaceSlug={workspaceSlug}
      workspaceOwnerId={workspace.ownerId}
      defaultStartsAt={defaultStartsAt}
      defaultEndsAt={defaultEndsAt}
    />
  );
}

export function WorkspaceSprintRoute({ sprintId }: { sprintId: string }) {
  const { workspace, workspaceSlug, projectNamesById, projectSlugsById } = useWorkspaceRoute();

  return (
    <WorkspaceSprintClient
      workspaceId={workspace.workspaceId}
      workspaceSlug={workspaceSlug}
      workspaceOwnerId={workspace.ownerId}
      sprintId={sprintId}
      projectSlugsById={projectSlugsById}
      projectNamesById={projectNamesById}
    />
  );
}
