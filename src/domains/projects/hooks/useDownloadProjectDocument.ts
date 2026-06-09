"use client";

import { downloadProjectDocument } from "@/domains/projects/api";
import { triggerBlobDownload } from "@/domains/projects/utils/document";
import { useApiMutation } from "@/shared/query";

type DownloadProjectDocumentVariables = {
  projectId: string;
  documentId: string;
  fileName: string;
};

export function useDownloadProjectDocument() {
  return useApiMutation<void, Error, DownloadProjectDocumentVariables>({
    mutationFn: async ({ projectId, documentId, fileName }) => {
      const blob = await downloadProjectDocument(projectId, documentId);

      if (!blob) {
        throw new Error("Failed to download document.");
      }

      triggerBlobDownload(blob, fileName);
    },
  });
}
