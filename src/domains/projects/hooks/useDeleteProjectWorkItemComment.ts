"use client";

import { useQueryClient } from "@tanstack/react-query";

import { deleteProjectWorkItemComment } from "@/domains/projects/api";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type DeleteProjectWorkItemCommentVariables = {
  projectId: string;
  itemId: string;
  commentId: string;
};

export function useDeleteProjectWorkItemComment() {
  const queryClient = useQueryClient();

  return useApiMutation<void, Error, DeleteProjectWorkItemCommentVariables>({
    mutationFn: async ({ projectId, itemId, commentId }) => {
      await deleteProjectWorkItemComment(projectId, itemId, commentId);
    },
    onSuccess: (_void, { projectId, itemId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.workItemComments(projectId, itemId),
      });
    },
  });
}
