"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarRange, ListTodo, MoreHorizontal, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import { ManageSprintWorkItemsDialog } from "@/domains/sprints/components/ManageSprintWorkItemsDialog";
import { WorkspaceSprintDeleteDialog } from "@/domains/sprints/components/WorkspaceSprintDeleteDialog";
import { WorkspaceSprintEditDialog } from "@/domains/sprints/components/WorkspaceSprintEditDialog";
import { SprintStatusBadge } from "@/domains/sprints/components/SprintStatusBadge";
import type { Sprint, SprintWorkItem, SprintWorkItemSearchResult } from "@/domains/sprints/types";
import { ProjectWorkItemPriorityBadge } from "@/domains/projects/components/ProjectWorkItemPriorityBadge";
import type { ProjectWorkItemPriority, ProjectWorkItemStatus } from "@/domains/projects/types";
import { formatSprintRange, formatSprintScheduleSummary, getSprintDurationText } from "@/domains/sprints/utils/sprint";
import { cn } from "@/shared/utils/cn";

type WorkspaceSprintPanelProps = {
  workspaceSlug: string;
  sprint: Sprint;
  workItems: SprintWorkItemSearchResult;
  projectSlugsById: Record<string, string>;
  projectNamesById: Record<string, string>;
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

const STATUS_DOT_CLASS_NAMES: Record<ProjectWorkItemStatus, string> = {
  todo: "bg-prism-muted/55",
  in_progress: "bg-prism-info",
  in_review: "bg-prism-review",
  done: "bg-prism-success",
  archived: "bg-prism-muted/55",
};

function StatusPill({ status }: { status: ProjectWorkItemStatus }) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 text-xs font-medium text-prism-body">
      <span className={cn("size-2 rounded-full", STATUS_DOT_CLASS_NAMES[status])} />
      {status === "todo"
        ? "Todo"
        : status === "in_progress"
          ? "In progress"
          : status === "in_review"
            ? "In review"
            : status === "done"
              ? "Done"
              : "Archived"}
    </span>
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
    <article className="grid gap-3 border-b border-border/70 px-4 py-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_auto_auto_8rem] md:items-center">
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
      <StatusPill status={item.status as ProjectWorkItemStatus} />
      <ProjectWorkItemPriorityBadge priority={item.priority as ProjectWorkItemPriority} />
      <span className="text-sm text-prism-muted">
        {formatSprintScheduleSummary(item.startDate, item.dueDate) ?? "No schedule"}
      </span>
    </article>
  );
}

export function WorkspaceSprintPanel({
  workspaceSlug,
  sprint,
  workItems,
  projectSlugsById,
  projectNamesById,
  isWorkItemsError,
  onRetryWorkItems,
}: WorkspaceSprintPanelProps) {
  const router = useRouter();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 rounded-lg p-0"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40"
            >
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Pencil className="size-3.5" />
                Edit sprint
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className="text-prism-danger focus:text-prism-danger"
              >
                <Trash2 className="size-3.5" />
                Delete sprint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        <div className="flex items-center justify-between border-b border-border/70 bg-surface-strong px-4 py-3">
          <div className="flex items-center gap-2">
            <ListTodo className="size-4 text-prism-muted" />
            <span className="text-sm font-semibold text-prism-heading">Sprint work items ({workItems.total})</span>
          </div>
          <Button
            variant="default"
            className="h-7 gap-1.5 rounded-lg px-2.5 text-xs"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="size-3.5" />
            Edit items
          </Button>
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
          workItems.items.length > 0 &&
          (() => {
            const groups = workItems.items.reduce<Record<string, typeof workItems.items>>((acc, item) => {
              (acc[item.projectId] ??= []).push(item);
              return acc;
            }, {});

            const projectIds = Object.keys(groups);

            return (
              <div className="flex flex-col gap-3 p-3">
                {projectIds.map(projectId => (
                  <div
                    key={projectId}
                    className="overflow-hidden rounded-xl border border-border/80 bg-surface"
                  >
                    <div className="flex items-center gap-2.5 border-b border-border/60 px-4 py-2.5">
                      <span className="rounded-md bg-prism-navy px-2 py-0.5 text-xs font-semibold text-white">
                        {projectNamesById[projectId] ?? "Unknown project"}
                      </span>
                    </div>
                    {groups[projectId].map(item => (
                      <WorkItemRow
                        key={item.itemId}
                        item={item}
                        projectSlug={projectSlugsById[projectId]}
                      />
                    ))}
                  </div>
                ))}
              </div>
            );
          })()}
      </div>
      <ManageSprintWorkItemsDialog
        open={addDialogOpen}
        workspaceId={sprint.workspaceId}
        workspaceSlug={workspaceSlug}
        sprintId={sprint.sprintId}
        onOpenChange={setAddDialogOpen}
      />
      <WorkspaceSprintEditDialog
        sprint={sprint}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <WorkspaceSprintDeleteDialog
        sprint={sprint}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleted={() => router.push(`/workspaces/${encodeURIComponent(workspaceSlug)}/sprints`)}
      />
    </section>
  );
}
