"use client";

import * as React from "react";
import { CalendarDays, Check, RotateCcw, Trash2, TriangleAlert } from "lucide-react";

import { UserAvatarStack } from "@/atomics/atoms/Avatar";
import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/atomics/molecules/Dialog";
import { WORK_ITEM_STATUS_DOT_CLASS_NAMES } from "@/domains/projects/components/ProjectDashboardStatusColumn";
import { getProjectWorkItemPriorityBadgeClassName } from "@/domains/projects/components/ProjectWorkItemPriorityBadge";
import { WORK_ITEM_TRASH_RETENTION_DAYS } from "@/domains/projects/constants/dashboard";
import { useBulkPermanentlyDeleteProjectWorkItems } from "@/domains/projects/hooks/useBulkPermanentlyDeleteProjectWorkItems";
import { useBulkRestoreProjectWorkItems } from "@/domains/projects/hooks/useBulkRestoreProjectWorkItems";
import { useProjectParticipants } from "@/domains/projects/hooks/useProjectParticipants";
import { useProjectWorkItemTrash } from "@/domains/projects/hooks/useProjectWorkItemTrash";
import { resolveAssigneeAvatarUsers } from "@/domains/projects/utils/assignee-display";
import { getProjectMutationErrorMessage } from "@/domains/projects/utils/error";
import {
  formatProjectDateTime,
  formatProjectScheduleSummary,
  getProjectWorkItemPriorityLabel,
  getProjectWorkItemStatusLabel,
} from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectTrashClientProps = {
  projectId: string;
  projectSlug: string;
  workspaceId: string;
};

function TrashCheckbox({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked
          ? "border-prism-teal-500 bg-prism-teal-500 text-white"
          : "border-border bg-surface-strong text-transparent hover:border-border-strong",
      )}
    >
      <Check className="size-3.5" />
    </button>
  );
}

