"use client";

import { Label } from "@/atomics/atoms/Label";
import { Typography } from "@/atomics/atoms/Typography";
import { InviteMemberChip } from "@/domains/workspaces/components/create-dialog/InviteMemberChip";
import { InviteMemberInput } from "@/domains/workspaces/components/create-dialog/InviteMemberInput";
import { InviteMemberSearchResults } from "@/domains/workspaces/components/create-dialog/InviteMemberSearchResults";
import type {
  InvitationRole,
  InviteMember,
  WorkspaceInvitationRoleOption,
  WorkspaceMemberCandidate,
  WorkspaceMemberCandidateSearchResult,
} from "@/domains/workspaces/types";

type CreateWorkspaceInviteSectionProps = {
  memberQuery: string;
  inviteRole: InvitationRole;
  roleOptions: WorkspaceInvitationRoleOption[];
  inviteFieldError?: string | null;
  isSubmitting?: boolean;
  isResolvingMember?: boolean;
  candidateSearchResult: WorkspaceMemberCandidateSearchResult | null;
  candidateSearchError?: string | null;
  isSearchingCandidates?: boolean;
  shouldShowCandidateResults?: boolean;
  selectedRoleDescription?: string | null;
  selectedInvites: InviteMember[];
  hasExternalInvites?: boolean;
  onMemberQueryChange: (value: string) => void;
  onInviteRoleChange: (role: InvitationRole) => void;
  onAddInvite: () => void;
  onAddCandidate: (candidate: WorkspaceMemberCandidate) => void;
  onRemoveInvite: (email: string) => void;
};

export function CreateWorkspaceInviteSection({
  memberQuery,
  inviteRole,
  roleOptions,
  inviteFieldError = null,
  isSubmitting = false,
  isResolvingMember = false,
  candidateSearchResult,
  candidateSearchError = null,
  isSearchingCandidates = false,
  shouldShowCandidateResults = false,
  selectedRoleDescription = null,
  selectedInvites,
  hasExternalInvites = false,
  onMemberQueryChange,
  onInviteRoleChange,
  onAddInvite,
  onAddCandidate,
  onRemoveInvite,
}: CreateWorkspaceInviteSectionProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label
          htmlFor="workspace-members"
          className="text-prism-body"
        >
          Invite members
          <span className="ml-1 text-prism-muted/80">(optional)</span>
        </Label>
        <Typography
          variant="caption"
          tone="muted"
        >
          Search by name, username, or email, then select a member to add.
        </Typography>
      </div>

      <div className="space-y-2">
        <InviteMemberInput
          value={memberQuery}
          role={inviteRole}
          roleOptions={roleOptions}
          errorMessage={inviteFieldError}
          inputDisabled={isSubmitting || isResolvingMember}
          actionDisabled={isSubmitting || isResolvingMember}
          roleOptionsDisabled={isSubmitting || isResolvingMember || roleOptions.length === 0}
          isResolvingMember={isResolvingMember}
          onValueChange={onMemberQueryChange}
          onRoleChange={onInviteRoleChange}
          onSubmit={onAddInvite}
        />

        <InviteMemberSearchResults
          searchResult={candidateSearchResult}
          keyword={memberQuery.trim()}
          isLoading={isSearchingCandidates}
          visible={shouldShowCandidateResults}
          errorMessage={candidateSearchError}
          onSelect={onAddCandidate}
        />
      </div>

      {selectedRoleDescription && (
        <Typography
          variant="caption"
          tone="muted"
        >
          {selectedRoleDescription}
        </Typography>
      )}

      {selectedInvites.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedInvites.map(invite => (
            <InviteMemberChip
              key={invite.email.toLowerCase()}
              invite={invite}
              roleOptions={roleOptions}
              onRemove={onRemoveInvite}
            />
          ))}
        </div>
      )}

      {hasExternalInvites && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
          <Typography
            variant="caption"
            tone="inherit"
            className="text-amber-800"
          >
            External email delivery is not available yet. Those invites will stay unsent for now.
          </Typography>
        </div>
      )}
    </div>
  );
}
