"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { PROJECT_DASHBOARD_WORK_ITEM_FILTERS } from "@/domains/projects/constants/dashboard";
import { useProjectWorkItemChildren } from "@/domains/projects/hooks/useProjectWorkItemChildren";
import { useProjectWorkItemInlineEditor } from "@/domains/projects/hooks/useProjectWorkItemInlineEditor";
import { useProjectWorkItemQuickFields } from "@/domains/projects/hooks/useProjectWorkItemQuickFields";
import { useProjectWorkItems } from "@/domains/projects/hooks/useProjectWorkItems";
import { useReorderProjectWorkItems } from "@/domains/projects/hooks/useReorderProjectWorkItems";
import type {
  ProjectParticipant,
  ProjectWorkItem,
  ProjectWorkItemSearchResult,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import { applyOptimisticProjectWorkItemReorder } from "@/domains/projects/utils/work-item-cache";
import { getTopLevelProjectWorkItems } from "@/domains/projects/utils/work-item-order";
import { QUERY_KEYS } from "@/shared/query";

type ProjectDashboardInput = {
  projectId: string;
  projectSlug: string;
  workspaceId?: string;
  initialMembers?: ProjectParticipant[];
  initialData?: ProjectWorkItemSearchResult;
};

const EMPTY_WORK_ITEMS: ProjectWorkItemSearchResult = { items: [], total: 0, limit: 50, offset: 0 };

export function useProjectDashboard({ projectId, initialData }: ProjectDashboardInput) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createInitialStatus, setCreateInitialStatus] = useState<ProjectWorkItemStatus>("todo");
  const [deletingWorkItem, setDeletingWorkItem] = useState<ProjectWorkItem | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const { data, isPending, isError, refetch } = useProjectWorkItems(
    projectId,
    PROJECT_DASHBOARD_WORK_ITEM_FILTERS,
    initialData,
  );
  const { data: deletingWorkItemChildren = [] } = useProjectWorkItemChildren(projectId, deletingWorkItem?.itemId);
  const { mutate: reorderWorkItems } = useReorderProjectWorkItems(projectId);

  const boardQueryKey = QUERY_KEYS.project.workItemList(projectId, PROJECT_DASHBOARD_WORK_ITEM_FILTERS);

  const quickFields = useProjectWorkItemQuickFields({ projectId, boardQueryKey, setUpdateError });
  const inlineEditor = useProjectWorkItemInlineEditor({ projectId, boardQueryKey, setUpdateError });

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
        { projectId, payload },
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

  const handleCreateOpen = useCallback((status: ProjectWorkItemStatus = "todo") => {
    setCreateInitialStatus(status);
    setIsCreateOpen(true);
  }, []);

  return {
    data,
    isPending,
    isError,
    workItems: data ?? EMPTY_WORK_ITEMS,
    updateError,
    ...quickFields,
    ...inlineEditor,
    onDeleteWorkItem: setDeletingWorkItem,
    onItemsReorder: handleItemsReorder,
    onRetry: handleRetry,
    onCreateWorkItem: handleCreateOpen,
    isCreateOpen,
    createInitialStatus,
    onCreateOpenChange: setIsCreateOpen,
    deletingWorkItem,
    deletingWorkItemChildren,
    onDeletingOpenChange: (open: boolean) => {
      if (!open) setDeletingWorkItem(null);
    },
    onDeleted: () => setDeletingWorkItem(null),
  };
}
