"use client";

import { getProjectParticipants } from "@/domains/projects/api";
import type { ProjectParticipant } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

export function useProjectParticipants(workspaceId: string | undefined, initialData?: ProjectParticipant[]) {
  return useApiQuery<ProjectParticipant[]>({
    queryKey: QUERY_KEYS.workspace.members(workspaceId ?? ""),
    queryFn: async () => (workspaceId ? ((await getProjectParticipants(workspaceId)) ?? []) : []),
    initialData: initialData ?? undefined,
    enabled: Boolean(workspaceId),
    staleTime: 5 * 60 * 1000,
  });
}
