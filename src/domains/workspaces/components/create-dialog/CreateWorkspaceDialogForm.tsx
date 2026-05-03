"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/atomics/atoms/Button";
import { DialogFooter } from "@/atomics/molecules/Dialog";
import { createInvitation } from "@/domains/workspaces/api";
import { CreateWorkspaceDetailsSection } from "@/domains/workspaces/components/create-dialog/CreateWorkspaceDetailsSection";
import { CreateWorkspaceDialogHero } from "@/domains/workspaces/components/create-dialog/CreateWorkspaceDialogHero";
import { CreateWorkspaceInviteSection } from "@/domains/workspaces/components/create-dialog/CreateWorkspaceInviteSection";
import { useCreateWorkspace } from "@/domains/workspaces/hooks/useCreateWorkspace";
import { useInviteMemberSelection } from "@/domains/workspaces/hooks/useInviteMemberSelection";
import { useWorkspaceMemberCandidateSearch } from "@/domains/workspaces/hooks/useWorkspaceMemberCandidateSearch";
import type { Workspace } from "@/domains/workspaces/types";
import { getWorkspaceMutationErrorMessage } from "@/domains/workspaces/utils/error";
import { isExistingInvite } from "@/domains/workspaces/utils/invite-member";

type CreateWorkspaceDialogFormProps = {
  onOpenChange: (open: boolean) => void;
  onCreated?: (workspace: Workspace) => void;
};

const NAME_MAX = 20;
const DESCRIPTION_MAX = 1000;

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
    clearSearchState,
    onMemberQueryChange: handleSearchMemberQueryChange,
    searchCandidates,
  });
  const { mutateAsync, isPending } = useCreateWorkspace();

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

      const failedInvites: string[] = [];

      if (selectedInvites.length > 0) {
        setIsCreatingInvitations(true);

        const results = await Promise.allSettled(
          selectedInvites.map(invite => {
            const payload = isExistingInvite(invite)
              ? { receiverId: invite.userId, role: invite.role }
              : { email: invite.email, role: invite.role };

            return createInvitation(workspace.workspaceId, payload);
          }),
        );

        results.forEach((result, index) => {
          if (result.status === "rejected") {
            failedInvites.push(selectedInvites[index]?.email ?? "Unknown invite");
          }
        });
        setIsCreatingInvitations(false);
      }

      const postCreateMessages: string[] = [];

      if (failedInvites.length > 0) {
        postCreateMessages.push(`${failedInvites.length} ${pluralize(failedInvites.length, "invite")} failed to send.`);
      }

      if (postCreateMessages.length > 0) {
        window.alert(postCreateMessages.join("\n"));
      }

      onCreated?.(workspace);
      onOpenChange(false);
    } catch (error) {
      setIsCreatingInvitations(false);
      setFieldError(getWorkspaceMutationErrorMessage(error, "Something went wrong. Please try again."));
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
          onMemberQueryChange={handleMemberQueryChange}
          onInviteRoleChange={setInviteRole}
          onAddInvite={() => handleSelectionAddInvite(trimmedMemberQuery)}
          onAddCandidate={handleAddCandidate}
          onRemoveInvite={handleRemoveInvite}
          shouldShowCandidateResults={shouldShowCandidateResults && !inviteFieldError}
        />

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
