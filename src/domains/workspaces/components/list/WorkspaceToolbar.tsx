import { ArrowUpDown, Grid3X3, List, Plus, Search } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { cn } from "@/shared/utils/cn";

type WorkspaceToolbarProps = {
  query: string;
  viewMode: "grid" | "list";
  onCreate: () => void;
  onQueryChange: (query: string) => void;
  onViewModeChange: (viewMode: "grid" | "list") => void;
};

export function WorkspaceToolbar({
  query,
  viewMode,
  onCreate,
  onQueryChange,
  onViewModeChange,
}: WorkspaceToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-prism-muted" />
          <Input
            type="search"
            value={query}
            onChange={event => onQueryChange(event.target.value)}
            placeholder="Search workspaces"
            className="h-10 rounded-lg border-border bg-surface-field pl-9 text-sm focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-1.5 rounded-lg border-border bg-surface px-3 text-prism-body"
        >
          <ArrowUpDown className="size-3.5" />
          Sort
        </Button>
      </div>

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
        <Button
          onClick={onCreate}
          className="h-10 gap-1.5 rounded-lg px-4"
        >
          <Plus className="size-4" />
          Create workspace
        </Button>
      </div>
    </div>
  );
}
