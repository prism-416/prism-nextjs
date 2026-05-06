"use client";

import { CalendarRange, Files, ListTodo, type LucideIcon } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";
import { ProjectErrorState } from "@/domains/projects/components/ProjectErrorState";
import { ProjectHero } from "@/domains/projects/components/ProjectHero";
import { ProjectMembersPanel } from "@/domains/projects/components/ProjectMembersPanel";
import { ProjectOverviewPanel } from "@/domains/projects/components/ProjectOverviewPanel";
import { ProjectSkeleton } from "@/domains/projects/components/ProjectSkeleton";
import { useProjectAssignableMembers } from "@/domains/projects/hooks/useProjectAssignableMembers";
import { useProject } from "@/domains/projects/hooks/useProject";
import { useProjectMembers } from "@/domains/projects/hooks/useProjectMembers";
import { useWorkspaceJobs } from "@/domains/projects/hooks/useWorkspaceJobs";
import type { Project, ProjectAssignableMember, ProjectJob, ProjectMemberListItem } from "@/domains/projects/types";

type ProjectClientProps = {
  slug: string;
  workspaceSlug?: string;
  initialData?: Project;
  initialMembers?: ProjectMemberListItem[];
};

const EMPTY_ASSIGNABLE_MEMBERS: ProjectAssignableMember[] = [];
const EMPTY_JOBS: ProjectJob[] = [];

type ProjectSectionPanelProps = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

function ProjectSectionPanel({ id, title, description, icon: Icon }: ProjectSectionPanelProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-border/80 bg-surface p-5"
    >
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-prism-muted" />
        <Typography
          variant="title"
          tone="primary"
        >
          {title}
        </Typography>
      </div>
      <Typography
        variant="bodySm"
        tone="muted"
        className="mt-4 italic"
      >
        {description}
      </Typography>
    </section>
  );
}

export function ProjectClient({ slug, workspaceSlug, initialData, initialMembers }: ProjectClientProps) {
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
  } = useWorkspaceJobs(project?.workspaceId);
  const {
    data: assignableMembers = EMPTY_ASSIGNABLE_MEMBERS,
    isPending: isAssignableMembersPending,
    isError: isAssignableMembersError,
    refetch: refetchAssignableMembers,
  } = useProjectAssignableMembers(project?.workspaceId);

  if (isProjectPending && !project) {
    return <ProjectSkeleton />;
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
      <ProjectHero
        project={project}
        workspaceSlug={workspaceSlug}
      />

      <div className="grid gap-4">
        <ProjectOverviewPanel project={project} />
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
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ProjectSectionPanel
          id="sprints"
          title="Sprints"
          description="No sprints yet."
          icon={CalendarRange}
        />
        <ProjectSectionPanel
          id="documents"
          title="Documents"
          description="No documents yet."
          icon={Files}
        />
        <ProjectSectionPanel
          id="my-tasks"
          title="My tasks"
          description="No tasks assigned."
          icon={ListTodo}
        />
      </div>
    </section>
  );
}
