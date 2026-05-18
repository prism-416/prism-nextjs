"use client";

import { getProjectWorkItemComments } from "@/domains/projects/api";
import type { ProjectWorkItemCommentSearchParams, ProjectWorkItemCommentSearchResult } from "@/domains/projects/types";
import {
  getDefinedProjectCommentSearchParams,
  getEmptyProjectCommentSearchResult,
} from "@/domains/projects/utils/comment";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_PROJECT_ID = "__missing_project_id__";
const MISSING_WORK_ITEM_ID = "__missing_work_item_id__";

export function useProjectWorkItemComments(
  projectId?: string,
  itemId?: string,
  filters?: ProjectWorkItemCommentSearchParams,
  initialData?: ProjectWorkItemCommentSearchResult,
) {
  const searchParams = getDefinedProjectCommentSearchParams(filters);
  const enabled = Boolean(projectId && itemId);

  return useApiQuery<ProjectWorkItemCommentSearchResult>({
    queryKey: QUERY_KEYS.project.workItemCommentList(
      projectId ?? MISSING_PROJECT_ID,
      itemId ?? MISSING_WORK_ITEM_ID,
      searchParams,
    ),
    queryFn: () =>
      enabled && projectId && itemId
        ? getProjectWorkItemComments(projectId, itemId, searchParams)
        : Promise.resolve(getEmptyProjectCommentSearchResult(searchParams)),
    enabled,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
