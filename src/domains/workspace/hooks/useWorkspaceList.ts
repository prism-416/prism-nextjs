"use client";

import { getWorkspaces } from "@/domains/workspace/api";
import type { Workspace } from "@/domains/workspace/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

type UseWorkspaceListParams = {
  initialData?: Workspace[];
};

export function useWorkspaceList({ initialData }: UseWorkspaceListParams) {
  return useApiQuery<Workspace[]>({
    queryKey: QUERY_KEYS.workspace.list(),
    queryFn: getWorkspaces,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
