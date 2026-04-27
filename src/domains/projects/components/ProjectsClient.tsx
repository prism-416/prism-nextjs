"use client";

import { Button } from "@/atomics/atoms/Button";

import { ProjectSummary } from "../types";
import { useProjects } from "../hooks/useProjects";
import { ProjectsSkeleton } from "./ProjectsSkeleton";

type ProjectsClientProps = {
  slug: string;
  initialData?: ProjectSummary[];
};

export function ProjectsClient({ slug, initialData }: ProjectsClientProps) {
  const {
    data,
    isPending: isProjectsPending,
    isError: isProjectsError,
    refetch: refetchProjects,
  } = useProjects(slug, initialData);

  const projects = data ?? [];

  const handleRetry = () => {
    void refetchProjects();
  };

  if (isProjectsPending && projects.length === 0) {
    return <ProjectsSkeleton />;
  }

  if (isProjectsError) {
    return (
      <div className="rounded-xl border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
        <p>Projects could not be loaded.</p>
        <Button
          className="mt-3 h-9 rounded-lg border-prism-danger-soft bg-surface px-4 text-prism-danger hover:bg-prism-danger-soft/40"
          onClick={handleRetry}
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border-strong/60 bg-surface px-6 py-10 text-center">
        <h2 className="text-base font-semibold text-prism-heading">No projects yet</h2>
        <p className="mt-2 text-sm text-prism-muted">Create a project to start organizing work in this workspace.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map(project => (
        <article
          className="rounded-xl border border-border/80 bg-surface p-5"
          key={project.projectId}
        >
          <h2 className="text-base font-semibold text-prism-heading">{project.name}</h2>
          {project.description && <p className="mt-2 text-sm text-prism-muted">{project.description}</p>}
        </article>
      ))}
    </div>
  );
}
