"use client";

import * as React from "react";

import { ProjectWorkItemsPanel } from "@/domains/projects/components/ProjectWorkItemsPanel";
import { ProjectWorkItemsSkeleton } from "@/domains/projects/components/ProjectWorkItemsSkeleton";
import { useProjectWorkItems } from "@/domains/projects/hooks/useProjectWorkItems";
import { useUpdateProjectWorkItem } from "@/domains/projects/hooks/useUpdateProjectWorkItem";
import type {
  ProjectWorkItem,
  ProjectWorkItemPriority,
  ProjectWorkItemSearchResult,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";

type ProjectWorkItemsClientProps = {
  projectId: string;
  projectSlug: string;
  initialData?: ProjectWorkItemSearchResult;
};

export function ProjectWorkItemsClient({ projectId, projectSlug, initialData }: ProjectWorkItemsClientProps) {
  const [updatingItemId, setUpdatingItemId] = React.useState<string | null>(null);
  const [updateError, setUpdateError] = React.useState<string | null>(null);
  const { data, isPending, isError, refetch } = useProjectWorkItems(projectId, undefined, initialData);
  const { mutateAsync: updateWorkItem, isPending: isUpdatingItem } = useUpdateProjectWorkItem();

  const handleUpdate = React.useCallback(
    async (item: ProjectWorkItem, payload: { status?: ProjectWorkItemStatus; priority?: ProjectWorkItemPriority }) => {
      if (
        (payload.status && item.status === payload.status) ||
        (payload.priority && item.priority === payload.priority)
      ) {
        return;
      }

      setUpdateError(null);
      setUpdatingItemId(item.itemId);

      try {
        await updateWorkItem({
          projectId,
          itemId: item.itemId,
          payload,
        });
      } catch (error) {
        setUpdateError(error instanceof Error ? error.message : "Work item could not be updated.");
      } finally {
        setUpdatingItemId(null);
      }
    },
    [projectId, updateWorkItem],
  );

  if (isPending && !data) {
    return <ProjectWorkItemsSkeleton />;
  }

  return (
    <ProjectWorkItemsPanel
      projectId={projectId}
      projectSlug={projectSlug}
      workItems={data ?? { items: [], total: 0, limit: 50, offset: 0 }}
      isError={isError}
      updatingItemId={updatingItemId}
      isUpdatingItem={isUpdatingItem}
      updateError={updateError}
      onStatusUpdate={(item, status) => {
        void handleUpdate(item, { status });
      }}
      onPriorityUpdate={(item, priority) => {
        void handleUpdate(item, { priority });
      }}
      onRetry={() => {
        setUpdateError(null);
        void refetch();
      }}
    />
  );
}
