import type { QueryClient } from "@tanstack/react-query";

import { getProjectWorkItemChildren, getProjectWorkItemComments } from "@/domains/projects/api";
import type { ProjectWorkItem } from "@/domains/projects/types";
import { getWorkspaceMembers } from "@/domains/workspaces/api";
import { QUERY_KEYS } from "@/shared/query";

const WORK_ITEM_DETAIL_STALE_TIME_MS = 5 * 60 * 1000;

export function prefetchProjectWorkItemDetail(queryClient: QueryClient, workItem: ProjectWorkItem) {
  queryClient.setQueryData(QUERY_KEYS.project.workItemDetail(workItem.projectId, workItem.itemId), workItem);

  void queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.project.workItemChildren(workItem.projectId, workItem.itemId),
    queryFn: () => getProjectWorkItemChildren(workItem.projectId, workItem.itemId),
    staleTime: WORK_ITEM_DETAIL_STALE_TIME_MS,
  });

  void queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.project.workItemCommentList(workItem.projectId, workItem.itemId, undefined),
    queryFn: () => getProjectWorkItemComments(workItem.projectId, workItem.itemId, undefined),
    staleTime: WORK_ITEM_DETAIL_STALE_TIME_MS,
  });

  void queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.workspace.members(workItem.workspaceId),
    queryFn: () => getWorkspaceMembers(workItem.workspaceId),
    staleTime: WORK_ITEM_DETAIL_STALE_TIME_MS,
  });
}
