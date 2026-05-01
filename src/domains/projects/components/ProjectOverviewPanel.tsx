import { FolderKanban } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";
import type { Project } from "@/domains/projects/types";

type ProjectOverviewPanelProps = {
  project: Project;
};

export function ProjectOverviewPanel({ project }: ProjectOverviewPanelProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-surface p-5">
      <div className="flex items-center gap-2">
        <FolderKanban className="size-4 text-prism-muted" />
        <Typography
          variant="title"
          tone="primary"
        >
          Project overview
        </Typography>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-surface-strong p-4">
          <Typography
            variant="caption"
            tone="muted"
          >
            Project ID
          </Typography>
          <Typography
            variant="bodySm"
            tone="primary"
            className="mt-2 truncate font-mono text-xs"
          >
            {project.projectId}
          </Typography>
        </div>
        <div className="rounded-xl border border-border/70 bg-surface-strong p-4">
          <Typography
            variant="caption"
            tone="muted"
          >
            Workspace ID
          </Typography>
          <Typography
            variant="bodySm"
            tone="primary"
            className="mt-2 truncate font-mono text-xs"
          >
            {project.workspaceId}
          </Typography>
        </div>
      </div>
    </div>
  );
}
