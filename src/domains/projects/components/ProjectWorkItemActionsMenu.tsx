"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";

import { formatProjectWorkItemLabel } from "@/domains/projects/utils/work-item-display";

type ProjectWorkItemActionsMenuProps = {
  code: string;
  title: string;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProjectWorkItemActionsMenu({ code, title, onEdit, onDelete }: ProjectWorkItemActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-lg text-prism-muted hover:bg-prism-navy/5 hover:text-prism-body"
          aria-label={`${formatProjectWorkItemLabel({ code, title })} options`}
        >
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={onEdit}
          className="gap-2.5 whitespace-nowrap"
        >
          <Pencil className="size-4 text-prism-muted" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={onDelete}
          className="gap-2.5 whitespace-nowrap text-prism-danger data-[highlighted]:bg-prism-danger-soft/25 data-[highlighted]:text-prism-danger"
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
