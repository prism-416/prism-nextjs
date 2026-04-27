"use client";

import { type FormEvent, useMemo, useState } from "react";

import { Button } from "@/atomics/atoms/Button";
import { DialogFooter } from "@/atomics/atoms/Dialog";
import { Typography } from "@/atomics/atoms/Typography";
import { upsertProjectMembers } from "@/domains/projects/api";
import { CreateProjectDetailsSection } from "@/domains/projects/components/create-dialog/CreateProjectDetailsSection";
import { CreateProjectDialogHero } from "@/domains/projects/components/create-dialog/CreateProjectDialogHero";
import { CreateProjectMembersSection } from "@/domains/projects/components/create-dialog/CreateProjectMembersSection";
import { useCreateProject } from "@/domains/projects/hooks/useCreateProject";
import { useProjectAssignableMembers } from "@/domains/projects/hooks/useProjectAssignableMembers";
import { useWorkspaceJobs } from "@/domains/projects/hooks/useWorkspaceJobs";
import type {
  CreateProjectMemberSelection,
  Project,
  ProjectAssignableMember,
  ProjectJob,
} from "@/domains/projects/types";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";

type CreateProjectDialogFormProps = {
  workspaceId?: string;
  workspaceSlug: string;
  onOpenChange: (open: boolean) => void;
  onCreated?: (project: Project) => void;
};

const NAME_MAX = 20;
const DESCRIPTION_MAX = 1000;
const MEMBER_RESULT_LIMIT = 12;
const EMPTY_JOBS: ProjectJob[] = [];
const EMPTY_MEMBERS: ProjectAssignableMember[] = [];

function getMemberSearchText(member: ProjectAssignableMember) {
  return `${member.fullName} ${member.username}`.toLowerCase();
}

export function CreateProjectDialogForm({
  workspaceId,
  workspaceSlug,
  onOpenChange,
  onCreated,
}: CreateProjectDialogFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [memberQuery, setMemberQuery] = useState("");
  const [memberError, setMemberError] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<CreateProjectMemberSelection[]>([]);
  const [isAssigningMembers, setIsAssigningMembers] = useState(false);

  const { data: jobsData, isPending: isJobsPending } = useWorkspaceJobs(workspaceId);
  const { data: membersData, isPending: isMembersPending } = useProjectAssignableMembers(workspaceId);
  const { data: currentUser, isPending: isCurrentUserPending } = useCurrentUser();
  const { mutateAsync, isPending: isCreatingProject, error } = useCreateProject({ workspaceSlug });

  const jobs = jobsData ?? EMPTY_JOBS;
  const members = membersData ?? EMPTY_MEMBERS;
  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  const trimmedMemberQuery = memberQuery.trim();
  const isNameValid = trimmedName.length >= 1;
  const isSubmitting = isCreatingProject || isAssigningMembers;
  const selectedMemberIds = useMemo(() => new Set(selectedMembers.map(member => member.userId)), [selectedMembers]);
  const availableMembers = useMemo(() => {
    const normalizedQuery = trimmedMemberQuery.toLowerCase();

    return members
      .filter(member => !selectedMemberIds.has(member.userId))
      .filter(member => member.userId !== currentUser?.userId)
      .filter(member => (normalizedQuery ? getMemberSearchText(member).includes(normalizedQuery) : true))
      .slice(0, MEMBER_RESULT_LIMIT);
  }, [currentUser?.userId, members, selectedMemberIds, trimmedMemberQuery]);

  function handleAddMember(member: ProjectAssignableMember) {
    if (selectedMemberIds.has(member.userId)) {
      setMemberError("This member is already assigned.");
      return;
    }

    setSelectedMembers(previous => [...previous, { ...member, jobIds: [] }]);
    setMemberQuery("");
    setMemberError(null);
  }

  function handleRemoveMember(userId: string) {
    setSelectedMembers(previous => previous.filter(member => member.userId !== userId));
    setMemberError(null);
  }

  function handleToggleMemberJob(userId: string, jobId: string, checked: boolean) {
    setSelectedMembers(previous =>
      previous.map(member => {
        if (member.userId !== userId) {
          return member;
        }

        const jobIds = checked
          ? Array.from(new Set([...member.jobIds, jobId]))
          : member.jobIds.filter(id => id !== jobId);
        return { ...member, jobIds };
      }),
    );
    setMemberError(null);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isNameValid) {
      setFieldError("Project name is required.");
      return;
    }

    if (selectedMembers.length > 0 && !workspaceId) {
      setMemberError("Workspace details could not be resolved. Refresh the page and try again.");
      return;
    }

    if (selectedMembers.length > 0 && jobs.length === 0) {
      setMemberError("Jobs are not available for this workspace yet.");
      return;
    }

    if (selectedMembers.some(member => member.jobIds.length === 0)) {
      setMemberError("Select at least one job for each assigned member.");
      return;
    }

    setFieldError(null);
    setMemberError(null);

    try {
      const project = await mutateAsync({
        workspaceSlug,
        name: trimmedName,
        description: trimmedDescription || undefined,
      });

      if (selectedMembers.length > 0) {
        setIsAssigningMembers(true);

        try {
          await upsertProjectMembers(project.projectId, {
            members: selectedMembers.map(member => ({
              userId: member.userId,
              jobIds: member.jobIds,
            })),
          });
        } catch {
          window.alert("Project was created, but members could not be assigned. Please update project members later.");
        } finally {
          setIsAssigningMembers(false);
        }
      }

      onCreated?.(project);
      onOpenChange(false);
    } catch {
      setIsAssigningMembers(false);
    }
  };

  return (
    <>
      <CreateProjectDialogHero />

      <form
        onSubmit={handleSubmit}
        className="max-h-[calc(100vh-12rem)] space-y-5 overflow-y-auto px-6 pb-6 pt-5"
        noValidate
      >
        <CreateProjectDetailsSection
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

        <CreateProjectMembersSection
          memberQuery={memberQuery}
          availableMembers={availableMembers}
          selectedMembers={selectedMembers}
          jobs={jobs}
          errorMessage={memberError}
          isLoadingMembers={isMembersPending || isCurrentUserPending}
          isLoadingJobs={isJobsPending}
          isSubmitting={isSubmitting}
          showMemberResults
          onMemberQueryChange={value => {
            setMemberQuery(value);
            if (memberError) {
              setMemberError(null);
            }
          }}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onToggleMemberJob={handleToggleMemberJob}
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
            {isCreatingProject ? "Creating..." : isAssigningMembers ? "Assigning members..." : "Create project"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
