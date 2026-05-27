"use client";

import { useQueryClient } from "@tanstack/react-query";

import { updateProjectWorkItem } from "@/domains/projects/api";
import type { ProjectWorkItem, UpdateProjectWorkItemPayload } from "@/domains/projects/types";
import { syncProjectWorkItemUpdated } from "@/domains/projects/utils/work-item-cache";
import { useApiMutation } from "@/shared/query";

type UpdateProjectWorkItemVariables = {
  projectId: string;
  itemId: string;
  payload: UpdateProjectWorkItemPayload;
};

type UseUpdateProjectWorkItemOptions = {
  mutationKey?: readonly unknown[];
  syncResult?: boolean;
};

export function useUpdateProjectWorkItem({ mutationKey, syncResult = true }: UseUpdateProjectWorkItemOptions = {}) {
  const queryClient = useQueryClient();

  return useApiMutation<ProjectWorkItem, Error, UpdateProjectWorkItemVariables>({
    mutationKey,
    mutationFn: async ({ projectId, itemId, payload }) => {
      const workItem = await updateProjectWorkItem(projectId, itemId, payload);

      if (!workItem) {
        throw new Error("Failed to update work item.");
      }

      return workItem;
    },
    onSuccess: workItem => {
      if (syncResult) {
        syncProjectWorkItemUpdated(queryClient, workItem);
      }
    },
  });
}
