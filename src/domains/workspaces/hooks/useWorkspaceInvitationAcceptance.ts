"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { acceptInvitation, declineInvitation, getWorkspaceInvitation } from "@/domains/workspaces/api";
import { WORKSPACE_INVITATION_ERROR_MESSAGES } from "@/domains/workspaces/constants/invitation";
import type { Workspace, WorkspaceInvitationPreview, WorkspaceInvitationStatus } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiMutation, useApiQuery } from "@/shared/query";

export type WorkspaceInvitationScreenStatus =
  | "loading"
  | "ready"
  | "accepting"
  | "declining"
  | "accepted"
  | "declined"
  | "expired"
  | "error";

type UseWorkspaceInvitationAcceptanceParams = {
  token: string;
  initialData?: WorkspaceInvitationPreview;
  initialErrorMessage?: string;
};

function toScreenStatus(status: WorkspaceInvitationStatus): WorkspaceInvitationScreenStatus {
  if (status === "pending") {
    return "ready";
  }

  if (status === "accepted") {
    return "accepted";
  }

  if (status === "declined") {
    return "declined";
  }

  return "expired";
}

function withInvitationStatus(
  invitation: WorkspaceInvitationPreview | undefined,
  status: WorkspaceInvitationStatus,
  workspace?: Workspace,
) {
  if (!invitation) {
    return invitation;
  }

  return {
    ...invitation,
    workspaceId: workspace?.workspaceId ?? invitation.workspaceId,
    workspaceName: workspace?.name ?? invitation.workspaceName,
    workspaceSlug: workspace?.slug ?? invitation.workspaceSlug,
    status,
  };
}

export function useWorkspaceInvitationAcceptance({
  token,
  initialData,
  initialErrorMessage,
}: UseWorkspaceInvitationAcceptanceParams) {
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.workspace.invitation(token);

  const [acceptedWorkspace, setAcceptedWorkspace] = useState<Workspace | null>(null);
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage ?? "");
  const [isInvitationQueryEnabled, setIsInvitationQueryEnabled] = useState(!initialErrorMessage);

  const invitationQuery = useApiQuery<WorkspaceInvitationPreview, Error>({
    queryKey,
    queryFn: async () => {
      const invitation = await getWorkspaceInvitation({ token });

      if (!invitation) {
        throw new Error(WORKSPACE_INVITATION_ERROR_MESSAGES.load);
      }

      return invitation;
    },
    initialData: initialData ?? undefined,
    enabled: isInvitationQueryEnabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const acceptMutation = useApiMutation<Workspace, Error, void>({
    mutationFn: async () => {
      const workspace = await acceptInvitation({ token });

      if (!workspace) {
        throw new Error(WORKSPACE_INVITATION_ERROR_MESSAGES.accept);
      }

      return workspace;
    },
    onSuccess: workspace => {
      setAcceptedWorkspace(workspace);
      setErrorMessage("");

      queryClient.setQueryData<WorkspaceInvitationPreview | undefined>(queryKey, previous =>
        withInvitationStatus(previous, "accepted", workspace),
      );

      queryClient.setQueryData<Workspace>(QUERY_KEYS.workspace.detail(workspace.workspaceId), workspace);
      queryClient.setQueryData<Workspace[]>(QUERY_KEYS.workspace.list(), previous => {
        if (!previous) {
          return [workspace];
        }

        return [workspace, ...previous.filter(item => item.workspaceId !== workspace.workspaceId)];
      });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.list() });
    },
  });

  const declineMutation = useApiMutation<void, Error, void>({
    mutationFn: async () => {
      await declineInvitation({ token });
    },
    onSuccess: () => {
      setErrorMessage("");

      queryClient.setQueryData<WorkspaceInvitationPreview | undefined>(queryKey, previous =>
        withInvitationStatus(previous, "declined"),
      );
    },
  });

  const syncInvitationStatus = async (fallbackMessage: string) => {
    setIsInvitationQueryEnabled(true);

    const result = await invitationQuery.refetch();

    if (result.data) {
      setErrorMessage("");
      return;
    }

    setErrorMessage(fallbackMessage);
  };

  const retry = async () => {
    setErrorMessage("");
    await syncInvitationStatus(WORKSPACE_INVITATION_ERROR_MESSAGES.load);
  };

  const handleAccept = async () => {
    try {
      setErrorMessage("");
      await acceptMutation.mutateAsync();
    } catch {
      await syncInvitationStatus(WORKSPACE_INVITATION_ERROR_MESSAGES.action);
    }
  };

  const handleDecline = async () => {
    try {
      setErrorMessage("");
      await declineMutation.mutateAsync();
    } catch {
      await syncInvitationStatus(WORKSPACE_INVITATION_ERROR_MESSAGES.action);
    }
  };

  const invitation = invitationQuery.data;
  const workspace = acceptedWorkspace;
  let status: WorkspaceInvitationScreenStatus = "error";

  if (acceptMutation.isPending) {
    status = "accepting";
  } else if (declineMutation.isPending) {
    status = "declining";
  } else if (errorMessage) {
    status = "error";
  } else if (invitationQuery.isPending && !invitation) {
    status = "loading";
  } else if (invitationQuery.isError) {
    status = "error";
  } else if (invitation) {
    status = toScreenStatus(invitation.status);
  }

  return {
    status,
    invitation: invitation ?? null,
    workspace,
    errorMessage: errorMessage || WORKSPACE_INVITATION_ERROR_MESSAGES.load,
    retry,
    accept: handleAccept,
    decline: handleDecline,
  };
}
