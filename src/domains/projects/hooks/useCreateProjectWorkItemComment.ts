"use client";

import { useQueryClient } from "@tanstack/react-query";

import { createProjectWorkItemComment } from "@/domains/projects/api";
import type { CreateProjectWorkItemCommentPayload, ProjectWorkItemComment } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type CreateProjectWorkItemCommentVariables = {
  projectId: string;
  itemId: string;
  payload: CreateProjectWorkItemCommentPayload;
};

export function useCreateProjectWorkItemComment() {
  const queryClient = useQueryClient();

  return useApiMutation<ProjectWorkItemComment, Error, CreateProjectWorkItemCommentVariables>({
    mutationFn: async ({ projectId, itemId, payload }) => {
      const comment = await createProjectWorkItemComment(projectId, itemId, payload);

      if (!comment) {
        throw new Error("Failed to create comment.");
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
