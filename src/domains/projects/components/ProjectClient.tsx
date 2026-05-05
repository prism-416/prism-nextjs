"use client";

import { CalendarRange, Files, ListTodo, type LucideIcon } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";
import { ProjectErrorState } from "@/domains/projects/components/ProjectErrorState";
import { ProjectHero } from "@/domains/projects/components/ProjectHero";
import { ProjectMembersPanel } from "@/domains/projects/components/ProjectMembersPanel";
import { ProjectOverviewPanel } from "@/domains/projects/components/ProjectOverviewPanel";
import { ProjectSkeleton } from "@/domains/projects/components/ProjectSkeleton";
import { useProject } from "@/domains/projects/hooks/useProject";
import { useProjectMembers } from "@/domains/projects/hooks/useProjectMembers";
import type { Project, ProjectMemberListItem } from "@/domains/projects/types";

type ProjectClientProps = {
  slug: string;
  workspaceSlug?: string;
  initialData?: Project;
  initialMembers?: ProjectMemberListItem[];
};

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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ProjectOverviewPanel project={project} />
        <ProjectMembersPanel
          members={members}
          isPending={isMembersPending}
          isError={isMembersError}
          onRetry={() => {
            void refetchMembers();
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
