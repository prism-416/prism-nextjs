import type { ProjectWorkItemPriority } from "@/domains/projects/types";
import { getProjectWorkItemPriorityLabel } from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectWorkItemPriorityBadgeProps = {
  priority: ProjectWorkItemPriority;
};

const WORK_ITEM_PRIORITY_CLASS_NAMES: Record<ProjectWorkItemPriority, string> = {
  low: "border-border bg-surface-strong text-prism-muted",
  medium: "border-prism-teal-500/25 bg-prism-teal-500/10 text-prism-navy",
  high: "border-prism-glow-gold/45 bg-prism-glow-gold/15 text-prism-navy",
  urgent: "border-prism-danger-soft bg-prism-danger-soft/25 text-prism-danger",
};

export function getProjectWorkItemPriorityBadgeClassName(priority: ProjectWorkItemPriority, className?: string) {
  return cn(
    "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium",
    WORK_ITEM_PRIORITY_CLASS_NAMES[priority],
    className,
  );
}

export function ProjectWorkItemPriorityBadge({ priority }: ProjectWorkItemPriorityBadgeProps) {
  return (
    <span className={getProjectWorkItemPriorityBadgeClassName(priority)}>
      {getProjectWorkItemPriorityLabel(priority)}
    </span>
  );
}
