"use client";

import { useState } from "react";

import {
  DEFAULT_WORKSPACE_INVITATION_ROLE,
  WORKSPACE_INVITATION_ROLE_OPTIONS,
} from "@/domains/workspace/constants/invitation";
import type {
  InvitationRole,
  InviteMember,
  WorkspaceMemberCandidate,
  WorkspaceMemberCandidateSearchResult,
} from "@/domains/workspace/types";
import { createExternalCandidate, getWorkspaceMemberSearchFeedback } from "@/domains/workspace/utils/invite-member";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}

type UseInviteMemberSelectionParams = {
  currentUserEmail: string;
  clearSearchState: () => void;
  onMemberQueryChange: (value: string) => void;
  searchCandidates: (keyword: string) => Promise<WorkspaceMemberCandidateSearchResult>;
};

export function useInviteMemberSelection({
  currentUserEmail,
  clearSearchState,
  onMemberQueryChange,
  searchCandidates,
}: UseInviteMemberSelectionParams) {
  const [selectedInvites, setSelectedInvites] = useState<InviteMember[]>([]);
  const [inviteRole, setInviteRole] = useState<InvitationRole>(DEFAULT_WORKSPACE_INVITATION_ROLE);
  const [inviteFieldError, setInviteFieldError] = useState<string | null>(null);
  const [isResolvingMember, setIsResolvingMember] = useState(false);

  const roleOptions = WORKSPACE_INVITATION_ROLE_OPTIONS;
  const selectedRoleDescription = roleOptions.find(option => option.value === inviteRole)?.description ?? null;
  const hasExternalInvites = selectedInvites.some(invite => invite.kind === "external");

  function clearInviteFieldError() {
    setInviteFieldError(null);
  }

  function handleMemberQueryChange(value: string) {
    onMemberQueryChange(value);
    clearInviteFieldError();
  }

  function handleRemoveInvite(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    setSelectedInvites(previous => previous.filter(invite => invite.email.trim().toLowerCase() !== normalizedEmail));
  }

  function handleAddCandidate(candidate: WorkspaceMemberCandidate) {
    const normalizedEmail = candidate.email.trim().toLowerCase();

    if (currentUserEmail && normalizedEmail === currentUserEmail) {
      setInviteFieldError("You can't add yourself.");
      return false;
    }

    if (selectedInvites.some(invite => invite.email.trim().toLowerCase() === normalizedEmail)) {
      setInviteFieldError("This email is already in the invite list.");
      return false;
    }

    setInviteFieldError(null);
    setSelectedInvites(previous => [...previous, { ...candidate, role: inviteRole }]);
    clearSearchState();
    return true;
  }

  async function handleAddInvite(memberQuery: string) {
    const trimmedMemberQuery = memberQuery.trim();
    const normalizedMemberQuery = trimmedMemberQuery.toLowerCase();

    if (!trimmedMemberQuery) {
      return;
    }

    if (!isValidEmail(trimmedMemberQuery)) {
      setInviteFieldError("Enter a valid email address.");
      return;
    }

    if (currentUserEmail && normalizedMemberQuery === currentUserEmail) {
      setInviteFieldError("You can't add yourself.");
      return;
    }

    if (selectedInvites.some(invite => invite.email.trim().toLowerCase() === normalizedMemberQuery)) {
      setInviteFieldError("This email is already in the invite list.");
      return;
    }

    setInviteFieldError(null);
    setIsResolvingMember(true);

    try {
      const searchResult = await searchCandidates(trimmedMemberQuery);

      if (searchResult.reason !== "success") {
        setInviteFieldError(
          getWorkspaceMemberSearchFeedback(searchResult.reason, trimmedMemberQuery) ?? "Unable to add that member.",
        );
        return;
      }

      const exactCandidate = searchResult.items.find(
        candidate => candidate.email.trim().toLowerCase() === normalizedMemberQuery,
      );
      const candidate = exactCandidate ?? createExternalCandidate(trimmedMemberQuery);

      handleAddCandidate(candidate);
    } catch {
      setInviteFieldError("Failed to check that email. Please try again.");
    } finally {
      setIsResolvingMember(false);
    }
  }

  return {
    hasExternalInvites,
    inviteFieldError,
    inviteRole,
    isResolvingMember,
    roleOptions,
    selectedInvites,
    selectedRoleDescription,
    clearInviteFieldError,
    handleAddCandidate,
    handleAddInvite,
    handleMemberQueryChange,
    handleRemoveInvite,
    setInviteRole,
  };
}
