"use client";

import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";

type ProjectWorkItemCommentActionMenuProps = {
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProjectWorkItemCommentActionMenu({
  isDeleting,
  onEdit,
  onDelete,
}: ProjectWorkItemCommentActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="shrink-0 rounded-lg p-1 text-prism-muted transition-all hover:bg-prism-navy/8 hover:text-prism-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
          aria-label="Comment actions"
        >
          <EllipsisVertical className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-32"
      >
        <DropdownMenuItem
          onSelect={onEdit}
          className="gap-2"
        >
          <Pencil className="size-3.5" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isDeleting}
          onSelect={onDelete}
          className="gap-2 text-prism-danger data-[highlighted]:bg-prism-danger-soft/25 data-[highlighted]:text-prism-danger"
        >
          <Trash2 className="size-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
