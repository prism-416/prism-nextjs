import Link from "next/link";
import { ArrowUpRight, CalendarDays, FolderKanban } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";
import type { ProjectSummary } from "@/domains/projects/types";
import { formatProjectRelativeDate, getProjectGradient, getProjectInitials } from "@/domains/projects/utils/display";
import { cn } from "@/shared/utils/cn";

type ProjectCardProps = {
  project: ProjectSummary;
  workspaceSlug: string;
};

export function ProjectCard({ project, workspaceSlug }: ProjectCardProps) {
  const projectHref = `/workspaces/${encodeURIComponent(workspaceSlug)}/projects/${encodeURIComponent(project.slug)}`;

  return (
    <Link
      href={projectHref}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface p-5",
        "shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_14px_40px_rgba(12,71,103,0.10)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prism-teal-500 focus-visible:ring-offset-2",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundImage: getProjectGradient(project) }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden
            style={{ backgroundImage: getProjectGradient(project) }}
            className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/50 font-semibold text-prism-navy-deep shadow-[0_4px_14px_rgba(12,71,103,0.08)]"
          >
            {getProjectInitials(project.name)}
          </span>
          <div className="min-w-0">
            <Typography
              variant="title"
              tone="primary"
              className="truncate"
            >
              {project.name}
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
              className="mt-0.5 truncate font-mono text-xs"
            >
              /{project.slug}
            </Typography>
          </div>
        </div>

        <span className="grid size-9 shrink-0 place-items-center rounded-full text-prism-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-surface-strong group-hover:text-primary">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 text-prism-muted">
          <FolderKanban className="size-3.5" />
          <Typography
            as="span"
            variant="caption"
            tone="inherit"
          >
            Project
          </Typography>
        </span>
        <span className="inline-flex items-center gap-1.5 text-prism-muted">
          <ArrowUpRight className="size-3.5" />
          <Typography
            as="span"
            variant="caption"
            tone="inherit"
          >
            Open
          </Typography>
        </span>
      </div>

      <Typography
        variant="bodySm"
        tone="muted"
        className={cn("relative mt-4 line-clamp-2 min-h-10", !project.description && "italic opacity-60")}
      >
        {project.description || "No description yet."}
      </Typography>

      <div className="relative mt-5 space-y-3 border-t border-border/60 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-prism-teal-500/40" />
              <span className="relative inline-flex size-2 rounded-full bg-prism-teal-500" />
            </span>
            <Typography
              as="span"
              variant="caption"
              tone="muted"
            >
              Active
            </Typography>
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5 text-prism-muted">
            <CalendarDays className="size-3.5 shrink-0" />
            <Typography
              as="span"
              variant="caption"
              tone="inherit"
              className="truncate"
            >
              Created {formatProjectRelativeDate(project.createdAt)}
            </Typography>
          </span>
        </div>
      </div>
    </Link>
  );
}
