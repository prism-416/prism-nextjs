"use client";

import { Grid3X3, List, MoreVertical, Plus, Search } from "lucide-react";

import MainLayout from "@/atomics/templates/MainLayout";
import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Typography } from "@/atomics/atoms/Typography";
import type { Workspace } from "@/domains/workspace/types";
import { useWorkspaceList } from "@/domains/workspace/hooks/useWorkspaceList";
import { AppHeader } from "@/domains/workspace/components/AppHeader";
import { AppSidebar } from "@/domains/workspace/components/AppSidebar";

type WorkspaceContentProps = {
  initialData?: Workspace[];
};

function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  return (
    <article className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-prism-sand">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Typography
            variant="title"
            tone="primary"
            className="truncate"
          >
            {workspace.name}
          </Typography>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-1 truncate"
          >
            {workspace.slug}
          </Typography>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          aria-label={`${workspace.name} options`}
        >
          <MoreVertical className="size-4" />
        </Button>
      </div>

      {workspace.description && (
        <Typography
          variant="bodySm"
          tone="muted"
          className="mt-3 line-clamp-2"
        >
          {workspace.description}
        </Typography>
      )}

      <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-border/80 bg-background px-2.5 py-1.5">
        <span className="size-2 rounded-full bg-prism-mint" />
        <Typography
          variant="caption"
          tone="muted"
        >
          Active since {new Date(workspace.createdAt).toLocaleDateString()}
        </Typography>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface px-8 py-16 text-center">
      <Typography
        variant="h3"
        tone="primary"
      >
        No workspaces yet
      </Typography>
      <Typography
        variant="body"
        tone="muted"
        className="mt-3 max-w-md mx-auto"
      >
        Create your first workspace to start collaborating with your team.
      </Typography>
    </div>
  );
}

export function WorkspaceContent({ initialData }: WorkspaceContentProps) {
  const { data, isFetching, isError } = useWorkspaceList({ initialData });

  const workspaces = data ?? initialData ?? [];

  return (
    <MainLayout
      header={
        <AppHeader
          workspace={{ name: "Workspace" }}
          actions={
            <Button
              size="sm"
              className="h-9 px-3"
            >
              Create Workspace
            </Button>
          }
        />
      }
      sidebar={<AppSidebar />}
      contentClassName="bg-background"
    >
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="space-y-4">
          <Typography
            variant="h3"
            tone="primary"
          >
            Projects
          </Typography>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <div className="relative min-w-[220px] flex-1 lg:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-prism-muted" />
                <Input
                  type="search"
                  placeholder="Search for a project"
                  className="h-9 rounded-md border-border bg-surface-field pl-9 text-sm"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-border bg-surface px-3 text-prism-body"
              >
                Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-border bg-surface px-3 text-prism-body"
              >
                Sort by name
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 border border-border/80"
                aria-label="Grid view"
              >
                <Grid3X3 className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 border border-border/80"
                aria-label="List view"
              >
                <List className="size-4" />
              </Button>
              <Button
                size="sm"
                className="h-9 gap-1.5 bg-prism-mint text-prism-navy hover:bg-prism-mint/90"
              >
                <Plus className="size-4" />
                New project
              </Button>
            </div>
          </div>
        </div>

        {isFetching && workspaces.length === 0 && (
          <Typography
            variant="body"
            tone="muted"
            className="rounded-xl border border-border bg-surface p-5 text-center"
          >
            Loading workspaces...
          </Typography>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
            <Typography
              variant="body"
              tone="inherit"
              className="text-red-600"
            >
              Failed to load workspaces. Please try again later.
            </Typography>
          </div>
        )}

        {!isFetching && !isError && workspaces.length === 0 && <EmptyState />}

        {workspaces.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workspaces.map(workspace => (
              <WorkspaceCard
                key={workspace.workspaceId}
                workspace={workspace}
              />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}
