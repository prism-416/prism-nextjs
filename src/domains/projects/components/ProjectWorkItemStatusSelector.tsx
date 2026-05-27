"use client";

import { Check, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import type { ProjectWorkItemStatus } from "@/domains/projects/types";
import { getProjectWorkItemStatusLabel, PROJECT_WORK_ITEM_STATUSES } from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectWorkItemStatusSelectorProps = {
  id?: string;
  value: ProjectWorkItemStatus;
  disabled?: boolean;
  onChange: (status: ProjectWorkItemStatus) => void;
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
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-2 rounded-full", STATUS_DOT_CLASS_NAMES[status])} />
      <span>{getProjectWorkItemStatusLabel(status)}</span>
    </span>
  );
}

export function ProjectWorkItemStatusSelector({
  id,
  value,
  disabled = false,
  onChange,
}: ProjectWorkItemStatusSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border border-border bg-surface-field px-3",
            "text-sm text-prism-body transition-colors hover:border-border-strong",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <StatusLabel status={value} />
          <ChevronDown className="size-4 shrink-0 text-prism-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-40 p-1"
      >
        {PROJECT_WORK_ITEM_STATUSES.map(status => (
          <DropdownMenuItem
            key={status}
            className="justify-between rounded-lg px-3 py-2"
            onSelect={() => onChange(status)}
          >
            <StatusLabel status={status} />
            {status === value && <Check className="size-4 text-prism-muted" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
