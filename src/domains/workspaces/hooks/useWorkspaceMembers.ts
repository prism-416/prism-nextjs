"use client";

import { getWorkspaceMembers } from "@/domains/workspaces/api";
import type { WorkspaceMember } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

export function useWorkspaceMembers(workspaceId: string, initialData?: WorkspaceMember[]) {
  return useApiQuery<WorkspaceMember[]>({
    queryKey: QUERY_KEYS.workspace.members(workspaceId),
    queryFn: () => getWorkspaceMembers(workspaceId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
