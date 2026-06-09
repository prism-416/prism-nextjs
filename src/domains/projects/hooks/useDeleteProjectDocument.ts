"use client";

import { useQueryClient } from "@tanstack/react-query";

import { deleteProjectDocument } from "@/domains/projects/api";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type DeleteProjectDocumentVariables = {
  projectId: string;
  documentId: string;
};

export function useDeleteProjectDocument() {
  const queryClient = useQueryClient();

  return useApiMutation<void, Error, DeleteProjectDocumentVariables>({
    mutationFn: ({ projectId, documentId }) => deleteProjectDocument(projectId, documentId),
    onSuccess: (_result, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.documents(projectId),
      });
    },
  });
}
