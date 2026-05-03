"use client";

import { useQueryClient } from "@tanstack/react-query";

import { updateWorkspaceMemberRole } from "@/domains/workspaces/api";
import type { InvitationRole, WorkspaceMember } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type UpdateWorkspaceMemberRoleVariables = {
  workspaceId: string;
  userId: string;
  role: InvitationRole;
};

export function useUpdateWorkspaceMemberRole() {
  const queryClient = useQueryClient();

  return useApiMutation<WorkspaceMember, Error, UpdateWorkspaceMemberRoleVariables>({
    mutationFn: async ({ workspaceId, userId, role }) => {
      const member = await updateWorkspaceMemberRole(workspaceId, userId, { role });

      if (!member) {
        throw new Error("Failed to update member role.");
      }

      return member;
    },
    onSuccess: (member, { workspaceId }) => {
      queryClient.setQueryData<WorkspaceMember[]>(QUERY_KEYS.workspace.members(workspaceId), previous => {
        if (!previous) {
          return [member];
        }

        return previous.map(item => (item.userId === member.userId ? member : item));
      });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.members(workspaceId) });
    },
  });
}
