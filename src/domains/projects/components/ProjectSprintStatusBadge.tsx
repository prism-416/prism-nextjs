import type { ProjectSprintStatus } from "@/domains/projects/types";
import { getProjectSprintStatusLabel } from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectSprintStatusBadgeProps = {
  status: ProjectSprintStatus;
};

const SPRINT_STATUS_CLASS_NAMES: Record<ProjectSprintStatus, string> = {
  backlog: "border-border bg-surface-strong text-prism-muted",
  in_progress: "border-prism-teal-500/30 bg-prism-teal-500/10 text-prism-navy",
  done: "border-prism-glow-sky/35 bg-prism-glow-sky/10 text-prism-navy",
};

export function ProjectSprintStatusBadge({ status }: ProjectSprintStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium",
        SPRINT_STATUS_CLASS_NAMES[status],
      )}
    >
      {getProjectSprintStatusLabel(status)}
    </span>
  );
}
