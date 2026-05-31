"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Checkbox } from "@/atomics/atoms/Checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/atomics/molecules/Dialog";
import { ProjectWorkItemPriorityBadge } from "@/domains/projects/components/ProjectWorkItemPriorityBadge";
import { ProjectWorkItemStatusBadge } from "@/domains/projects/components/ProjectWorkItemStatusBadge";
import { useProjects } from "@/domains/projects/hooks/useProjects";
import { useProjectWorkItems } from "@/domains/projects/hooks/useProjectWorkItems";
import type { ProjectWorkItem } from "@/domains/projects/types";
import { formatProjectScheduleSummary } from "@/domains/projects/utils/work-item-display";
import { useWorkspaceSprintWorkItems } from "@/domains/sprints/hooks/useWorkspaceSprintWorkItems";
import { useAddSprintWorkItems } from "@/domains/sprints/hooks/useAddSprintWorkItems";
import { useRemoveSprintWorkItem } from "@/domains/sprints/hooks/useRemoveSprintWorkItem";

type ManageSprintWorkItemsDialogProps = {
  open: boolean;
  workspaceId: string;
  workspaceSlug: string;
  sprintId: string;
  onOpenChange: (open: boolean) => void;
};

function useDebounced(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function ManageSprintWorkItemsDialog({
  open,
  workspaceId,
  workspaceSlug,
  sprintId,
  onOpenChange,
}: ManageSprintWorkItemsDialogProps) {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const debouncedQuery = useDebounced(query, 300);
  const searchRef = useRef<HTMLInputElement>(null);

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevAllSprintItems, setPrevAllSprintItems] = useState<typeof allSprintItems>(undefined);
  const [prevProjects, setPrevProjects] = useState<typeof projects>([]);

  const { data: projects = [] } = useProjects(workspaceSlug);
  const { data: allSprintItems } = useWorkspaceSprintWorkItems(workspaceId, sprintId, { limit: 1000 });
  const existingItemIds = new Set((allSprintItems?.items ?? []).map(i => i.itemId));
  const { data: workItemsResult, isPending: isLoadingItems } = useProjectWorkItems(selectedProjectId || undefined, {
    query: debouncedQuery || undefined,
    limit: 50,
  });
  const items = workItemsResult?.items ?? [];

  const { mutateAsync: addItems, isPending: isAdding } = useAddSprintWorkItems();
  const { mutateAsync: removeItem, isPending: isRemoving } = useRemoveSprintWorkItem();

  const isSaving = isAdding || isRemoving;

  if (prevOpen !== open) {
    setPrevOpen(open);
    if (!open) {
      setSelectedProjectId("");
      setQuery("");
      setSelectedIds(new Set());
    }
  }

  if (open && allSprintItems && prevAllSprintItems !== allSprintItems) {
    setPrevAllSprintItems(allSprintItems);
    setSelectedIds(new Set(allSprintItems.items.map(i => i.itemId)));
  }

  if (open && projects !== prevProjects && projects.length > 0) {
    setPrevProjects(projects);
    setSelectedProjectId(prev => prev || projects[0].projectId);
  }

  function toggle(itemId: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);

      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }

      return next;
    });
  }

  const toAdd = items.filter(i => selectedIds.has(i.itemId) && !existingItemIds.has(i.itemId));
  const toRemove = items.filter(i => !selectedIds.has(i.itemId) && existingItemIds.has(i.itemId));
  const hasChanges = toAdd.length > 0 || toRemove.length > 0;

  async function handleSave() {
    const removePromises = toRemove.map(i => removeItem({ workspaceId, sprintId, itemId: i.itemId }));
    const addPromise =
      toAdd.length > 0 ? addItems({ workspaceId, sprintId, itemIds: toAdd.map(i => i.itemId) }) : Promise.resolve();

    await Promise.all([...removePromises, addPromise]);
    onOpenChange(false);
  }

  function getSaveLabel() {
    if (isSaving) return "Saving...";

    return "Save changes";
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="flex max-h-[85vh] max-w-xl flex-col gap-0 p-0">
        <DialogHeader className="shrink-0 px-6 pb-4 pt-6">
          <DialogTitle>Manage work items</DialogTitle>
          <DialogDescription>Add or remove work items from this sprint.</DialogDescription>
        </DialogHeader>

        <div className="shrink-0 border-b border-border/70 px-6 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {projects.map(project => (
              <button
                key={project.projectId}
                type="button"
                onClick={() => {
                  setSelectedProjectId(project.projectId);
                  setQuery("");
                }}
                className={[
                  "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  selectedProjectId === project.projectId
                    ? "bg-primary text-prism-sand"
                    : "bg-surface-strong text-prism-body hover:bg-prism-navy/8",
                ].join(" ")}
              >
                {project.name}
              </button>
            ))}
          </div>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-prism-muted" />
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search work items..."
              className="h-9 w-full rounded-lg border border-border/80 bg-surface pl-8 pr-3 text-sm text-prism-body placeholder:text-prism-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {!selectedProjectId && (
            <p className="px-6 py-10 text-center text-sm text-prism-muted">Select a project to browse work items.</p>
          )}

          {selectedProjectId && isLoadingItems && (
            <div className="space-y-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-border/50 px-6 py-3"
                >
                  <div className="size-4 animate-pulse rounded bg-prism-navy/10" />
                  <div className="h-3.5 w-2/3 animate-pulse rounded bg-prism-navy/10" />
                </div>
              ))}
            </div>
          )}

          {selectedProjectId && !isLoadingItems && items.length === 0 && (
            <p className="px-6 py-10 text-center text-sm text-prism-muted">
              {debouncedQuery ? "No work items match your search." : "No work items in this project."}
            </p>
          )}

          {selectedProjectId &&
            !isLoadingItems &&
            items.length > 0 &&
            items.map(item => (
              <WorkItemRow
                key={item.itemId}
                item={item}
                checked={selectedIds.has(item.itemId)}
                isExisting={existingItemIds.has(item.itemId)}
                onToggle={() => toggle(item.itemId)}
              />
            ))}
        </div>

        <DialogFooter className="shrink-0 border-t border-border/70 px-6 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={() => void handleSave()}
            disabled={!hasChanges || isSaving}
          >
            {getSaveLabel()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WorkItemRow({
  item,
  checked,
  isExisting,
  onToggle,
}: {
  item: ProjectWorkItem;
  checked: boolean;
  isExisting: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={e => e.key === "Enter" && onToggle()}
      className="flex w-full cursor-pointer items-center gap-3 border-b border-border/50 px-6 py-3 last:border-b-0 hover:bg-surface-strong"
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onToggle}
        onClick={e => e.stopPropagation()}
        className={["shrink-0 border-border bg-transparent", isExisting && !checked ? "opacity-50" : ""].join(" ")}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-prism-heading">{item.title}</p>
        {item.description && <p className="mt-0.5 line-clamp-1 text-xs text-prism-muted">{item.description}</p>}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <ProjectWorkItemStatusBadge status={item.status} />
          <ProjectWorkItemPriorityBadge priority={item.priority} />
          {(item.startDate ?? item.dueDate) && (
            <span className="text-xs text-prism-muted">
              {formatProjectScheduleSummary(item.startDate, item.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
