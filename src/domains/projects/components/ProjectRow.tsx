import Link from "next/link";
import { ArrowUpRight, CalendarDays, FolderKanban } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import type { ProjectSummary } from "@/domains/projects/types";
import { formatProjectRelativeDate, getProjectGradient, getProjectInitials } from "@/domains/projects/utils/display";
import { cn } from "@/shared/utils/cn";

type ProjectRowProps = {
  project: ProjectSummary;
};

export function ProjectRow({ project }: ProjectRowProps) {
  const projectHref = `/projects/${encodeURIComponent(project.slug)}`;

  return (
    <article
      className={cn(
        "group flex items-center gap-4 rounded-xl border border-border/80 bg-surface px-4 py-3",
        "transition-colors hover:border-border-strong hover:bg-surface-strong",
      )}
    >
      <span
        aria-hidden
        style={{ backgroundImage: getProjectGradient(project) }}
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/50 font-semibold text-prism-navy-deep shadow-[0_4px_14px_rgba(12,71,103,0.08)]"
      >
        {getProjectInitials(project.name)}
      </span>
      <div className="min-w-0 flex-1">
        <Typography
          variant="title"
          tone="primary"
          className="truncate text-base"
        >
          {project.name}
        </Typography>
        <Typography
          variant="bodySm"
          tone="muted"
          className="truncate"
        >
          {project.description || `/${project.slug}`}
        </Typography>
      </div>
      <div className="hidden shrink-0 items-center gap-3 md:flex">
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
          <CalendarDays className="size-3.5" />
          <Typography
            as="span"
            variant="caption"
            tone="inherit"
          >
            {formatProjectRelativeDate(project.createdAt)}
          </Typography>
        </span>
      </div>
      <Button
        asChild
        variant="outline"
        className="h-9 rounded-lg bg-surface px-3"
      >
        <Link href={projectHref}>
          Open
          <ArrowUpRight className="size-4" />
        </Link>
      </Button>
    </article>
  );
}
