"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, FolderKanban, Grid3X3, List, MoreVertical, Plus, Search, Sparkles, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Typography } from "@/atomics/atoms/Typography";
import MainLayout from "@/atomics/templates/MainLayout";
import { cn } from "@/shared/utils/cn";

import { AppHeader } from "@/domains/workspace/components/AppHeader";
import { AppSidebar } from "@/domains/workspace/components/AppSidebar";
import { CreateWorkspaceDialog } from "@/domains/workspace/components/CreateWorkspaceDialog";
import { useWorkspaceList } from "@/domains/workspace/hooks/useWorkspaceList";
import type { Workspace } from "@/domains/workspace/types";

type WorkspaceContentProps = {
  initialData?: Workspace[];
};

type ViewMode = "grid" | "list";

const CARD_GRADIENTS = [
  "linear-gradient(135deg, rgba(120,196,212,0.22), rgba(157,123,255,0.16))",
  "linear-gradient(135deg, rgba(255,107,198,0.20), rgba(99,178,255,0.18))",
  "linear-gradient(135deg, rgba(255,241,168,0.26), rgba(98,215,199,0.18))",
  "linear-gradient(135deg, rgba(99,178,255,0.22), rgba(120,196,212,0.18))",
  "linear-gradient(135deg, rgba(157,123,255,0.22), rgba(255,107,198,0.14))",
  "linear-gradient(135deg, rgba(98,215,199,0.22), rgba(255,241,168,0.18))",
] as const;

function hashIndex(value: string, length: number) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

function workspaceInitials(name: string) {
  const segments = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (segments.length === 0) return "W";
  if (segments.length === 1) return segments[0].slice(0, 2).toUpperCase();
  return (segments[0][0] + segments[1][0]).toUpperCase();
}

function formatCount(value: number | undefined, singular: string, plural: string) {
  const safe = value ?? 0;
  return `${safe.toLocaleString()} ${safe === 1 ? singular : plural}`;
}

function formatRelativeDate(value: string) {
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return new Date(value).toLocaleDateString();
  }
}

function MetaItem({ icon: Icon, label }: { icon: typeof Users; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-prism-muted">
      <Icon className="size-3.5" />
      <Typography
        as="span"
        variant="caption"
        tone="inherit"
      >
        {label}
      </Typography>
    </span>
  );
}

function WorkspaceAvatar({ workspace, size = "md" }: { workspace: Workspace; size?: "sm" | "md" }) {
  const gradient = CARD_GRADIENTS[hashIndex(workspace.slug || workspace.name, CARD_GRADIENTS.length)];
  const initials = workspaceInitials(workspace.name);

  return (
    <span
      aria-hidden
      style={{ backgroundImage: gradient }}
      className={cn(
        "grid shrink-0 place-items-center rounded-xl border border-white/50 font-semibold text-prism-navy-deep shadow-[0_4px_14px_rgba(12,71,103,0.08)]",
        size === "md" ? "size-11 text-sm" : "size-9 text-xs",
      )}
    >
      {initials}
    </span>
  );
}

function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/80 bg-surface p-5",
        "shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_14px_40px_rgba(12,71,103,0.10)]",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundImage: CARD_GRADIENTS[hashIndex(workspace.slug || workspace.name, CARD_GRADIENTS.length)],
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <WorkspaceAvatar workspace={workspace} />
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
              className="mt-0.5 truncate font-mono text-xs"
            >
              /{workspace.slug}
            </Typography>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-prism-muted"
          aria-label={`${workspace.name} options`}
        >
          <MoreVertical className="size-4" />
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <MetaItem
          icon={Users}
          label={formatCount(workspace.memberCount, "member", "members")}
        />
        <MetaItem
          icon={FolderKanban}
          label={formatCount(workspace.projectCount, "project", "projects")}
        />
      </div>

      <Typography
        variant="bodySm"
        tone="muted"
        className={cn("relative mt-4 line-clamp-2 min-h-[2.5rem]", !workspace.description && "italic opacity-60")}
      >
        {workspace.description || "No description yet."}
      </Typography>

      <div className="relative mt-5 space-y-3 border-t border-border/60 pt-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-prism-teal-500/40" />
              <span className="relative inline-flex size-2 rounded-full bg-prism-teal-500" />
            </span>
            <Typography
              variant="caption"
              tone="muted"
            >
              Active
            </Typography>
          </div>
          <Typography
            variant="caption"
            tone="muted"
          >
            Created {formatRelativeDate(workspace.createdAt)}
          </Typography>
        </div>
      </div>
    </article>
  );
}

