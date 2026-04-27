"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atomics/atoms/DropdownMenu";

type WorkspaceActionsMenuProps = {
  workspaceName: string;
  onEdit: () => void;
  onDelete: () => void;
};

export function WorkspaceActionsMenu({ workspaceName, onEdit, onDelete }: WorkspaceActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-prism-muted"
          aria-label={`${workspaceName} options`}
        >
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-0">
        <DropdownMenuItem
          onSelect={() => onEdit()}
          className="gap-2.5 whitespace-nowrap"
        >
          <Pencil className="size-4 text-prism-muted" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => onDelete()}
          className="gap-2.5 whitespace-nowrap text-prism-danger data-[highlighted]:bg-prism-danger-soft/25 data-[highlighted]:text-prism-danger"
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
