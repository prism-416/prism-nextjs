import { MULTIPART_CONTENT_TYPE } from "@/shared/constants/api";
import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";

import type {
  ProjectDocument,
  ProjectDocumentSearchParams,
  ProjectDocumentSearchResult,
  UploadProjectDocumentPayload,
} from "../types";
import { getDefinedProjectDocumentSearchParams, getEmptyProjectDocumentSearchResult } from "../utils/document";

export async function getProjectDocuments(projectId: string, params?: ProjectDocumentSearchParams) {
  const searchParams = getDefinedProjectDocumentSearchParams(params);
  const response = await commonAxios<ProjectDocumentSearchParams | null, ApiResponse<ProjectDocumentSearchResult>>({
    url: `/projects/${encodeURIComponent(projectId)}/documents`,
    method: "GET",
    data: searchParams ?? null,
    version: null,
  });

  return response?.data ?? getEmptyProjectDocumentSearchResult(searchParams);
}

export async function uploadProjectDocument(projectId: string, payload: UploadProjectDocumentPayload) {
  const formData = new FormData();
  formData.append("file", payload.file);

  if (payload.title) {
    formData.append("title", payload.title);
  }

  if (payload.description) {
    formData.append("description", payload.description);
  }

  const response = await commonAxios<FormData, ApiResponse<ProjectDocument>>({
    url: `/projects/${encodeURIComponent(projectId)}/documents`,
    method: "POST",
    data: formData,
    version: null,
    config: {
      headers: {
        "Content-Type": MULTIPART_CONTENT_TYPE,
      },
    },
  });

  return response?.data;
}

export async function downloadProjectDocument(projectId: string, documentId: string) {
  const blob = await commonAxios<null, Blob>({
    url: `/projects/${encodeURIComponent(projectId)}/documents/${encodeURIComponent(documentId)}/download`,
    method: "GET",
    version: null,
  });

  return blob;
}

export async function deleteProjectDocument(projectId: string, documentId: string) {
  await commonAxios<null, unknown>({
    url: `/projects/${encodeURIComponent(projectId)}/documents/${encodeURIComponent(documentId)}`,
    method: "DELETE",
    version: null,
  });
}
