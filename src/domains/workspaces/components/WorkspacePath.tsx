import { Fragment } from "react";

import { WorkspacePathSegmentButton } from "@/domains/workspaces/components/path/WorkspacePathSegmentButton";
import { WorkspacePathSeparator } from "@/domains/workspaces/components/path/WorkspacePathSeparator";
import type { WorkspacePathSegment } from "@/domains/workspaces/types/path";
import { cn } from "@/shared/utils/cn";

type WorkspacePathProps = {
  segments: WorkspacePathSegment[];
  className?: string;
};

export function WorkspacePath({ segments, className }: WorkspacePathProps) {
  if (segments.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Workspace path"
      className={cn("flex min-w-0 items-center gap-0.5 text-sm", className)}
    >
      <WorkspacePathSeparator />
      {segments.map((segment, index) => (
        <Fragment key={`${segment.href ?? segment.name}-${index}`}>
          {index > 0 ? <WorkspacePathSeparator /> : null}
          <WorkspacePathSegmentButton
            segment={segment}
            isCurrent={index === segments.length - 1}
          />
        </Fragment>
      ))}
    </nav>
  );
}

export default WorkspacePath;
