"use client";

import { useQueryClient } from "@tanstack/react-query";

import { uploadProjectDocument } from "@/domains/projects/api";
import type { ProjectDocument, UploadProjectDocumentPayload } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type UploadProjectDocumentVariables = {
  projectId: string;
  payload: UploadProjectDocumentPayload;
};

export function useUploadProjectDocument() {
  const queryClient = useQueryClient();

  return useApiMutation<ProjectDocument, Error, UploadProjectDocumentVariables>({
    mutationFn: async ({ projectId, payload }) => {
      const document = await uploadProjectDocument(projectId, payload);

      if (!document) {
        throw new Error("Failed to upload document.");
      }

      return document;
    },
    onSuccess: (_document, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.documents(projectId),
      });
    },
  });
}
