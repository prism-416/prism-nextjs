import type { LucideIcon } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";

import type { WorkspacePathSegment } from "@/domains/workspace/types/path";

type WorkspacePathSegmentButtonProps = {
  segment: WorkspacePathSegment;
  defaultIcon: LucideIcon;
};

export function WorkspacePathSegmentButton({ segment, defaultIcon }: WorkspacePathSegmentButtonProps) {
  const Icon = segment.icon ?? defaultIcon;

  return (
    <button
      type="button"
      onClick={segment.onSelect}
      className="group flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-prism-cream/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="size-4 shrink-0 text-prism-muted group-hover:text-prism-navy" />
      <span className="truncate text-sm font-semibold text-prism-navy">{segment.name}</span>
      <ChevronsUpDown className="size-3.5 shrink-0 text-prism-muted" />
    </button>
  );
}
