import { Box, Building2, ChevronsUpDown, type LucideIcon } from "lucide-react";

import { cn } from "@/shared/utils/cn";

export type WorkspacePathSegment = {
  name: string;
  icon?: LucideIcon;
  onSelect?: () => void;
};

type WorkspacePathProps = {
  workspace: WorkspacePathSegment;
  project?: WorkspacePathSegment;
  className?: string;
};

export function WorkspacePath({ workspace, project, className }: WorkspacePathProps) {
  return (
    <nav
      aria-label="Workspace path"
      className={cn("flex min-w-0 items-center gap-0.5 text-sm", className)}
    >
      <PathSeparator />
      <PathSegmentButton
        segment={workspace}
        defaultIcon={Building2}
      />
      {project ? (
        <>
          <PathSeparator />
          <PathSegmentButton
            segment={project}
            defaultIcon={Box}
          />
        </>
      ) : null}
    </nav>
  );
}

function PathSeparator() {
  return (
    <span
      aria-hidden="true"
      className="select-none px-1 text-prism-muted/60"
    >
      /
    </span>
  );
}

function PathSegmentButton({ segment, defaultIcon }: { segment: WorkspacePathSegment; defaultIcon: LucideIcon }) {
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

export default WorkspacePath;
