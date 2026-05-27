"use client";

import { Check, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import { getProjectWorkItemPriorityBadgeClassName } from "@/domains/projects/components/ProjectWorkItemPriorityBadge";
import { getProjectWorkItemStatusBadgeClassName } from "@/domains/projects/components/ProjectWorkItemStatusBadge";
import type { ProjectWorkItem, ProjectWorkItemPriority, ProjectWorkItemStatus } from "@/domains/projects/types";
import {
  getProjectWorkItemPriorityLabel,
  getProjectWorkItemStatusLabel,
  PROJECT_WORK_ITEM_PRIORITIES,
  PROJECT_WORK_ITEM_STATUSES,
} from "@/domains/projects/utils/work-item-display";

type ProjectWorkItemInlineControlsProps = {
  item: ProjectWorkItem;
  disabled: boolean;
  isUpdating: boolean;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
};

const TRIGGER_CLASS_NAME =
  "gap-1.5 cursor-pointer transition-shadow hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

export function ProjectWorkItemInlineControls({
  item,
  disabled,
  isUpdating,
  onStatusUpdate,
  onPriorityUpdate,
}: ProjectWorkItemInlineControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={getProjectWorkItemStatusBadgeClassName(item.status, TRIGGER_CLASS_NAME)}
            aria-label={`Change ${item.title} status`}
          >
            {getProjectWorkItemStatusLabel(item.status)}
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
              <span className={getProjectWorkItemStatusBadgeClassName(status)}>
                {getProjectWorkItemStatusLabel(status)}
              </span>
              {status === item.status && <Check className="size-4 text-prism-muted" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={getProjectWorkItemPriorityBadgeClassName(item.priority, TRIGGER_CLASS_NAME)}
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

      {isUpdating && <span className="text-xs text-prism-muted">Updating...</span>}
    </div>
  );
}
