"use client";

import { useState } from "react";

import { Button } from "@/atomics/atoms/Button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/atomics/molecules/Dialog";
import { CreateWorkspaceInviteSection } from "@/domains/workspaces/components/create-dialog/CreateWorkspaceInviteSection";
import { useCreateWorkspaceInvitations } from "@/domains/workspaces/hooks/useCreateWorkspaceInvitations";
import { useInviteMemberSelection } from "@/domains/workspaces/hooks/useInviteMemberSelection";
import { useWorkspaceMemberCandidateSearch } from "@/domains/workspaces/hooks/useWorkspaceMemberCandidateSearch";
import { isExistingInvite } from "@/domains/workspaces/utils/invite-member";

type WorkspaceInviteMembersDialogContentProps = {
  workspaceId: string;
  onOpenChange: (open: boolean) => void;
};

export function WorkspaceInviteMembersDialogContent({
  workspaceId,
  onOpenChange,
}: WorkspaceInviteMembersDialogContentProps) {
  const [message, setMessage] = useState<string | null>(null);
  const {
    candidateSearchError,
    candidateSearchResult,
    isSearchingCandidates,
    memberQuery,
    shouldShowCandidateResults,
    trimmedMemberQuery,
    clearSearchState,
    handleMemberQueryChange,
    searchCandidates,
  } = useWorkspaceMemberCandidateSearch(workspaceId);
  const {
    inviteFieldError,
    inviteRole,
    isResolvingMember,
    roleOptions,
    selectedInvites,
    selectedRoleDescription,
    handleAddCandidate,
    handleAddInvite,
    handleMemberQueryChange: handleInviteMemberQueryChange,
    handleRemoveInvite,
    setInviteRole,
  } = useInviteMemberSelection({
    clearSearchState,
    onMemberQueryChange: handleMemberQueryChange,
    searchCandidates,
  });
  const createInvitations = useCreateWorkspaceInvitations();
  const isSubmitting = createInvitations.isPending;

  async function handleSubmit() {
    if (selectedInvites.length === 0) {
      setMessage("Add at least one member to invite.");
      return;
    }

    setMessage(null);

    try {
      await createInvitations.mutateAsync({
        workspaceId,
        invitations: selectedInvites.map(invite =>
          isExistingInvite(invite)
            ? { receiverId: invite.userId, role: invite.role }
            : { email: invite.email, role: invite.role },
        ),
      });
      onOpenChange(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to send invites.");
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Invite members</DialogTitle>
        <DialogDescription>Add people to this workspace by email, username, or name.</DialogDescription>
      </DialogHeader>

      <CreateWorkspaceInviteSection
        memberQuery={memberQuery}
        inviteRole={inviteRole}
        roleOptions={roleOptions}
        inviteFieldError={inviteFieldError}
        isSubmitting={isSubmitting}
        isResolvingMember={isResolvingMember}
        candidateSearchResult={candidateSearchResult}
        candidateSearchError={candidateSearchError}
        isSearchingCandidates={isSearchingCandidates}
        shouldShowCandidateResults={shouldShowCandidateResults}
        selectedRoleDescription={selectedRoleDescription}
        selectedInvites={selectedInvites}
        onMemberQueryChange={handleInviteMemberQueryChange}
        onInviteRoleChange={setInviteRole}
        onAddInvite={() => {
          void handleAddInvite(trimmedMemberQuery);
        }}
        onAddCandidate={handleAddCandidate}
        onRemoveInvite={handleRemoveInvite}
      />

      {message ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-prism-danger-soft bg-prism-danger-soft/20 px-3 py-2 text-sm text-prism-danger"
        >
          {message}
        </p>
      ) : null}

      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
          className="h-10 rounded-lg"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => {
            void handleSubmit();
          }}
          disabled={isSubmitting || selectedInvites.length === 0}
        >
          {isSubmitting ? "Sending..." : "Send invites"}
        </Button>
      </DialogFooter>
    </>
  );
}
