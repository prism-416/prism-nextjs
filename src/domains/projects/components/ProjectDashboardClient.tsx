"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { CreateProjectWorkItemDialog } from "@/domains/projects/components/CreateProjectWorkItemDialog";
import { ProjectDashboardPanel } from "@/domains/projects/components/ProjectDashboardPanel";
import { ProjectDashboardSkeleton } from "@/domains/projects/components/ProjectDashboardSkeleton";
import { PROJECT_DASHBOARD_WORK_ITEM_FILTERS } from "@/domains/projects/constants/dashboard";
import { PROJECT_MUTATION_KEYS } from "@/domains/projects/constants/mutations";
import { useProjectWorkItems } from "@/domains/projects/hooks/useProjectWorkItems";
import { useReorderProjectWorkItems } from "@/domains/projects/hooks/useReorderProjectWorkItems";
import { useUpdateProjectWorkItem } from "@/domains/projects/hooks/useUpdateProjectWorkItem";
import type { ProjectWorkItem, ProjectWorkItemPriority, ProjectWorkItemSearchResult } from "@/domains/projects/types";
import { applyOptimisticProjectWorkItemReorder } from "@/domains/projects/utils/work-item-cache";
import { getTopLevelProjectWorkItems } from "@/domains/projects/utils/work-item-order";
import { QUERY_KEYS } from "@/shared/query";

type ProjectDashboardClientProps = {
  projectId: string;
  projectSlug: string;
  initialData?: ProjectWorkItemSearchResult;
};

type PendingPriorityUpdate = {
  initialPriority: ProjectWorkItemPriority;
  desiredPriority: ProjectWorkItemPriority;
  confirmedPriority: ProjectWorkItemPriority | null;
};

export function ProjectDashboardClient({ projectId, projectSlug, initialData }: ProjectDashboardClientProps) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const pendingPriorityUpdatesRef = useRef<Map<string, PendingPriorityUpdate>>(new Map());
  const submitPriorityUpdateRef = useRef<(itemId: string, priority: ProjectWorkItemPriority) => void>(() => undefined);
  const { data, isPending, isError, refetch } = useProjectWorkItems(
    projectId,
    PROJECT_DASHBOARD_WORK_ITEM_FILTERS,
    initialData,
  );
  const { mutate: updateWorkItem } = useUpdateProjectWorkItem({
    mutationKey: PROJECT_MUTATION_KEYS.workItems.update(projectId),
    syncResult: false,
  });
  const { mutate: reorderWorkItems } = useReorderProjectWorkItems(projectId);

  const applyOptimisticPriority = useCallback(
    (itemId: string, priority: ProjectWorkItemPriority) => {
      const boardQueryKey = QUERY_KEYS.project.workItemList(projectId, PROJECT_DASHBOARD_WORK_ITEM_FILTERS);
      queryClient.setQueryData<ProjectWorkItemSearchResult>(boardQueryKey, previous => {
        if (!previous) return previous;
        return {
          ...previous,
          items: previous.items.map(currentItem =>
            currentItem.itemId === itemId ? { ...currentItem, priority } : currentItem,
          ),
        };
      });
    },
    [projectId, queryClient],
  );

  const submitPriorityUpdate = useCallback(
    (itemId: string, priority: ProjectWorkItemPriority) => {
      updateWorkItem(
        { projectId, itemId, payload: { priority } },
        {
          onError: error => {
            if (pendingPriorityUpdatesRef.current.get(itemId)?.desiredPriority === priority) {
              setUpdateError(error instanceof Error ? error.message : "Work item could not be updated.");
            }
          },
          onSuccess: () => {
            const pendingUpdate = pendingPriorityUpdatesRef.current.get(itemId);
            if (pendingUpdate) {
              pendingUpdate.confirmedPriority = priority;
            }
          },
          onSettled: () => {
            const pendingUpdate = pendingPriorityUpdatesRef.current.get(itemId);
            if (!pendingUpdate) return;

            if (pendingUpdate.desiredPriority !== priority) {
              submitPriorityUpdateRef.current(itemId, pendingUpdate.desiredPriority);
              return;
            }

            pendingPriorityUpdatesRef.current.delete(itemId);
            if (pendingUpdate.confirmedPriority !== priority) {
              applyOptimisticPriority(itemId, pendingUpdate.confirmedPriority ?? pendingUpdate.initialPriority);
            }
            const hasPendingReorder =
              queryClient.isMutating({ mutationKey: PROJECT_MUTATION_KEYS.workItems.reorder(projectId) }) > 0;
            if (pendingPriorityUpdatesRef.current.size === 0 && !hasPendingReorder) {
              void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.workItems(projectId) });
            }
          },
        },
      );
    },
    [applyOptimisticPriority, projectId, queryClient, updateWorkItem],
  );

  useEffect(() => {
    submitPriorityUpdateRef.current = submitPriorityUpdate;
  }, [submitPriorityUpdate]);

  const handlePriorityUpdate = useCallback(
    (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => {
      if (item.priority === priority) {
        return;
      }

      setUpdateError(null);
      applyOptimisticPriority(item.itemId, priority);

      const pendingUpdate = pendingPriorityUpdatesRef.current.get(item.itemId);
      if (pendingUpdate) {
        pendingUpdate.desiredPriority = priority;
        return;
      }

      pendingPriorityUpdatesRef.current.set(item.itemId, {
        initialPriority: item.priority,
        desiredPriority: priority,
        confirmedPriority: null,
      });
      submitPriorityUpdate(item.itemId, priority);
    },
    [applyOptimisticPriority, submitPriorityUpdate],
  );

  const handleItemsReorder = useCallback(
    (items: ProjectWorkItem[]) => {
      const previousItems = getTopLevelProjectWorkItems(data?.items ?? []);
      const previousById = new Map(previousItems.map(item => [item.itemId, item]));
      const changedItems = items.filter(item => {
        const previousItem = previousById.get(item.itemId);
        return !previousItem || previousItem.status !== item.status || previousItem.sortOrder !== item.sortOrder;
      });
      if (changedItems.length === 0) {
        return;
      }

      setUpdateError(null);
      const payload = {
        items: items.map(item => ({
          itemId: item.itemId,
          status: item.status,
          sortOrder: item.sortOrder,
        })),
      };
      void queryClient.cancelQueries({ queryKey: QUERY_KEYS.project.workItems(projectId) });
      applyOptimisticProjectWorkItemReorder(queryClient, projectId, payload);
      reorderWorkItems(
        {
          projectId,
          payload,
        },
        {
          onError: error => {
            setUpdateError(error instanceof Error ? error.message : "Work item order could not be updated.");
          },
        },
      );
    },
    [data?.items, projectId, queryClient, reorderWorkItems],
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
        updateError={updateError}
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
