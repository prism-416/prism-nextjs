import type { SprintStatus } from "@/domains/sprints/types";
import { getSprintStatusLabel } from "@/domains/sprints/utils/sprint";
import { cn } from "@/shared/utils/cn";

type SprintStatusBadgeProps = {
  status: SprintStatus;
};

const STATUS_CLASS_NAMES: Record<SprintStatus, string> = {
  planned: "border-border bg-surface-strong text-prism-muted",
  active: "border-prism-teal-500/30 bg-prism-teal-500/10 text-prism-navy",
  closed: "border-prism-glow-sky/35 bg-prism-glow-sky/10 text-prism-navy",
  cancelled: "border-prism-danger-soft bg-prism-danger-soft/20 text-prism-danger",
};

export function SprintStatusBadge({ status }: SprintStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium",
        STATUS_CLASS_NAMES[status],
      )}
    >
      {getSprintStatusLabel(status)}
    </span>
  );
}
