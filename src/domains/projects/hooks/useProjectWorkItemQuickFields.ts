"use client";

import { useCallback, useEffect, useRef } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";

import { PROJECT_MUTATION_KEYS } from "@/domains/projects/constants/mutations";
import { useUpdateProjectWorkItem } from "@/domains/projects/hooks/useUpdateProjectWorkItem";
import type {
  ProjectWorkItem,
  ProjectWorkItemPriority,
  ProjectWorkItemSearchResult,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import { moveProjectBoardWorkItem, patchProjectBoardWorkItem } from "@/domains/projects/utils/work-item-cache";
import { QUERY_KEYS } from "@/shared/query";

type PendingPriorityUpdate = {
  initialPriority: ProjectWorkItemPriority;
  desiredPriority: ProjectWorkItemPriority;
  confirmedPriority: ProjectWorkItemPriority | null;
};

type PendingStatusUpdate = {
  initialStatus: ProjectWorkItemStatus;
  initialSortOrder: number;
  desiredStatus: ProjectWorkItemStatus;
  confirmedStatus: ProjectWorkItemStatus | null;
};

type UseProjectWorkItemQuickFieldsParams = {
  projectId: string;
  boardQueryKey: QueryKey;
  setUpdateError: (message: string | null) => void;
};

/**
 * Owns the inline status / priority dropdown updates on the dashboard board.
 *
 * Both fields use the same "coalescing optimistic update" machinery: rapid
 * clicks patch the cache immediately, only the latest desired value is sent once
 * the in-flight request settles, and a failure rolls the cache back.
 */
export function useProjectWorkItemQuickFields({
  projectId,
  boardQueryKey,
  setUpdateError,
}: UseProjectWorkItemQuickFieldsParams) {
  const queryClient = useQueryClient();
  const { mutate: updateWorkItem } = useUpdateProjectWorkItem({
    mutationKey: PROJECT_MUTATION_KEYS.workItems.update(projectId),
    syncResult: false,
  });

  const pendingPriorityUpdatesRef = useRef<Map<string, PendingPriorityUpdate>>(new Map());
  const submitPriorityUpdateRef = useRef<(itemId: string, priority: ProjectWorkItemPriority) => void>(() => undefined);
  const pendingStatusUpdatesRef = useRef<Map<string, PendingStatusUpdate>>(new Map());
  const submitStatusUpdateRef = useRef<(itemId: string, status: ProjectWorkItemStatus) => void>(() => undefined);

  const patchBoardItem = useCallback(
    (itemId: string, patch: Partial<ProjectWorkItem>) =>
      patchProjectBoardWorkItem(queryClient, boardQueryKey, itemId, patch),
    [boardQueryKey, queryClient],
  );

  const moveItemOnBoard = useCallback(
    (itemId: string, patch: Partial<ProjectWorkItem>) =>
      moveProjectBoardWorkItem(queryClient, boardQueryKey, itemId, patch),
    [boardQueryKey, queryClient],
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
              patchBoardItem(itemId, { priority: pendingUpdate.confirmedPriority ?? pendingUpdate.initialPriority });
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
    [patchBoardItem, projectId, queryClient, setUpdateError, updateWorkItem],
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
      patchBoardItem(item.itemId, { priority });

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
    [patchBoardItem, setUpdateError, submitPriorityUpdate],
  );

  const submitStatusUpdate = useCallback(
    (itemId: string, status: ProjectWorkItemStatus) => {
      updateWorkItem(
        { projectId, itemId, payload: { status } },
        {
          onError: error => {
            if (pendingStatusUpdatesRef.current.get(itemId)?.desiredStatus === status) {
              setUpdateError(error instanceof Error ? error.message : "Work item could not be updated.");
            }
          },
          onSuccess: () => {
            const pendingUpdate = pendingStatusUpdatesRef.current.get(itemId);
            if (pendingUpdate) {
              pendingUpdate.confirmedStatus = status;
            }
          },
          onSettled: () => {
            const pendingUpdate = pendingStatusUpdatesRef.current.get(itemId);
            if (!pendingUpdate) return;

            if (pendingUpdate.desiredStatus !== status) {
              submitStatusUpdateRef.current(itemId, pendingUpdate.desiredStatus);
              return;
            }

            pendingStatusUpdatesRef.current.delete(itemId);
            if (pendingUpdate.confirmedStatus !== status) {
              if (pendingUpdate.confirmedStatus === null) {
                // Error: restore original status and position
                moveItemOnBoard(itemId, {
                  status: pendingUpdate.initialStatus,
                  sortOrder: pendingUpdate.initialSortOrder,
                });
              } else {
                patchBoardItem(itemId, { status: pendingUpdate.confirmedStatus });
              }
            }
            const hasPendingReorder =
              queryClient.isMutating({ mutationKey: PROJECT_MUTATION_KEYS.workItems.reorder(projectId) }) > 0;
            if (pendingStatusUpdatesRef.current.size === 0 && !hasPendingReorder) {
              void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.workItems(projectId) });
            }
          },
        },
      );
    },
    [moveItemOnBoard, patchBoardItem, projectId, queryClient, setUpdateError, updateWorkItem],
  );

  useEffect(() => {
    submitStatusUpdateRef.current = submitStatusUpdate;
  }, [submitStatusUpdate]);

  const handleStatusUpdate = useCallback(
    (item: ProjectWorkItem, status: ProjectWorkItemStatus) => {
      if (item.status === status) {
        return;
      }

      setUpdateError(null);

      // Mirror DB logic: new status gets MAX(sort_order in same status) + 1
      const currentItems = queryClient.getQueryData<ProjectWorkItemSearchResult>(boardQueryKey)?.items ?? [];
      const sameStatusSortOrders = currentItems
        .filter(i => i.status === status && i.itemId !== item.itemId)
        .map(i => i.sortOrder);
      const newSortOrder = sameStatusSortOrders.length > 0 ? Math.max(...sameStatusSortOrders) + 1 : 0;

      moveItemOnBoard(item.itemId, { status, sortOrder: newSortOrder });

      const pendingUpdate = pendingStatusUpdatesRef.current.get(item.itemId);
      if (pendingUpdate) {
        pendingUpdate.desiredStatus = status;
        return;
      }

      pendingStatusUpdatesRef.current.set(item.itemId, {
        initialStatus: item.status,
        initialSortOrder: item.sortOrder,
        desiredStatus: status,
        confirmedStatus: null,
      });
      submitStatusUpdate(item.itemId, status);
    },
    [boardQueryKey, moveItemOnBoard, queryClient, setUpdateError, submitStatusUpdate],
  );

  return {
    onPriorityUpdate: handlePriorityUpdate,
    onStatusUpdate: handleStatusUpdate,
  };
}
