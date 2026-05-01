"use client";

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
  initialData?: Project;
  initialMembers?: ProjectMemberListItem[];
};

export function ProjectClient({ slug, initialData, initialMembers }: ProjectClientProps) {
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
      <ProjectHero project={project} />

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
    </section>
  );
}
