import type { LucideIcon } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";

type ProjectMetaCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function ProjectMetaCard({ icon: Icon, label, value }: ProjectMetaCardProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-strong px-4 py-3">
      <div className="flex items-center gap-2 text-prism-muted">
        <Icon className="size-4" />
        <Typography
          as="span"
          variant="caption"
          tone="inherit"
          className="text-xs"
        >
          {label}
        </Typography>
      </div>
      <Typography
        variant="bodySm"
        tone="primary"
        weight="semibold"
        className="mt-2 truncate"
      >
        {value}
      </Typography>
    </div>
  );
}
