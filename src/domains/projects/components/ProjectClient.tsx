"use client";

import { ProjectErrorState } from "@/domains/projects/components/ProjectErrorState";
import { ProjectHero } from "@/domains/projects/components/ProjectHero";
import { ProjectOverviewPanel } from "@/domains/projects/components/ProjectOverviewPanel";
import { ProjectSkeleton } from "@/domains/projects/components/ProjectSkeleton";
import { useProject } from "@/domains/projects/hooks/useProject";
import type { Project } from "@/domains/projects/types";

type ProjectClientProps = {
  slug: string;
  workspaceSlug?: string;
  initialData?: Project;
};

export function ProjectClient({ slug, workspaceSlug, initialData }: ProjectClientProps) {
  const {
    data: project,
    isPending: isProjectPending,
    isError: isProjectError,
    refetch: refetchProject,
  } = useProject(slug, initialData);

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

      <ProjectOverviewPanel project={project} />
    </section>
  );
}
