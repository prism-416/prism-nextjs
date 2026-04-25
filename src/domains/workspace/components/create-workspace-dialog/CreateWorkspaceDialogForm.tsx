"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/atomics/atoms/Button";
import { DialogFooter } from "@/atomics/atoms/Dialog";
import { Typography } from "@/atomics/atoms/Typography";
import { createInvitation } from "@/domains/workspace/api";
import { CreateWorkspaceDetailsSection } from "@/domains/workspace/components/create-workspace-dialog/CreateWorkspaceDetailsSection";
import { CreateWorkspaceDialogHero } from "@/domains/workspace/components/create-workspace-dialog/CreateWorkspaceDialogHero";
import { CreateWorkspaceInviteSection } from "@/domains/workspace/components/create-workspace-dialog/CreateWorkspaceInviteSection";
import { useCreateWorkspace } from "@/domains/workspace/hooks/useCreateWorkspace";
import { useInviteMemberSelection } from "@/domains/workspace/hooks/useInviteMemberSelection";
import { useWorkspaceMemberCandidateSearch } from "@/domains/workspace/hooks/useWorkspaceMemberCandidateSearch";
import type { Workspace } from "@/domains/workspace/types";
import { isExistingInvite } from "@/domains/workspace/utils/invite-member";

type CreateWorkspaceDialogFormProps = {
  onOpenChange: (open: boolean) => void;
  onCreated?: (workspace: Workspace) => void;
};

const NAME_MAX = 48;
const DESCRIPTION_MAX = 180;

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

export function CreateWorkspaceDialogForm({ onOpenChange, onCreated }: CreateWorkspaceDialogFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isCreatingInvitations, setIsCreatingInvitations] = useState(false);

  const {
    candidateSearchError,
    candidateSearchResult,
    currentUserEmail,
    isSearchingCandidates,
    memberQuery,
    shouldShowCandidateResults,
    trimmedMemberQuery,
    clearSearchState,
    handleMemberQueryChange: handleSearchMemberQueryChange,
    searchCandidates,
  } = useWorkspaceMemberCandidateSearch();
  const {
    inviteFieldError,
    inviteRole,
    hasExternalInvites,
    isResolvingMember,
    roleOptions,
    selectedInvites,
    selectedRoleDescription,
    handleAddCandidate,
    handleAddInvite: handleSelectionAddInvite,
    handleMemberQueryChange,
    handleRemoveInvite,
    setInviteRole,
  } = useInviteMemberSelection({
    currentUserEmail,
    clearSearchState,
    onMemberQueryChange: handleSearchMemberQueryChange,
    searchCandidates,
  });
  const { mutateAsync, isPending, error } = useCreateWorkspace();

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  const isNameValid = trimmedName.length >= 2;
  const isSubmitting = isPending || isCreatingInvitations;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isNameValid) {
      setFieldError("Workspace name must be at least 2 characters.");
      return;
    }

    setFieldError(null);

    try {
      const workspace = await mutateAsync({
        name: trimmedName,
        description: trimmedDescription || undefined,
      });

      const existingInvites = selectedInvites.filter(isExistingInvite);
      const externalInvites = selectedInvites.filter(invite => !isExistingInvite(invite));
      let failedExistingInviteCount = 0;

      if (existingInvites.length > 0) {
        setIsCreatingInvitations(true);

        const results = await Promise.allSettled(
          existingInvites.map(invite =>
            createInvitation(workspace.workspaceId, {
              receiverId: invite.userId,
              role: invite.role,
            }),
          ),
        );

        failedExistingInviteCount = results.filter(result => result.status === "rejected").length;
        setIsCreatingInvitations(false);
      }

      const postCreateMessages: string[] = [];

      if (failedExistingInviteCount > 0) {
        postCreateMessages.push(
          `${failedExistingInviteCount} ${pluralize(failedExistingInviteCount, "existing invite")} failed to send.`,
        );
      }

      if (externalInvites.length > 0) {
        postCreateMessages.push(
          `${externalInvites.length} ${pluralize(externalInvites.length, "external invite")} were not sent because email-based invitations are not available yet.`,
        );
      }

      if (postCreateMessages.length > 0) {
        window.alert(postCreateMessages.join("\n"));
      }

      onCreated?.(workspace);
      onOpenChange(false);
    } catch {
      setIsCreatingInvitations(false);
    }
  };

  return (
    <>
      <CreateWorkspaceDialogHero />

      <form
        onSubmit={handleSubmit}
        className="space-y-5 px-6 pb-6 pt-5"
        noValidate
      >
        <CreateWorkspaceDetailsSection
          name={name}
          description={description}
          fieldError={fieldError}
          nameMax={NAME_MAX}
          descriptionMax={DESCRIPTION_MAX}
          onNameChange={value => {
            setName(value);
            if (fieldError) {
              setFieldError(null);
            }
          }}
          onDescriptionChange={setDescription}
        />

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
          selectedRoleDescription={selectedRoleDescription}
          selectedInvites={selectedInvites}
          hasExternalInvites={hasExternalInvites}
          onMemberQueryChange={handleMemberQueryChange}
          onInviteRoleChange={setInviteRole}
          onAddInvite={() => handleSelectionAddInvite(trimmedMemberQuery)}
          onAddCandidate={handleAddCandidate}
          onRemoveInvite={handleRemoveInvite}
          shouldShowCandidateResults={shouldShowCandidateResults && !inviteFieldError}
        />

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2"
          >
            <Typography
              variant="caption"
              tone="inherit"
              className="text-red-700"
            >
              {error.message || "Something went wrong. Please try again."}
            </Typography>
          </div>
        )}

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
            type="submit"
            disabled={!isNameValid || isSubmitting}
            className="h-10 rounded-lg px-5"
          >
            {isPending ? "Creating..." : isCreatingInvitations ? "Finishing..." : "Create workspace"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
