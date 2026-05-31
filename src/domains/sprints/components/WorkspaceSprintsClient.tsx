"use client";

import { useState } from "react";

import { CreateWorkspaceSprintDialog } from "@/domains/sprints/components/CreateWorkspaceSprintDialog";
import { WorkspaceSprintsPanel } from "@/domains/sprints/components/WorkspaceSprintsPanel";
import { WorkspaceSprintsSkeleton } from "@/domains/sprints/components/WorkspaceSprintsSkeleton";
import { useWorkspaceSprints } from "@/domains/sprints/hooks/useWorkspaceSprints";
import type { Sprint } from "@/domains/sprints/types";

type WorkspaceSprintsClientProps = {
  workspaceId: string;
  workspaceSlug: string;
  initialData?: Sprint[];
  defaultStartsAt: string;
  defaultEndsAt: string;
};

export function WorkspaceSprintsClient({
  workspaceId,
  workspaceSlug,
  initialData,
  defaultStartsAt,
  defaultEndsAt,
}: WorkspaceSprintsClientProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: sprints = [], isPending, isError, refetch } = useWorkspaceSprints(workspaceId, initialData);

  if (isPending && sprints.length === 0) {
    return <WorkspaceSprintsSkeleton />;
  }

  return (
    <>
      <WorkspaceSprintsPanel
        workspaceSlug={workspaceSlug}
        sprints={sprints}
        isError={isError}
        onRetry={() => void refetch()}
        onCreateSprint={() => setIsCreateOpen(true)}
      />
      <CreateWorkspaceSprintDialog
        open={isCreateOpen}
        workspaceId={workspaceId}
        defaultStartsAt={defaultStartsAt}
        defaultEndsAt={defaultEndsAt}
        nextSprintNumber={
          Math.max(
            0,
            ...sprints.map(s => {
              const m = s.name.match(/^Sprint #(\d+)$/);
              return m ? Number(m[1]) : 0;
            }),
          ) + 1
        }
        onOpenChange={setIsCreateOpen}
      />
    </>
  );
}
