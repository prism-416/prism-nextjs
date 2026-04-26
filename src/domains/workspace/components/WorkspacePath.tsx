import { Box, Building2 } from "lucide-react";

import { WorkspacePathSegmentButton } from "@/domains/workspace/components/path/WorkspacePathSegmentButton";
import { WorkspacePathSeparator } from "@/domains/workspace/components/path/WorkspacePathSeparator";
import type { WorkspacePathSegment } from "@/domains/workspace/types/path";
import { cn } from "@/shared/utils/cn";

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
      <WorkspacePathSeparator />
      <WorkspacePathSegmentButton
        segment={workspace}
        defaultIcon={Building2}
      />
      {project ? (
        <>
          <WorkspacePathSeparator />
          <WorkspacePathSegmentButton
            segment={project}
            defaultIcon={Box}
          />
        </>
      ) : null}
    </nav>
  );
}

export default WorkspacePath;
