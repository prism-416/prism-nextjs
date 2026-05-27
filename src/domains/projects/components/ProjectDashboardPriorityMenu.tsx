"use client";

import { Check, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import { getProjectWorkItemPriorityBadgeClassName } from "@/domains/projects/components/ProjectWorkItemPriorityBadge";
import type { ProjectWorkItem, ProjectWorkItemPriority } from "@/domains/projects/types";
import {
  getProjectWorkItemPriorityLabel,
  PROJECT_WORK_ITEM_PRIORITIES,
} from "@/domains/projects/utils/work-item-display";

type ProjectDashboardPriorityMenuProps = {
  item: ProjectWorkItem;
  disabled: boolean;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
};

const TRIGGER_CLASS_NAME =
  "gap-1.5 cursor-pointer transition-shadow hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

export function ProjectDashboardPriorityMenu({ item, disabled, onPriorityUpdate }: ProjectDashboardPriorityMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={getProjectWorkItemPriorityBadgeClassName(item.priority, TRIGGER_CLASS_NAME)}
          onPointerDown={event => event.stopPropagation()}
          aria-label={`Change ${item.title} priority`}
        >
          {getProjectWorkItemPriorityLabel(item.priority)}
          <ChevronDown className="size-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-32 py-1"
        onPointerDown={event => event.stopPropagation()}
        onClick={event => event.stopPropagation()}
      >
        {PROJECT_WORK_ITEM_PRIORITIES.map(priority => (
          <DropdownMenuItem
            key={priority}
            className="justify-between gap-2 px-2 py-1.5"
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
  );
}
