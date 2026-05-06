import type { LucideIcon } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";

type ProjectSectionPlaceholderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function ProjectSectionPlaceholder({ title, description, icon: Icon }: ProjectSectionPlaceholderProps) {
  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="rounded-2xl border border-border/80 bg-surface p-5">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-prism-muted" />
          <Typography
            variant="title"
            tone="primary"
          >
            {title}
          </Typography>
        </div>
        <Typography
          variant="bodySm"
          tone="muted"
          className="mt-4 italic"
        >
          {description}
        </Typography>
      </div>
    </section>
  );
}
