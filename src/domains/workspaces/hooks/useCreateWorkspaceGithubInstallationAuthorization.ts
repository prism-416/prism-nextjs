"use client";

import { createWorkspaceGithubInstallationAuthorization } from "@/domains/workspaces/api";
import type { GithubInstallationAuthorization } from "@/domains/workspaces/types";
import { useApiMutation } from "@/shared/query";

export function useCreateWorkspaceGithubInstallationAuthorization() {
  return useApiMutation<GithubInstallationAuthorization, unknown, string>({
    mutationFn: async workspaceId => {
      const authorization = await createWorkspaceGithubInstallationAuthorization(workspaceId);

      if (!authorization) {
        throw new Error("Failed to start GitHub connection.");
      }

      return authorization;
    },
  });
}
