import Link from "next/link";
import { ArrowLeft, CalendarDays, Globe2, Languages } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectMetaCard } from "@/domains/projects/components/ProjectMetaCard";
import type { Project } from "@/domains/projects/types";
import { formatProjectRelativeDate, getProjectGradient, getProjectInitials } from "@/domains/projects/utils/display";
import { cn } from "@/shared/utils/cn";

type ProjectHeroProps = {
  project: Project;
  workspaceSlug?: string;
};

export function ProjectHero({ project, workspaceSlug }: ProjectHeroProps) {
  const backHref = workspaceSlug ? `/workspaces/${encodeURIComponent(workspaceSlug)}` : "/workspaces";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-surface p-6",
        "shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full opacity-90 blur-3xl"
        style={{ backgroundImage: getProjectGradient(project) }}
      />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span
            aria-hidden
            style={{ backgroundImage: getProjectGradient(project) }}
            className="grid size-14 shrink-0 place-items-center rounded-2xl border border-white/50 text-base font-semibold text-prism-navy-deep shadow-[0_4px_14px_rgba(12,71,103,0.08)]"
          >
            {getProjectInitials(project.name)}
          </span>
          <div className="min-w-0">
            <Typography
              variant="h2"
              tone="primary"
              className="truncate"
            >
              {project.name}
            </Typography>
            <Typography
              variant="bodySm"
              tone="muted"
              className="mt-1 truncate font-mono text-xs"
            >
              /{project.slug}
            </Typography>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="h-10 rounded-lg bg-surface/80"
        >
          <Link href={backHref}>
            <ArrowLeft className="size-4" />
            Projects
          </Link>
        </Button>
      </div>

      <Typography
        variant="body"
        tone="muted"
        className={cn("relative mt-6 max-w-3xl", !project.description && "italic opacity-60")}
      >
        {project.description || "No description yet."}
      </Typography>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
        <ProjectMetaCard
          icon={CalendarDays}
          label="Created"
          value={formatProjectRelativeDate(project.createdAt)}
        />
        <ProjectMetaCard
          icon={Globe2}
          label="Timezone"
          value={project.timezone}
        />
        <ProjectMetaCard
          icon={Languages}
          label="Locale"
          value={project.locale}
        />
      </div>
    </div>
  );
}
