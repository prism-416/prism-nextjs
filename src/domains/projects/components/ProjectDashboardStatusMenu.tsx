"use client";

import { Check, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import type { ProjectWorkItem, ProjectWorkItemStatus } from "@/domains/projects/types";
import { getProjectWorkItemStatusLabel, PROJECT_WORK_ITEM_STATUSES } from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectDashboardStatusMenuProps = {
  item: ProjectWorkItem;
  disabled: boolean;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
};

const STATUS_DOT_CLASS_NAMES: Record<ProjectWorkItemStatus, string> = {
  todo: "bg-prism-muted/55",
  in_progress: "bg-prism-info",
  in_review: "bg-prism-review",
  done: "bg-prism-success",
  archived: "bg-prism-muted/55",
};

function StatusLabel({ status }: { status: ProjectWorkItemStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn("size-2 shrink-0 rounded-full", STATUS_DOT_CLASS_NAMES[status])}
        aria-hidden="true"
      />
      <span>{getProjectWorkItemStatusLabel(status)}</span>
    </span>
  );
}

export function ProjectDashboardStatusMenu({ item, disabled, onStatusUpdate }: ProjectDashboardStatusMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface-strong px-2.5 text-xs font-medium text-prism-body",
            "cursor-pointer transition-shadow hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
          onPointerDown={event => event.stopPropagation()}
          aria-label={`Change ${item.title} status`}
        >
          <StatusLabel status={item.status} />
          <ChevronDown className="size-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-36 py-1"
        onPointerDown={event => event.stopPropagation()}
        onClick={event => event.stopPropagation()}
      >
        {PROJECT_WORK_ITEM_STATUSES.map(status => (
          <DropdownMenuItem
            key={status}
            className="justify-between gap-2 px-2 py-1.5 text-sm"
            onSelect={() => {
              if (status !== item.status) onStatusUpdate(item, status);
            }}
          >
            <StatusLabel status={status} />
            {status === item.status && <Check className="size-4 text-prism-muted" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
