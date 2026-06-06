"use client";

import { useCallback, useMemo, useState } from "react";

import { useBulkDeleteProjectWorkItems } from "@/domains/projects/hooks/useBulkDeleteProjectWorkItems";

type UseProjectWorkItemBulkSelectionParams = {
  projectId: string;
  setUpdateError: (message: string | null) => void;
};

/**
 * Owns the dashboard's multi-select state and the "move selected to trash" bulk
 * action. Selection is an explicit mode toggled from the header; while active,
 * cards show checkboxes, dragging is disabled and a floating action bar appears.
 */
export function useProjectWorkItemBulkSelection({ projectId, setUpdateError }: UseProjectWorkItemBulkSelectionParams) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const { mutateAsync: bulkDelete, isPending } = useBulkDeleteProjectWorkItems(projectId);

  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode(previous => {
      if (previous) {
        setSelectedIds(new Set());
      }
      return !previous;
    });
  }, []);

  const toggleSelected = useCallback((itemId: string) => {
    setSelectedIds(previous => {
      const next = new Set(previous);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) {
      return;
    }

    setUpdateError(null);
    try {
      await bulkDelete({ projectId, itemIds: Array.from(selectedIds) });
      setSelectionMode(false);
      setSelectedIds(new Set());
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : "Work items could not be deleted.");
    }
  }, [bulkDelete, projectId, selectedIds, setUpdateError]);

  return useMemo(
    () => ({
      selectionMode,
      selectedIds,
      selectedCount: selectedIds.size,
      isBulkDeleting: isPending,
      onToggleSelectionMode: toggleSelectionMode,
      onExitSelectionMode: exitSelectionMode,
      onToggleSelected: toggleSelected,
      onBulkDelete: handleBulkDelete,
    }),
    [exitSelectionMode, handleBulkDelete, isPending, selectedIds, selectionMode, toggleSelectionMode, toggleSelected],
  );
}
