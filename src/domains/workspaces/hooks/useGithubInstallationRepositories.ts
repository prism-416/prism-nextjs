"use client";

import { getGithubInstallationRepositories } from "@/domains/workspaces/api";
import type { GithubRepositoryOption } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

export function useGithubInstallationRepositories(workspaceId: string | null, githubInstallationId: string | null) {
  return useApiQuery<GithubRepositoryOption[]>({
    queryKey: QUERY_KEYS.workspace.githubInstallationRepositories(
      workspaceId ?? "missing",
      githubInstallationId ?? "missing",
    ),
    queryFn: () =>
      workspaceId && githubInstallationId
        ? getGithubInstallationRepositories(workspaceId, githubInstallationId)
        : Promise.resolve([]),
    enabled: Boolean(workspaceId && githubInstallationId),
    staleTime: 60 * 1000,
  });
}