function WorkspaceRow({ workspace }: { workspace: Workspace }) {
  return (
    <article
      className={cn(
        "group flex items-center gap-4 rounded-xl border border-border/80 bg-surface px-4 py-3",
        "transition-colors hover:border-border-strong hover:bg-surface-strong",
      )}
    >
      <WorkspaceAvatar
        workspace={workspace}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <Typography
          variant="title"
          tone="primary"
          className="truncate text-base"
        >
          {workspace.name}
        </Typography>
        <Typography
          variant="bodySm"
          tone="muted"
          className="truncate"
        >
          {workspace.description || `/${workspace.slug}`}
        </Typography>
      </div>
      <div className="hidden shrink-0 items-center gap-3 md:flex">
        <MetaItem
          icon={Users}
          label={formatCount(workspace.memberCount, "member", "members")}
        />
        <MetaItem
          icon={FolderKanban}
          label={formatCount(workspace.projectCount, "project", "projects")}
        />
        <Typography
          variant="caption"
          tone="muted"
          className="ml-1"
        >
          {formatRelativeDate(workspace.createdAt)}
        </Typography>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-prism-muted"
        aria-label={`${workspace.name} options`}
      >
        <MoreVertical className="size-4" />
      </Button>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/70 bg-surface p-5">
      <div className="flex items-start gap-3">
        <div className="size-11 shrink-0 animate-pulse rounded-xl bg-prism-navy/5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-prism-navy/5" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-prism-navy/5" />
        </div>
      </div>
      <div className="mt-5 h-10 animate-pulse rounded bg-prism-navy/5" />
      <div className="mt-5 h-3 w-1/2 animate-pulse rounded bg-prism-navy/5" />
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-dashed border-border-strong/60 bg-surface px-8 py-16 text-center"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 0%, rgba(157,123,255,0.10), transparent 40%), radial-gradient(circle at 80% 100%, rgba(120,196,212,0.12), transparent 40%)",
      }}
    >
      <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-prism-navy text-primary-foreground shadow-[0_8px_24px_rgba(12,71,103,0.20)]">
        <Sparkles className="size-5" />
      </span>
      <Typography
        variant="h3"
        tone="primary"
      >
        No workspaces yet
      </Typography>
      <Typography
        variant="body"
        tone="muted"
        className="mx-auto mt-3 max-w-md"
      >
        Create your first workspace to start collaborating with your team.
      </Typography>
      <Button
        onClick={onCreate}
        className="mt-6 h-10 gap-1.5 rounded-lg px-5"
      >
        <Plus className="size-4" />
        Create workspace
      </Button>
    </div>
  );
}

export function WorkspaceContent({ initialData }: WorkspaceContentProps) {
  const { data, isFetching, isError, refetch } = useWorkspaceList({ initialData });
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const workspaces = useMemo(() => data ?? initialData ?? [], [data, initialData]);

  const showInitialSkeleton = isFetching && workspaces.length === 0;
  const showEmpty = !isFetching && !isError && workspaces.length === 0;

  return (
    <MainLayout
      header={<AppHeader workspace={{ name: "Workspace" }} />}
      sidebar={<AppSidebar />}
      contentClassName="bg-background"
    >
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <div className="relative min-w-[220px] flex-1 lg:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-prism-muted" />
                <Input
                  type="search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search workspaces"
                  className="h-10 rounded-lg border-border bg-surface-field pl-9 text-sm focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-10 gap-1.5 rounded-lg border-border bg-surface px-3 text-prism-body"
              >
                <ArrowUpDown className="size-3.5" />
                Sort
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-border bg-surface p-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  aria-pressed={viewMode === "grid"}
                  aria-label="Grid view"
                  className={cn(
                    "h-8 w-8 rounded-md text-prism-muted",
                    viewMode === "grid" && "bg-prism-navy/5 text-prism-body",
                  )}
                >
                  <Grid3X3 className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  aria-pressed={viewMode === "list"}
                  aria-label="List view"
                  className={cn(
                    "h-8 w-8 rounded-md text-prism-muted",
                    viewMode === "list" && "bg-prism-navy/5 text-prism-body",
                  )}
                >
                  <List className="size-4" />
                </Button>
              </div>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="h-10 gap-1.5 rounded-lg px-4"
              >
                <Plus className="size-4" />
                Create workspace
              </Button>
            </div>
          </div>

          {showInitialSkeleton && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
              <Typography
                variant="title"
                tone="inherit"
                className="text-red-700"
              >
                Failed to load workspaces
              </Typography>
              <Typography
                variant="bodySm"
                tone="inherit"
                className="max-w-sm text-red-600/90"
              >
                We couldn&apos;t reach the server. Please check your connection and try again.
              </Typography>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="h-9 rounded-lg border-red-300 bg-white px-4 text-red-700 hover:bg-red-100"
              >
                Retry
              </Button>
            </div>
          )}

          {showEmpty && <EmptyState onCreate={() => setIsCreateOpen(true)} />}

          {workspaces.length > 0 && viewMode === "grid" && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {workspaces.map(workspace => (
                <WorkspaceCard
                  key={workspace.workspaceId}
                  workspace={workspace}
                />
              ))}
            </div>
          )}

          {workspaces.length > 0 && viewMode === "list" && (
            <div className="flex flex-col gap-2">
              {workspaces.map(workspace => (
                <WorkspaceRow
                  key={workspace.workspaceId}
                  workspace={workspace}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CreateWorkspaceDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </MainLayout>
  );
}
