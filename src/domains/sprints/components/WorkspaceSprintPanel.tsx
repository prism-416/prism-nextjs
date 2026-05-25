import Link from "next/link";
import { ArrowLeft, CalendarRange, ListTodo, RefreshCw } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { SprintStatusBadge } from "@/domains/sprints/components/SprintStatusBadge";
import type { Sprint, SprintWorkItem, SprintWorkItemSearchResult } from "@/domains/sprints/types";
import {
  formatSprintRange,
  getSprintDurationText,
  getSprintWorkItemPriorityLabel,
  getSprintWorkItemStatusLabel,
} from "@/domains/sprints/utils/sprint";

type WorkspaceSprintPanelProps = {
  workspaceSlug: string;
  sprint: Sprint;
  workItems: SprintWorkItemSearchResult;
  projectSlugsById: Record<string, string>;
  isWorkItemsError: boolean;
  onRetryWorkItems: () => void;
};

function SprintMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/80 bg-surface-strong px-4 py-3">
      <p className="text-xs text-prism-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-prism-heading">{value}</p>
    </div>
  );
}

function WorkItemRow({ item, projectSlug }: { item: SprintWorkItem; projectSlug?: string }) {
  const content = (
    <Typography
      variant="bodySm"
      tone="primary"
      weight="semibold"
      className="truncate"
    >
      {item.title}
    </Typography>
  );

  return (
    <article className="grid gap-3 border-b border-border/70 px-4 py-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_8rem_8rem] md:items-center">
      <div className="min-w-0">
        {projectSlug ? (
          <Link href={`/projects/${encodeURIComponent(projectSlug)}/work-items/${encodeURIComponent(item.itemId)}`}>
            {content}
          </Link>
        ) : (
          content
        )}
        <p className="mt-1 line-clamp-2 text-xs text-prism-muted">{item.description || "No description."}</p>
      </div>
      <span className="text-sm text-prism-body">{getSprintWorkItemStatusLabel(item.status)}</span>
      <span className="text-sm text-prism-body">{getSprintWorkItemPriorityLabel(item.priority)}</span>
    </article>
  );
}

export function WorkspaceSprintPanel({
  workspaceSlug,
  sprint,
  workItems,
  projectSlugsById,
  isWorkItemsError,
  onRetryWorkItems,
}: WorkspaceSprintPanelProps) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="rounded-2xl border border-border/80 bg-surface p-5">
        <Button
          asChild
          variant="ghost"
          className="h-8 w-fit rounded-lg px-2"
        >
          <Link href={`/workspaces/${encodeURIComponent(workspaceSlug)}/sprints`}>
            <ArrowLeft className="size-4" />
            Back to sprints
          </Link>
        </Button>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <CalendarRange className="size-5 text-prism-muted" />
              <SprintStatusBadge status={sprint.status} />
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-prism-heading">{sprint.name}</h1>
            <p className="mt-2 text-sm text-prism-muted">{sprint.goal || "No goal."}</p>
          </div>
          <span className="text-sm text-prism-muted">{workItems.total} work items</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <SprintMetric
            label="Range"
            value={formatSprintRange(sprint)}
          />
          <SprintMetric
            label="Duration"
            value={getSprintDurationText(sprint)}
          />
          <SprintMetric
            label="Status"
            value={sprint.status}
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface">
        <div className="flex items-center gap-2 border-b border-border/70 bg-surface-strong px-4 py-3">
          <ListTodo className="size-4 text-prism-muted" />
          <span className="text-sm font-semibold text-prism-heading">Sprint work items</span>
        </div>
        {isWorkItemsError && (
          <div className="p-5 text-sm text-prism-danger">
            <p>Sprint work items could not be loaded.</p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={onRetryWorkItems}
            >
              <RefreshCw className="size-4" />
              Retry
            </Button>
          </div>
        )}
        {!isWorkItemsError && workItems.items.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-prism-muted">No work items in this sprint.</p>
        )}
        {!isWorkItemsError &&
          workItems.items.map(item => (
            <WorkItemRow
              key={item.itemId}
              item={item}
              projectSlug={projectSlugsById[item.projectId]}
            />
          ))}
      </div>
    </section>
  );
}
