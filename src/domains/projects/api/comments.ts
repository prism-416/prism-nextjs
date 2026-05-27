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
  body: CreateProjectWorkItemCommentPayload,
) {
  const response = await commonAxios<CreateProjectWorkItemCommentPayload, ApiResponse<ProjectWorkItemComment>>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}/comments`,
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
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
