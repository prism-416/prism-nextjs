"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";

type WorkspaceDetailsButtonProps = {
  workspaceName: string;
  onOpen: () => void;
};

export function WorkspaceDetailsButton({ workspaceName, onOpen }: WorkspaceDetailsButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 shrink-0 text-prism-muted"
      aria-label={`${workspaceName} details`}
      onClick={onOpen}
    >
      <MoreVertical className="size-4" />
    </Button>
  );
}