export function ProjectTrashClient({ projectId, workspaceId }: ProjectTrashClientProps) {
  const { data, isPending, isError, refetch } = useProjectWorkItemTrash(projectId);
  const { data: members = [] } = useProjectParticipants(workspaceId);
  const { mutateAsync: bulkRestore } = useBulkRestoreProjectWorkItems(projectId);
  const { mutateAsync: bulkPermanentlyDelete } = useBulkPermanentlyDeleteProjectWorkItems(projectId);

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => new Set());
  const [busy, setBusy] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const items = React.useMemo(() => data?.items ?? [], [data?.items]);

  // Drop selections for items that are no longer in the trash list.
  React.useEffect(() => {
    setSelectedIds(previous => {
      const valid = new Set(items.map(item => item.itemId));
      let changed = false;
      const next = new Set<string>();
      previous.forEach(id => {
        if (valid.has(id)) {
          next.add(id);
        } else {
          changed = true;
        }
      });
      return changed ? next : previous;
    });
  }, [items]);

  const selectedCount = selectedIds.size;
  const allSelected = items.length > 0 && selectedCount === items.length;

  // Clear the current selection with Escape.
  React.useEffect(() => {
    if (selectedCount === 0) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIds(new Set());
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedCount]);

  const toggleSelected = (itemId: string) => {
    setSelectedIds(previous => {
      const next = new Set(previous);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(previous => (previous.size === items.length ? new Set() : new Set(items.map(item => item.itemId))));
  };

  const runAction = async (action: () => Promise<unknown>, errorMessage: string) => {
    setActionError(null);
    setBusy(true);
    try {
      await action();
      return true;
    } catch (error) {
      setActionError(getProjectMutationErrorMessage(error, errorMessage));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleBulkRestore = async () => {
    if (selectedCount === 0) return;
    const ok = await runAction(
      () => bulkRestore({ projectId, itemIds: Array.from(selectedIds) }),
      "Failed to restore work items.",
    );
    if (ok) setSelectedIds(new Set());
  };

  const handleConfirmPermanentDelete = async () => {
    if (selectedCount === 0) return;
    const ok = await runAction(
      () => bulkPermanentlyDelete({ projectId, itemIds: Array.from(selectedIds) }),
      "Failed to delete work items.",
    );
    if (ok) {
      setSelectedIds(new Set());
      setConfirmDeleteOpen(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trash2 className="size-5 text-prism-muted" />
            <Typography
              variant="h3"
              tone="primary"
              className="text-xl tracking-normal md:text-xl"
            >
              Trash
            </Typography>
          </div>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-1"
          >
            Deleted work items are kept here for {WORK_ITEM_TRASH_RETENTION_DAYS} days, then permanently removed.
          </Typography>
        </div>
      </div>

      {actionError && (
        <div className="rounded-xl border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          {actionError}
        </div>
      )}

      {isError ? (
        <div className="rounded-xl border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          <p>Trash could not be loaded.</p>
          <Button
            className="mt-3 h-9 rounded-lg border-prism-danger-soft bg-surface px-4 text-prism-danger hover:bg-prism-danger-soft/40"
            onClick={() => void refetch()}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      ) : isPending ? (
        <div className="rounded-2xl border border-border/80 bg-surface px-5 py-6 text-center text-sm text-prism-muted">
          Loading trash...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-6 text-center">
          <Typography
            variant="bodySm"
            tone="primary"
            weight="medium"
          >
            Trash is empty
          </Typography>
          <Typography
            variant="caption"
            tone="muted"
            className="mt-1 block"
          >
            Deleted work items will appear here.
          </Typography>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-strong px-4 py-2.5">
            <button
              type="button"
              role="checkbox"
              aria-checked={allSelected}
              aria-label={allSelected ? "Deselect all" : "Select all"}
              className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={toggleSelectAll}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
                  allSelected
                    ? "border-prism-teal-500 bg-prism-teal-500 text-white"
                    : "border-border bg-surface-strong text-transparent",
                )}
              >
                <Check className="size-3.5" />
              </span>
              <Typography
                variant="bodySm"
                tone="primary"
                weight="medium"
              >
                {allSelected ? "Deselect all" : "Select all"}
              </Typography>
            </button>
            <div className="flex items-center gap-3">
              {selectedCount > 0 ? (
                <>
                  <Typography
                    variant="bodySm"
                    tone="muted"
                  >
                    {selectedCount} selected
                  </Typography>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 rounded-lg px-3"
                    disabled={busy}
                    onClick={() => void handleBulkRestore()}
                  >
                    <RotateCcw className="size-4" />
                    Restore
                  </Button>
                  <Button
                    type="button"
                    className="h-9 rounded-lg bg-prism-danger px-3 text-white hover:bg-prism-danger/90"
                    disabled={busy}
                    onClick={() => {
                      setActionError(null);
                      setConfirmDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </>
              ) : (
                <Typography
                  variant="bodySm"
                  tone="muted"
                >
                  {items.length} item{items.length === 1 ? "" : "s"}
                </Typography>
              )}
            </div>
          </div>

          <ul className="flex flex-col gap-2">
            {items.map(item => {
              const isSelected = selectedIds.has(item.itemId);
              const scheduleSummary = formatProjectScheduleSummary(item.startDate, item.dueDate);
              const assigneeUsers = resolveAssigneeAvatarUsers(item.assigneeUsernames, members);
              return (
                <li
                  key={item.itemId}
                  className={cn(
                    "flex gap-3 rounded-xl border bg-surface p-4",
                    isSelected
                      ? "border-prism-teal-500/60 shadow-[0_0_0_1px_rgba(19,177,165,0.25)]"
                      : "border-border/80",
                  )}
                >
                  <div className="pt-0.5">
                    <TrashCheckbox
                      checked={isSelected}
                      label={isSelected ? `Deselect ${item.title}` : `Select ${item.title}`}
                      onChange={() => toggleSelected(item.itemId)}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Typography
                          variant="bodySm"
                          tone="primary"
                          weight="semibold"
                          className="min-w-0 truncate"
                        >
                          {item.title}
                        </Typography>
                        <span className="inline-flex h-5 items-center gap-1.5 rounded-full border border-border bg-surface-strong px-2 text-[11px] font-medium text-prism-body">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "size-1.5 shrink-0 rounded-full",
                              WORK_ITEM_STATUS_DOT_CLASS_NAMES[item.status] ?? "bg-prism-muted",
                            )}
                          />
                          {getProjectWorkItemStatusLabel(item.status)}
                        </span>
                        <span
                          className={getProjectWorkItemPriorityBadgeClassName(item.priority, "h-5 px-2 text-[11px]")}
                        >
                          {getProjectWorkItemPriorityLabel(item.priority)}
                        </span>
                        {item.descendantCount > 0 && (
                          <span className="inline-flex h-5 items-center rounded-full border border-border bg-surface-strong px-2 text-[11px] font-medium text-prism-muted">
                            +{item.descendantCount} subitem{item.descendantCount === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <Typography
                          variant="caption"
                          tone="muted"
                          className="mt-1 line-clamp-1 block"
                        >
                          {item.description}
                        </Typography>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-prism-muted">
                        {(item.startDate || item.dueDate) && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="size-3.5 shrink-0" />
                            {scheduleSummary}
                          </span>
                        )}
                        {assigneeUsers.length > 0 && (
                          <span onPointerDown={event => event.stopPropagation()}>
                            <UserAvatarStack
                              users={assigneeUsers}
                              avatarClassName="size-5 text-[9px]"
                            />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="shrink-0 self-end whitespace-nowrap text-xs text-prism-muted">
                    Deleted {formatProjectDateTime(item.deletedAt)}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <Dialog
        open={confirmDeleteOpen}
        onOpenChange={nextOpen => {
          if (!nextOpen && !busy) setConfirmDeleteOpen(false);
        }}
      >
        <DialogContent className="max-w-md overflow-hidden p-0">
          <div className="border-b border-prism-danger-soft bg-prism-danger-soft/15 px-6 pb-5 pt-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-prism-danger-soft/60 text-prism-danger">
                <TriangleAlert className="size-5" />
              </span>
              <DialogHeader className="gap-0.5">
                <DialogTitle>Delete permanently</DialogTitle>
                <DialogDescription>This action cannot be undone.</DialogDescription>
              </DialogHeader>
            </div>
          </div>

          <div className="space-y-4 p-6">
            <div className="rounded-xl border border-prism-danger-soft bg-prism-danger-soft/15 px-4 py-3">
              <Typography
                variant="bodySm"
                tone="primary"
                weight="medium"
              >
                Permanently delete {selectedCount} work item{selectedCount === 1 ? "" : "s"}?
              </Typography>
              <Typography
                variant="caption"
                tone="muted"
                className="mt-1 block"
              >
                Selected work items and their subitems cannot be restored after this.
              </Typography>
            </div>

            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmDeleteOpen(false)}
                disabled={busy}
                className="h-10 rounded-lg px-4"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => void handleConfirmPermanentDelete()}
                disabled={busy}
                className="h-10 rounded-lg bg-prism-danger px-5 text-white hover:bg-prism-danger/90"
              >
                {busy ? "Deleting..." : "Delete permanently"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
