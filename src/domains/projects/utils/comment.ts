import type { ProjectWorkItemCommentSearchParams, ProjectWorkItemCommentSearchResult } from "@/domains/projects/types";

const DEFAULT_COMMENT_LIMIT = 50;
const DEFAULT_COMMENT_OFFSET = 0;

export function getDefinedProjectCommentSearchParams(params?: ProjectWorkItemCommentSearchParams) {
  if (!params) {
    return undefined;
  }

  const entries = Object.entries(params).filter(([, value]) => value !== undefined);

  if (entries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(entries) as ProjectWorkItemCommentSearchParams;
}

export function getEmptyProjectCommentSearchResult(
  params?: ProjectWorkItemCommentSearchParams,
): ProjectWorkItemCommentSearchResult {
  return {
    comments: [],
    total: 0,
    limit: params?.limit ?? DEFAULT_COMMENT_LIMIT,
    offset: params?.offset ?? DEFAULT_COMMENT_OFFSET,
  };
}
