"use client";

import { getWorkspaces } from "@/domains/workspaces/api";
import type { Workspace } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

type UseWorkspacesParams = {
  initialData?: Workspace[];
};

export function useWorkspaces({ initialData }: UseWorkspacesParams) {
  return useApiQuery<Workspace[]>({
    queryKey: QUERY_KEYS.workspace.list(),
    queryFn: getWorkspaces,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
