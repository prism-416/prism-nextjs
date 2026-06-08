"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { CreateProjectDialog } from "@/domains/projects/components/CreateProjectDialog";
import { ProjectCard } from "@/domains/projects/components/ProjectCard";
import { ProjectNoResults } from "@/domains/projects/components/ProjectNoResults";
import { ProjectRow } from "@/domains/projects/components/ProjectRow";
import { ProjectToolbar, ProjectToolbarActions } from "@/domains/projects/components/ProjectToolbar";
import { filterProjects } from "@/domains/projects/utils/display";

import { useProjects } from "../hooks/useProjects";
import type { ProjectSummary } from "../types";
import { ProjectsSkeleton } from "./ProjectsSkeleton";

type ProjectsClientProps = {
  slug: string;
  initialData?: ProjectSummary[];
  canCreateProject: boolean;
};

type ViewMode = "grid" | "list";

const EMPTY_PROJECTS: ProjectSummary[] = [];

export function ProjectsClient({ slug, initialData, canCreateProject }: ProjectsClientProps) {
  const {
    data,
    isPending: isProjectsPending,
    isError: isProjectsError,
    refetch: refetchProjects,
  } = useProjects(slug, initialData);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const projects = data ?? EMPTY_PROJECTS;
  const filteredProjects = useMemo(() => filterProjects(projects, query), [projects, query]);
  const hasCreatePermission = canCreateProject && Boolean(slug);
  const showNoResults = !isProjectsError && projects.length > 0 && filteredProjects.length === 0;

  const handleRetry = () => {
    void refetchProjects();
  };

  const handleCreate = () => {
    if (!hasCreatePermission) {
      return;
    }

    setIsCreateOpen(true);
  };

  if (isProjectsPending && projects.length === 0) {
    return <ProjectsSkeleton />;
  }

  return (
    <>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-prism-heading">Projects</h1>
            <p className="mt-1 text-sm text-prism-muted">
              {hasCreatePermission
                ? "Create and organize projects in this workspace."
                : "Browse projects in this workspace."}
            </p>
          </div>
          <ProjectToolbarActions
            canCreateProject={hasCreatePermission}
            viewMode={viewMode}
            onCreate={handleCreate}
            onViewModeChange={setViewMode}
          />
        </div>

        <ProjectToolbar
          query={query}
          onQueryChange={setQuery}
        />

        {isProjectsError && (
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
        )}

        {!isProjectsError && projects.length === 0 && (
          <div className="rounded-xl border border-dashed border-border-strong/60 bg-surface px-6 py-10 text-center">
            <h2 className="text-base font-semibold text-prism-heading">No projects yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-prism-muted">
              {hasCreatePermission
                ? "Create a project to start organizing work in this workspace."
                : "No projects are available in this workspace yet."}
            </p>
            {hasCreatePermission && (
              <Button
                onClick={handleCreate}
                className="mt-5 h-10 gap-1.5 rounded-lg px-5"
              >
                <Plus className="size-4" />
                Create project
              </Button>
            )}
          </div>
        )}

        {showNoResults && <ProjectNoResults />}

        {!isProjectsError && filteredProjects.length > 0 && viewMode === "grid" && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.projectId}
                project={project}
              />
            ))}
          </div>
        )}

        {!isProjectsError && filteredProjects.length > 0 && viewMode === "list" && (
          <div className="flex flex-col gap-2">
            {filteredProjects.map(project => (
              <ProjectRow
                key={project.projectId}
                project={project}
              />
            ))}
          </div>
        )}
      </section>

      {hasCreatePermission && (
        <CreateProjectDialog
          open={isCreateOpen}
          workspaceSlug={slug}
          onOpenChange={setIsCreateOpen}
        />
      )}
    </>
  );
}
