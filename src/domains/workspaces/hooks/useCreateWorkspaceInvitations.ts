"use client";

import { createInvitation } from "@/domains/workspaces/api";
import type { CreateInvitationPayload, WorkspaceInvitation } from "@/domains/workspaces/types";
import { useApiMutation } from "@/shared/query";

type CreateWorkspaceInvitationsVariables = {
  workspaceId: string;
  invitations: CreateInvitationPayload[];
};

export function useCreateWorkspaceInvitations() {
  return useApiMutation<WorkspaceInvitation[], Error, CreateWorkspaceInvitationsVariables>({
    mutationFn: async ({ workspaceId, invitations }) => {
      if (invitations.length === 0) {
        return [];
      }

      const results = await Promise.allSettled(
        invitations.map(invitation => createInvitation(workspaceId, invitation)),
      );
      const failedCount = results.filter(result => result.status === "rejected" || !result.value).length;

      if (failedCount > 0) {
        throw new Error(`${failedCount} invite${failedCount === 1 ? "" : "s"} failed to send.`);
      }

      return results.flatMap(result => (result.status === "fulfilled" && result.value ? [result.value] : []));
    },
  });
}
