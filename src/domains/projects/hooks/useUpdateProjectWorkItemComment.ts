"use client";

import { useQueryClient } from "@tanstack/react-query";

import { updateProjectWorkItemComment } from "@/domains/projects/api";
import type { ProjectWorkItemComment, UpdateProjectWorkItemCommentPayload } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type UpdateProjectWorkItemCommentVariables = {
  projectId: string;
  itemId: string;
  commentId: string;
  payload: UpdateProjectWorkItemCommentPayload;
};

export function useUpdateProjectWorkItemComment() {
  const queryClient = useQueryClient();

  return useApiMutation<ProjectWorkItemComment, Error, UpdateProjectWorkItemCommentVariables>({
    mutationFn: async ({ projectId, itemId, commentId, payload }) => {
      const comment = await updateProjectWorkItemComment(projectId, itemId, commentId, payload);

      if (!comment) {
        throw new Error("Failed to update comment.");
      }

      return comment;
    },
    onSuccess: (_comment, { projectId, itemId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.workItemComments(projectId, itemId),
      });
    },
  });
}
