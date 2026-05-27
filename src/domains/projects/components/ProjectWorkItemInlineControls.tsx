"use client";

import { Check, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import { getProjectWorkItemPriorityBadgeClassName } from "@/domains/projects/components/ProjectWorkItemPriorityBadge";
import type { ProjectWorkItem, ProjectWorkItemPriority, ProjectWorkItemStatus } from "@/domains/projects/types";
import {
  getProjectWorkItemPriorityLabel,
  getProjectWorkItemStatusLabel,
  PROJECT_WORK_ITEM_PRIORITIES,
  PROJECT_WORK_ITEM_STATUSES,
} from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectWorkItemInlineControlsProps = {
  item: ProjectWorkItem;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
};

const STATUS_DOT_CLASS_NAMES: Record<ProjectWorkItemStatus, string> = {
  todo: "bg-prism-muted/55",
  in_progress: "bg-prism-info",
  in_review: "bg-prism-review",
  done: "bg-prism-success",
  archived: "bg-prism-muted/55",
};

const STATUS_TRIGGER_CLASS_NAME = cn(
  "inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 text-xs font-medium text-prism-body",
  "transition-colors hover:border-border-strong hover:bg-surface-strong",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "disabled:cursor-not-allowed disabled:opacity-60",
);

const PRIORITY_TRIGGER_CLASS_NAME =
  "gap-1.5 cursor-pointer transition-shadow hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

function StatusContent({ status }: { status: ProjectWorkItemStatus }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-2 rounded-full", STATUS_DOT_CLASS_NAMES[status])} />
      <span>{getProjectWorkItemStatusLabel(status)}</span>
    </span>
  );
}

export function ProjectWorkItemInlineControls({
  item,
  onStatusUpdate,
  onPriorityUpdate,
}: ProjectWorkItemInlineControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={STATUS_TRIGGER_CLASS_NAME}
            aria-label={`Change ${item.title} status`}
          >
            <StatusContent status={item.status} />
            <ChevronDown className="size-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-40 py-1"
        >
          {PROJECT_WORK_ITEM_STATUSES.map(status => (
            <DropdownMenuItem
              key={status}
              className="justify-between gap-4"
              onSelect={() => {
                if (status !== item.status) onStatusUpdate(item, status);
              }}
            >
              <StatusContent status={status} />
              {status === item.status && <Check className="size-4 text-prism-muted" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={getProjectWorkItemPriorityBadgeClassName(item.priority, PRIORITY_TRIGGER_CLASS_NAME)}
            aria-label={`Change ${item.title} priority`}
          >
            {getProjectWorkItemPriorityLabel(item.priority)}
            <ChevronDown className="size-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-32 py-1"
        >
          {PROJECT_WORK_ITEM_PRIORITIES.map(priority => (
            <DropdownMenuItem
              key={priority}
              className="justify-between gap-4"
              onSelect={() => {
                if (priority !== item.priority) onPriorityUpdate(item, priority);
              }}
            >
              <span className={getProjectWorkItemPriorityBadgeClassName(priority)}>
                {getProjectWorkItemPriorityLabel(priority)}
              </span>
              {priority === item.priority && <Check className="size-4 text-prism-muted" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
