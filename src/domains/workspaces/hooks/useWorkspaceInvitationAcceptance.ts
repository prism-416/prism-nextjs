"use client";

import { useEffect, useState } from "react";

import { acceptInvitation, declineInvitation, getWorkspaceInvitation } from "@/domains/workspaces/api";
import type { Workspace, WorkspaceInvitationPreview, WorkspaceInvitationStatus } from "@/domains/workspaces/types";

export type WorkspaceInvitationScreenStatus =
  | "loading"
  | "ready"
  | "accepting"
  | "declining"
  | "accepted"
  | "declined"
  | "expired"
  | "error";

type WorkspaceInvitationAcceptanceState = {
  status: WorkspaceInvitationScreenStatus;
  invitation: WorkspaceInvitationPreview | null;
  workspace: Workspace | null;
  errorMessage: string;
};

const LOAD_ERROR_MESSAGE = "Invitation could not be loaded. The link may be invalid or expired.";
const ACTION_ERROR_MESSAGE = "Invitation action failed. Please try again.";
const ACCEPT_ERROR_MESSAGE = "Invitation acceptance failed. Please try again.";

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

export function useWorkspaceInvitationAcceptance(token: string) {
  const [state, setState] = useState<WorkspaceInvitationAcceptanceState>({
    status: "loading",
    invitation: null,
    workspace: null,
    errorMessage: "",
  });

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const invitation = await getWorkspaceInvitation({ token });

        if (cancelled) {
          return;
        }

        if (!invitation) {
          setState(previous => ({
            ...previous,
            status: "error",
            errorMessage: LOAD_ERROR_MESSAGE,
          }));
          return;
        }

        setState(previous => ({
          ...previous,
          invitation,
          status: toScreenStatus(invitation.status),
          errorMessage: "",
        }));
      } catch {
        if (cancelled) {
          return;
        }

        setState(previous => ({
          ...previous,
          status: "error",
          errorMessage: LOAD_ERROR_MESSAGE,
        }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const retry = async () => {
    setState(previous => ({
      ...previous,
      status: "loading",
      errorMessage: "",
    }));

    try {
      const invitation = await getWorkspaceInvitation({ token });

      if (!invitation) {
        setState(previous => ({
          ...previous,
          status: "error",
          errorMessage: LOAD_ERROR_MESSAGE,
        }));
        return;
      }

      setState(previous => ({
        ...previous,
        invitation,
        status: toScreenStatus(invitation.status),
        errorMessage: "",
      }));
    } catch {
      setState(previous => ({
        ...previous,
        status: "error",
        errorMessage: LOAD_ERROR_MESSAGE,
      }));
    }
  };

  const syncInvitationStatus = async () => {
    try {
      const invitation = await getWorkspaceInvitation({ token });

      if (!invitation) {
        setState(previous => ({
          ...previous,
          status: "error",
          errorMessage: LOAD_ERROR_MESSAGE,
        }));
        return;
      }

      setState(previous => ({
        ...previous,
        invitation,
        status: toScreenStatus(invitation.status),
        errorMessage: "",
      }));
    } catch {
      setState(previous => ({
        ...previous,
        status: "error",
        errorMessage: ACTION_ERROR_MESSAGE,
      }));
    }
  };

  const handleAccept = async () => {
    setState(previous => ({
      ...previous,
      status: "accepting",
      errorMessage: "",
    }));

    try {
      const workspace = await acceptInvitation({ token });

      if (!workspace) {
        setState(previous => ({
          ...previous,
          status: "error",
          errorMessage: ACCEPT_ERROR_MESSAGE,
        }));
        return;
      }

      setState(previous => ({
        ...previous,
        workspace,
        status: "accepted",
        errorMessage: "",
      }));
    } catch {
      await syncInvitationStatus();
    }
  };

  const handleDecline = async () => {
    setState(previous => ({
      ...previous,
      status: "declining",
      errorMessage: "",
    }));

    try {
      await declineInvitation({ token });

      setState(previous => ({
        ...previous,
        status: "declined",
        errorMessage: "",
      }));
    } catch {
      await syncInvitationStatus();
    }
  };

  return {
    ...state,
    retry,
    accept: handleAccept,
    decline: handleDecline,
  };
}
