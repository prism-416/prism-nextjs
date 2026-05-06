"use client";

import { ProjectErrorState } from "@/domains/projects/components/ProjectErrorState";
import { ProjectMembersPanel } from "@/domains/projects/components/ProjectMembersPanel";
import { ProjectMembersSkeleton } from "@/domains/projects/components/ProjectMembersSkeleton";
import { useProjectAssignableMembers } from "@/domains/projects/hooks/useProjectAssignableMembers";
import { useProject } from "@/domains/projects/hooks/useProject";
import { useProjectMembers } from "@/domains/projects/hooks/useProjectMembers";
import { useWorkspaceJobs } from "@/domains/projects/hooks/useWorkspaceJobs";
import type { Project, ProjectAssignableMember, ProjectJob, ProjectMemberListItem } from "@/domains/projects/types";

type ProjectMembersClientProps = {
  slug: string;
  workspaceSlug?: string;
  initialData?: Project;
  initialMembers?: ProjectMemberListItem[];
  initialJobs?: ProjectJob[];
  initialAssignableMembers?: ProjectAssignableMember[];
  canManageMembers: boolean;
};

const EMPTY_ASSIGNABLE_MEMBERS: ProjectAssignableMember[] = [];
const EMPTY_JOBS: ProjectJob[] = [];

export function ProjectMembersClient({
  slug,
  workspaceSlug,
  initialData,
  initialMembers,
  initialJobs,
  initialAssignableMembers,
  canManageMembers,
}: ProjectMembersClientProps) {
  const {
    data: project,
    isPending: isProjectPending,
    isError: isProjectError,
    refetch: refetchProject,
  } = useProject(slug, initialData);
  const {
    data: members = [],
    isPending: isMembersPending,
    isError: isMembersError,
    refetch: refetchMembers,
  } = useProjectMembers(project?.projectId, initialMembers);
  const {
    data: jobs = EMPTY_JOBS,
    isPending: isJobsPending,
    isError: isJobsError,
    refetch: refetchJobs,
  } = useWorkspaceJobs(canManageMembers ? project?.workspaceId : undefined, canManageMembers ? initialJobs : undefined);
  const {
    data: assignableMembers = EMPTY_ASSIGNABLE_MEMBERS,
    isPending: isAssignableMembersPending,
    isError: isAssignableMembersError,
    refetch: refetchAssignableMembers,
  } = useProjectAssignableMembers(
    canManageMembers ? project?.workspaceId : undefined,
    canManageMembers ? initialAssignableMembers : undefined,
  );

  if (isProjectPending && !project) {
    return <ProjectMembersSkeleton />;
  }

  if (isProjectError || !project) {
    return (
      <ProjectErrorState
        onRetry={() => {
          void refetchProject();
        }}
      />
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <ProjectMembersPanel
        projectId={project.projectId}
        workspaceSlug={workspaceSlug}
        members={members}
        assignableMembers={assignableMembers}
        jobs={jobs}
        isPending={isMembersPending}
        isError={isMembersError}
        isAssignableMembersPending={isAssignableMembersPending}
        isAssignableMembersError={isAssignableMembersError}
        isJobsPending={isJobsPending}
        isJobsError={isJobsError}
        canManageMembers={canManageMembers}
        onRetry={() => {
          void refetchMembers();
        }}
        onRetryAssignableMembers={() => {
          void refetchAssignableMembers();
        }}
        onRetryJobs={() => {
          void refetchJobs();
        }}
      />
    </section>
  );
}
