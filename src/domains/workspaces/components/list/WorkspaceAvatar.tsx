import type { Workspace } from "@/domains/workspaces/types";
import { getWorkspaceGradient, getWorkspaceInitials } from "@/domains/workspaces/utils/display";
import { cn } from "@/shared/utils/cn";

type WorkspaceAvatarProps = {
  workspace: Workspace;
  size?: "sm" | "md";
};

export function WorkspaceAvatar({ workspace, size = "md" }: WorkspaceAvatarProps) {
  return (
    <span
      aria-hidden
      style={{ backgroundImage: getWorkspaceGradient(workspace) }}
      className={cn(
        "grid shrink-0 place-items-center rounded-xl border border-white/50 font-semibold text-prism-navy-deep shadow-[0_4px_14px_rgba(12,71,103,0.08)]",
        size === "md" ? "size-11 text-sm" : "size-9 text-xs",
      )}
    >
      {getWorkspaceInitials(workspace.name)}
    </span>
  );
}
