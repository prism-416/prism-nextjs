import type { ProjectWorkItemStatus } from "@/domains/projects/types";
import { getProjectWorkItemStatusLabel } from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectWorkItemStatusBadgeProps = {
  status: ProjectWorkItemStatus;
};

const WORK_ITEM_STATUS_CLASS_NAMES: Record<ProjectWorkItemStatus, string> = {
  todo: "border-border bg-surface-strong text-prism-muted",
  in_progress: "border-prism-teal-500/30 bg-prism-teal-500/10 text-prism-navy",
  in_review: "border-prism-glow-gold/45 bg-prism-glow-gold/15 text-prism-navy",
  done: "border-prism-glow-sky/35 bg-prism-glow-sky/10 text-prism-navy",
  archived: "border-border bg-surface-strong text-prism-muted",
};

export function ProjectWorkItemStatusBadge({ status }: ProjectWorkItemStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium",
        WORK_ITEM_STATUS_CLASS_NAMES[status],
      )}
    >
      {getProjectWorkItemStatusLabel(status)}
    </span>
  );
}
