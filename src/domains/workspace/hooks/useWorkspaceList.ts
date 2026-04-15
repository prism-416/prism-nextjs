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
    queryFn: async () => {
      const response = await getWorkspaces();

      if (!response?.data) {
        throw new Error("Failed to fetch workspace list.");
      }

      return response.data;
    },
    initialData: initialData ?? undefined,
  });
}
