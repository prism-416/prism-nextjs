"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { CreateProjectWorkItemDialog } from "@/domains/projects/components/CreateProjectWorkItemDialog";
import { ProjectDashboardPanel } from "@/domains/projects/components/ProjectDashboardPanel";
import { ProjectDashboardSkeleton } from "@/domains/projects/components/ProjectDashboardSkeleton";
import { PROJECT_DASHBOARD_WORK_ITEM_FILTERS } from "@/domains/projects/constants/dashboard";
import { useProjectWorkItems } from "@/domains/projects/hooks/useProjectWorkItems";
import { useReorderProjectWorkItems } from "@/domains/projects/hooks/useReorderProjectWorkItems";
import { useUpdateProjectWorkItem } from "@/domains/projects/hooks/useUpdateProjectWorkItem";
import type {
  ProjectWorkItem,
  ProjectWorkItemPriority,
  ProjectWorkItemSearchResult,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import { getTopLevelProjectWorkItems, reorderTopLevelProjectWorkItems } from "@/domains/projects/utils/work-item-order";
import { QUERY_KEYS } from "@/shared/query";

type ProjectDashboardClientProps = {
  projectId: string;
  projectSlug: string;
  initialData?: ProjectWorkItemSearchResult;
};

export function ProjectDashboardClient({ projectId, projectSlug, initialData }: ProjectDashboardClientProps) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { data, isPending, isError, refetch } = useProjectWorkItems(
    projectId,
    PROJECT_DASHBOARD_WORK_ITEM_FILTERS,
    initialData,
  );
  const { mutate: updateWorkItem, isPending: isUpdatingWorkItem } = useUpdateProjectWorkItem();
  const { mutate: reorderWorkItems, isPending: isReorderingWorkItems } = useReorderProjectWorkItems();
  const isUpdating = isUpdatingWorkItem || isReorderingWorkItems;

  const handleUpdate = useCallback(
    (item: ProjectWorkItem, payload: { status?: ProjectWorkItemStatus; priority?: ProjectWorkItemPriority }) => {
      if (isUpdating) {
        return;
      }

      if (
        (payload.status && item.status === payload.status) ||
        (payload.priority && item.priority === payload.priority)
      ) {
        return;
      }

      setUpdateError(null);
      const boardQueryKey = QUERY_KEYS.project.workItemList(projectId, PROJECT_DASHBOARD_WORK_ITEM_FILTERS);
      void queryClient.cancelQueries({ queryKey: boardQueryKey });

      const previousResult = queryClient.getQueryData<ProjectWorkItemSearchResult>(boardQueryKey);

      queryClient.setQueryData<ProjectWorkItemSearchResult>(boardQueryKey, previous => {
        if (!previous) return previous;
        return {
          ...previous,
          items: previous.items.map(currentItem =>
            currentItem.itemId === item.itemId ? { ...currentItem, ...payload } : currentItem,
          ),
        };
      });

      updateWorkItem(
        { projectId, itemId: item.itemId, payload },
        {
          onError: error => {
            queryClient.setQueryData(boardQueryKey, previousResult);
            setUpdateError(error instanceof Error ? error.message : "Work item could not be updated.");
          },
        },
      );
    },
    [isUpdating, projectId, queryClient, updateWorkItem],
  );

  const handlePriorityUpdate = useCallback(
    (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => handleUpdate(item, { priority }),
    [handleUpdate],
  );

  const handleItemsReorder = useCallback(
    (items: ProjectWorkItem[]) => {
      if (isUpdating) {
        return;
      }

      setUpdateError(null);
      const boardQueryKey = QUERY_KEYS.project.workItemList(projectId, PROJECT_DASHBOARD_WORK_ITEM_FILTERS);
      void queryClient.cancelQueries({ queryKey: boardQueryKey });

      const previousResult = queryClient.getQueryData<ProjectWorkItemSearchResult>(boardQueryKey);
      const changedItems = items.filter(item => {
        const previousItem = previousResult?.items.find(previous => previous.itemId === item.itemId);
        return !previousItem || previousItem.status !== item.status || previousItem.sortOrder !== item.sortOrder;
      });
      if (changedItems.length === 0) {
        return;
      }

      queryClient.setQueryData<ProjectWorkItemSearchResult>(boardQueryKey, previous => {
        if (!previous) return previous;
        const childItems = previous.items.filter(item => item.parentId !== null);
        return { ...previous, items: [...items, ...childItems] };
      });

      reorderWorkItems(
        {
          projectId,
          payload: {
            items: changedItems.map(item => ({
              itemId: item.itemId,
              status: item.status,
              sortOrder: item.sortOrder,
            })),
          },
        },
        {
          onError: error => {
            queryClient.setQueryData(boardQueryKey, previousResult);
            setUpdateError(error instanceof Error ? error.message : "Work item order could not be updated.");
          },
        },
      );
    },
    [isUpdating, projectId, queryClient, reorderWorkItems],
  );

  const handleStatusUpdate = useCallback(
    (item: ProjectWorkItem, status: ProjectWorkItemStatus) => {
      if (item.status === status || isUpdating) {
        return;
      }

      const items = getTopLevelProjectWorkItems(data?.items ?? []);
      handleItemsReorder(reorderTopLevelProjectWorkItems(items, item.itemId, { status }));
    },
    [data?.items, handleItemsReorder, isUpdating],
  );

  const handleRetry = useCallback(() => {
    setUpdateError(null);
    void refetch();
  }, [refetch]);

  const handleCreateOpen = useCallback(() => setIsCreateOpen(true), []);

  if (isPending && !data) {
    return <ProjectDashboardSkeleton />;
  }

  return (
    <>
      <ProjectDashboardPanel
        projectSlug={projectSlug}
        workItems={data ?? { items: [], total: 0, limit: 50, offset: 0 }}
        isError={isError}
        isUpdating={isUpdating}
        updateError={updateError}
        onStatusUpdate={handleStatusUpdate}
        onPriorityUpdate={handlePriorityUpdate}
        onItemsReorder={handleItemsReorder}
        onRetry={handleRetry}
        onCreateWorkItem={handleCreateOpen}
      />

      <CreateProjectWorkItemDialog
        open={isCreateOpen}
        projectId={projectId}
        onOpenChange={setIsCreateOpen}
      />
    </>
  );
}
