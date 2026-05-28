"use client";

import { Check, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import { getProjectWorkItemPriorityBadgeClassName } from "@/domains/projects/components/ProjectWorkItemPriorityBadge";
import type { ProjectWorkItemPriority } from "@/domains/projects/types";
import {
  getProjectWorkItemPriorityLabel,
  PROJECT_WORK_ITEM_PRIORITIES,
} from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectWorkItemPrioritySelectorProps = {
  id?: string;
  value: ProjectWorkItemPriority;
  disabled?: boolean;
  onChange: (priority: ProjectWorkItemPriority) => void;
};

const COMPACT_OPTION_CLASS_NAME = "h-6 px-2";

function PriorityLabel({ priority }: { priority: ProjectWorkItemPriority }) {
  return (
    <span className={getProjectWorkItemPriorityBadgeClassName(priority)}>
      {getProjectWorkItemPriorityLabel(priority)}
    </span>
  );
}

function CompactPriorityLabel({ priority }: { priority: ProjectWorkItemPriority }) {
  return (
    <span className={getProjectWorkItemPriorityBadgeClassName(priority, COMPACT_OPTION_CLASS_NAME)}>
      {getProjectWorkItemPriorityLabel(priority)}
    </span>
  );
}

export function ProjectWorkItemPrioritySelector({
  id,
  value,
  disabled = false,
  onChange,
}: ProjectWorkItemPrioritySelectorProps) {
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
          <PriorityLabel priority={value} />
          <ChevronDown className="size-4 shrink-0 text-prism-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-40 py-1"
      >
        {PROJECT_WORK_ITEM_PRIORITIES.map(priority => (
          <DropdownMenuItem
            key={priority}
            className="justify-between gap-2 px-2 py-1"
            onSelect={() => onChange(priority)}
          >
            <CompactPriorityLabel priority={priority} />
            {priority === value && <Check className="size-3.5 text-prism-muted" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
