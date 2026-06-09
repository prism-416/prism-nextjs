"use client";

import { getWorkspaceById } from "@/domains/workspaces/api";
import type { Workspace } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

export function useWorkspaceById(workspaceId: string | null, initialData?: Workspace) {
  return useApiQuery<Workspace | undefined>({
    queryKey: QUERY_KEYS.workspace.detail(workspaceId ?? "missing"),
    queryFn: () => (workspaceId ? getWorkspaceById(workspaceId) : Promise.resolve(undefined)),
    enabled: Boolean(workspaceId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
