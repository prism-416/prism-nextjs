"use client";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import type { Workspace } from "@/domains/workspace/types";
import { useWorkspaceList } from "@/domains/workspace/hooks/useWorkspaceList";

type WorkspaceContentProps = {
  initialData?: Workspace[];
};

function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  return (
    <div className="rounded-2xl border border-prism-sand/70 bg-white/80 p-6 shadow-(--shadow-soft-navy-card) transition-shadow hover:shadow-lg">
      <Typography
        variant="title"
        tone="primary"
      >
        {workspace.name}
      </Typography>
      {workspace.description && (
        <Typography
          variant="bodySm"
          tone="muted"
          className="mt-2"
        >
          {workspace.description}
        </Typography>
      )}
      <Typography
        variant="caption"
        tone="muted"
        className="mt-4"
      >
        Created {new Date(workspace.createdAt).toLocaleDateString()}
      </Typography>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-prism-sand/70 bg-white/80 px-8 py-16 text-center shadow-(--shadow-soft-navy-card)">
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
    <main className="min-h-screen bg-(image:--gradient-auth-main) px-6 py-10 text-primary lg:px-8 lg:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="flex items-center justify-between rounded-[2rem] border border-prism-sand/70 bg-(image:--gradient-panel-surface) p-8 shadow-(--shadow-auth-panel)">
          <div>
            <Typography
              variant="overline"
              tone="inherit"
              className="text-prism-body/50"
            >
              Workspace
            </Typography>
            <Typography
              variant="h2"
              tone="primary"
              className="mt-2"
            >
              Your Workspaces
            </Typography>
          </div>
          <Button size="lg">Create Workspace</Button>
        </section>

        {isFetching && workspaces.length === 0 && (
          <Typography
            variant="body"
            tone="muted"
            className="text-center"
          >
            Loading workspaces...
          </Typography>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
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
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map(workspace => (
              <WorkspaceCard
                key={workspace.workspaceId}
                workspace={workspace}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
