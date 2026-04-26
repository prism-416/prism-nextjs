import type { LucideIcon } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";

type WorkspaceMetaItemProps = {
  icon: LucideIcon;
  label: string;
};

export function WorkspaceMetaItem({ icon: Icon, label }: WorkspaceMetaItemProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-prism-muted">
      <Icon className="size-3.5" />
      <Typography
        as="span"
        variant="caption"
        tone="inherit"
      >
        {label}
      </Typography>
    </span>
  );
}
