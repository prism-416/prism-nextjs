"use client";

import { useCallback, useState } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";

import { PROJECT_MUTATION_KEYS } from "@/domains/projects/constants/mutations";
import { useCreateProjectWorkItem } from "@/domains/projects/hooks/useCreateProjectWorkItem";
import { useUpdateProjectWorkItem } from "@/domains/projects/hooks/useUpdateProjectWorkItem";
import type { ProjectWorkItem, ProjectWorkItemStatus, UpdateProjectWorkItemPayload } from "@/domains/projects/types";
import {
  insertProjectBoardWorkItem,
  patchProjectBoardWorkItem,
  patchProjectWorkItemDetail,
} from "@/domains/projects/utils/work-item-cache";
import { QUERY_KEYS } from "@/shared/query";

const INLINE_CREATED_WORK_ITEM_TITLE = "Untitled work item";

type UseProjectWorkItemInlineEditorParams = {
  projectId: string;
  boardQueryKey: QueryKey;
  setUpdateError: (message: string | null) => void;
};

/**
 * Owns inline work item creation and the in-card editing of title, description,
 * schedule and assignees. Each edit applies an optimistic cache patch and rolls
 * back on failure.
 */
export function useProjectWorkItemInlineEditor({
  projectId,
  boardQueryKey,
  setUpdateError,
}: UseProjectWorkItemInlineEditorParams) {
  const queryClient = useQueryClient();
  const [inlineEditingItemId, setInlineEditingItemId] = useState<string | null>(null);
  const [inlineCreatingStatus, setInlineCreatingStatus] = useState<ProjectWorkItemStatus | null>(null);

  const { mutateAsync: updateWorkItemAsync } = useUpdateProjectWorkItem({
    mutationKey: PROJECT_MUTATION_KEYS.workItems.update(projectId),
    syncResult: false,
  });
  const { mutateAsync: createWorkItem } = useCreateProjectWorkItem();

  const runOptimisticUpdate = useCallback(
    async (
      itemId: string,
      payload: UpdateProjectWorkItemPayload,
      patch: Partial<ProjectWorkItem>,
      previousPatch: Partial<ProjectWorkItem>,
      errorMessage: string,
      updateDetail?: boolean,
    ) => {
      setUpdateError(null);
      patchProjectBoardWorkItem(queryClient, boardQueryKey, itemId, patch);
      if (updateDetail) {
        patchProjectWorkItemDetail(queryClient, projectId, itemId, patch);
      }

      try {
        await updateWorkItemAsync({ projectId, itemId, payload });
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.workItems(projectId) });
      } catch (error) {
        patchProjectBoardWorkItem(queryClient, boardQueryKey, itemId, previousPatch);
        if (updateDetail) {
          patchProjectWorkItemDetail(queryClient, projectId, itemId, previousPatch);
        }
        setUpdateError(error instanceof Error ? error.message : errorMessage);
      }
    },
    [boardQueryKey, projectId, queryClient, setUpdateError, updateWorkItemAsync],
  );

  const handleInlineCreateWorkItem = useCallback(
    async (status: ProjectWorkItemStatus) => {
      if (inlineCreatingStatus) {
        return;
      }

      setUpdateError(null);
      setInlineCreatingStatus(status);

      try {
        const workItem = await createWorkItem({
          projectId,
          payload: {
            title: INLINE_CREATED_WORK_ITEM_TITLE,
            description: "",
            priority: "medium",
            status,
          },
        });

        insertProjectBoardWorkItem(queryClient, boardQueryKey, workItem);
        setInlineEditingItemId(workItem.itemId);
      } catch (error) {
        setUpdateError(error instanceof Error ? error.message : "Work item could not be created.");
      } finally {
        setInlineCreatingStatus(null);
      }
    },
    [boardQueryKey, createWorkItem, inlineCreatingStatus, projectId, queryClient, setUpdateError],
  );

  const handleInlineTitleUpdate = useCallback(
    async (item: ProjectWorkItem, title: string, options?: { keepEditing?: boolean }) => {
      const trimmedTitle = title.trim();
      if (!options?.keepEditing) {
        setInlineEditingItemId(null);
      }

      if (!trimmedTitle || trimmedTitle === item.title) {
        return;
      }

      await runOptimisticUpdate(
        item.itemId,
        { title: trimmedTitle },
        { title: trimmedTitle },
        { title: item.title },
        "Work item title could not be updated.",
        true,
      );
    },
    [runOptimisticUpdate],
  );

  const handleInlineDescriptionUpdate = useCallback(
    async (item: ProjectWorkItem, description: string, options?: { keepEditing?: boolean }) => {
      const trimmedDescription = description.trim();
      if (!options?.keepEditing) {
        setInlineEditingItemId(null);
      }

      if (trimmedDescription === item.description) {
        return;
      }

      await runOptimisticUpdate(
        item.itemId,
        { description: trimmedDescription },
        { description: trimmedDescription },
        { description: item.description },
        "Work item description could not be updated.",
        true,
      );
    },
    [runOptimisticUpdate],
  );

  const handleInlineScheduleUpdate = useCallback(
    async (item: ProjectWorkItem, patch: { startDate?: string | null; dueDate?: string | null }) => {
      const hasNoChange =
        (patch.startDate === undefined || patch.startDate === item.startDate) &&
        (patch.dueDate === undefined || patch.dueDate === item.dueDate);

      if (hasNoChange) {
        return;
      }

      const previous = { startDate: item.startDate, dueDate: item.dueDate };
      await runOptimisticUpdate(
        item.itemId,
        patch,
        patch as Partial<ProjectWorkItem>,
        previous as Partial<ProjectWorkItem>,
        "Work item schedule could not be updated.",
        true,
      );
    },
    [runOptimisticUpdate],
  );

  const handleInlineAssigneesUpdate = useCallback(
    async (item: ProjectWorkItem, usernames: string[]) => {
      const hasNoChange =
        item.assigneeUsernames.length === usernames.length &&
        item.assigneeUsernames.every((username, index) => username === usernames[index]);

      if (hasNoChange) {
        return;
      }

      await runOptimisticUpdate(
        item.itemId,
        { assigneeUsernames: usernames },
        { assigneeUsernames: usernames },
        { assigneeUsernames: item.assigneeUsernames },
        "Work item assignees could not be updated.",
        true,
      );
    },
    [runOptimisticUpdate],
  );

  return {
    inlineEditingItemId,
    inlineCreatingStatus,
    onInlineCreateWorkItem: handleInlineCreateWorkItem,
    onInlineTitleUpdate: handleInlineTitleUpdate,
    onInlineDescriptionUpdate: handleInlineDescriptionUpdate,
    onInlineScheduleUpdate: handleInlineScheduleUpdate,
    onInlineAssigneesUpdate: handleInlineAssigneesUpdate,
    onInlineEditCancel: useCallback(() => setInlineEditingItemId(null), []),
    onEditWorkItem: useCallback((item: ProjectWorkItem) => setInlineEditingItemId(item.itemId), []),
  };
}
