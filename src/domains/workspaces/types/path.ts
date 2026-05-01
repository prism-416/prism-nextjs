import type { LucideIcon } from "lucide-react";

export type WorkspacePathSegment = {
  name: string;
  href?: string;
  icon?: LucideIcon;
  onSelect?: () => void;
};
