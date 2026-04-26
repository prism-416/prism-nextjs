import type { LucideIcon } from "lucide-react";

export type WorkspacePathSegment = {
  name: string;
  icon?: LucideIcon;
  onSelect?: () => void;
};
