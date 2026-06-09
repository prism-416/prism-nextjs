import { MULTIPART_CONTENT_TYPE } from "@/shared/constants/api";
import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";

import type {
  CreateProjectWorkItemCommentPayload,
  ProjectWorkItemComment,
  ProjectWorkItemCommentSearchParams,
  ProjectWorkItemCommentSearchResult,
  UpdateProjectWorkItemCommentPayload,
} from "../types";
import { getDefinedProjectCommentSearchParams, getEmptyProjectCommentSearchResult } from "../utils/comment";

export async function getProjectWorkItemComments(
  projectId: string,
  itemId: string,
  params?: ProjectWorkItemCommentSearchParams,
) {
  const searchParams = getDefinedProjectCommentSearchParams(params);
  const response = await commonAxios<
    ProjectWorkItemCommentSearchParams | null,
    ApiResponse<ProjectWorkItemCommentSearchResult>
  >({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}/comments`,
    method: "GET",
    data: searchParams ?? null,
    version: null,
  });

  return response?.data ?? getEmptyProjectCommentSearchResult(searchParams);
}

export async function createProjectWorkItemComment(
  projectId: string,
  itemId: string,
  payload: CreateProjectWorkItemCommentPayload,
) {
  const hasFiles = Boolean(payload.files?.length);
  const data = hasFiles
    ? (() => {
        const formData = new FormData();
        formData.append("body", payload.body);
        for (const file of payload.files ?? []) {
          formData.append("files", file);
        }
        return formData;
      })()
    : payload;

  const response = await commonAxios<
    FormData | CreateProjectWorkItemCommentPayload,
    ApiResponse<ProjectWorkItemComment>
  >({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}/comments`,
    method: "POST",
    data,
    version: null,
    config: hasFiles
      ? {
          headers: {
            "Content-Type": MULTIPART_CONTENT_TYPE,
          },
        }
      : undefined,
  });

  return response?.data;
}

export async function deleteProjectWorkItemComment(projectId: string, itemId: string, commentId: string) {
  await commonAxios<null, ApiResponse<null>>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}/comments/${encodeURIComponent(commentId)}`,
    method: "DELETE",
    version: null,
  });
}

export async function updateProjectWorkItemComment(
  projectId: string,
  itemId: string,
  commentId: string,
  body: UpdateProjectWorkItemCommentPayload,
) {
  const response = await commonAxios<UpdateProjectWorkItemCommentPayload, ApiResponse<ProjectWorkItemComment>>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}/comments/${encodeURIComponent(commentId)}`,
    method: "PATCH",
    data: body,
    version: null,
  });

  return response?.data;
}
