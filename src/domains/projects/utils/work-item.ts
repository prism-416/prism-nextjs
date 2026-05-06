import type { ProjectWorkItemSearchParams, ProjectWorkItemSearchResult } from "@/domains/projects/types";

const DEFAULT_WORK_ITEM_LIMIT = 50;
const DEFAULT_WORK_ITEM_OFFSET = 0;

export function getDefinedProjectWorkItemSearchParams(params?: ProjectWorkItemSearchParams) {
  if (!params) {
    return undefined;
  }

  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== "");

  if (entries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(entries) as ProjectWorkItemSearchParams;
}

export function getEmptyProjectWorkItemSearchResult(params?: ProjectWorkItemSearchParams): ProjectWorkItemSearchResult {
  return {
    items: [],
    total: 0,
    limit: params?.limit ?? DEFAULT_WORK_ITEM_LIMIT,
    offset: params?.offset ?? DEFAULT_WORK_ITEM_OFFSET,
  };
}
