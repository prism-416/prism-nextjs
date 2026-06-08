import { Grid3X3, List, Plus, Search } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { cn } from "@/shared/utils/cn";

type ProjectToolbarProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

type ProjectToolbarActionsProps = {
  canCreateProject: boolean;
  viewMode: "grid" | "list";
  onCreate: () => void;
  onViewModeChange: (viewMode: "grid" | "list") => void;
};

export function ProjectToolbar({ query, onQueryChange }: ProjectToolbarProps) {
  return (
    <div className="relative w-full lg:max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-prism-muted" />
      <Input
        type="search"
        value={query}
        onChange={event => onQueryChange(event.target.value)}
        placeholder="Search projects"
        className="h-10 rounded-lg border-border bg-surface-field pl-9 text-sm focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

export function ProjectToolbarActions({
  canCreateProject,
  viewMode,
  onCreate,
  onViewModeChange,
}: ProjectToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-lg border border-border bg-surface p-0.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewModeChange("grid")}
          aria-pressed={viewMode === "grid"}
          aria-label="Grid view"
          className={cn(
            "h-8 w-8 rounded-md text-prism-muted",
            viewMode === "grid" && "bg-prism-navy/5 text-prism-body",
          )}
        >
          <Grid3X3 className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewModeChange("list")}
          aria-pressed={viewMode === "list"}
          aria-label="List view"
          className={cn(
            "h-8 w-8 rounded-md text-prism-muted",
            viewMode === "list" && "bg-prism-navy/5 text-prism-body",
          )}
        >
          <List className="size-4" />
        </Button>
      </div>
      {canCreateProject && (
        <Button
          onClick={onCreate}
          className="h-10 gap-1.5 rounded-lg px-4"
        >
          <Plus className="size-4" />
          Create project
        </Button>
      )}
    </div>
  );
}
