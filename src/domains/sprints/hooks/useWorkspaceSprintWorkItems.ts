"use client";

import { getWorkspaceSprintWorkItems } from "@/domains/sprints/api";
import type { SprintWorkItemSearchParams, SprintWorkItemSearchResult } from "@/domains/sprints/types";
import {
  getDefinedSprintWorkItemSearchParams,
  getEmptySprintWorkItemSearchResult,
} from "@/domains/sprints/utils/sprint";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_WORKSPACE_ID = "__missing_workspace_id__";
const MISSING_SPRINT_ID = "__missing_sprint_id__";

export function useWorkspaceSprintWorkItems(
  workspaceId?: string,
  sprintId?: string,
  filters?: SprintWorkItemSearchParams,
  initialData?: SprintWorkItemSearchResult,
) {
  const searchParams = getDefinedSprintWorkItemSearchParams(filters);
  const enabled = Boolean(workspaceId && sprintId);

  return useApiQuery<SprintWorkItemSearchResult>({
    queryKey: QUERY_KEYS.workspace.sprintWorkItems(
      workspaceId ?? MISSING_WORKSPACE_ID,
      sprintId ?? MISSING_SPRINT_ID,
      searchParams,
    ),
    queryFn: () =>
      enabled && workspaceId && sprintId
        ? getWorkspaceSprintWorkItems(workspaceId, sprintId, searchParams)
        : Promise.resolve(getEmptySprintWorkItemSearchResult(searchParams)),
    enabled,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
