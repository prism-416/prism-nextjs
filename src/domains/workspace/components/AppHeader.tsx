import * as React from "react";
import { Bell, Search } from "lucide-react";
import Link from "next/link";

import { cn } from "@/shared/utils/cn";
import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { WorkspacePath, type WorkspacePathSegment } from "@/domains/workspace/components/WorkspacePath";

type AppHeaderProps = {
  workspace?: WorkspacePathSegment;
  project?: WorkspacePathSegment;
  actions?: React.ReactNode;
  className?: string;
};

export function AppHeader({ workspace, project, actions, className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[var(--header-height,4rem)] w-full shrink-0 items-center gap-2 border-b border-border bg-surface/80 px-4 backdrop-blur md:px-6",
        className,
      )}
    >
      <Link
        href="/"
        aria-label="Prism home"
        className="flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="grid size-8 place-items-center rounded-md bg-prism-navy text-primary-foreground">
          <span className="text-sm font-semibold">P</span>
        </div>
      </Link>

      {workspace ? (
        <WorkspacePath
          workspace={workspace}
          project={project}
          className="min-w-0 flex-1"
        />
      ) : (
        <div className="min-w-0 flex-1" />
      )}

      <div className="relative hidden w-72 shrink-0 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-prism-muted" />
        <Input
          type="search"
          placeholder="Search..."
          className="h-9 border-border bg-surface-field pl-9 text-sm"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {actions}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell />
        </Button>
        <div
          aria-label="User menu"
          className="grid size-9 place-items-center rounded-full bg-prism-navy text-sm font-semibold text-primary-foreground"
        >
          U
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
