"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceEditDialog } from "@/domains/workspaces/components/list/WorkspaceEditDialog";
import type { Workspace } from "@/domains/workspaces/types";

type WorkspaceSettingsClientProps = {
  workspace: Workspace;
};

export function WorkspaceSettingsClient({ workspace }: WorkspaceSettingsClientProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-prism-heading">Settings</h1>
            <p className="mt-1 text-sm text-prism-muted">Manage this workspace profile.</p>
          </div>
          <Button
            onClick={() => setIsEditOpen(true)}
            className="h-10 gap-1.5 rounded-lg px-4"
          >
            <Pencil className="size-4" />
            Edit workspace
          </Button>
        </div>

        <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]">
          <Typography
            variant="caption"
            tone="muted"
            className="uppercase tracking-[0.2em]"
          >
            Workspace
          </Typography>
          <Typography
            variant="h2"
            tone="primary"
            className="mt-2"
          >
            {workspace.name}
          </Typography>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-1 font-mono"
          >
            /{workspace.slug}
          </Typography>
          <Typography
            variant="body"
            tone="muted"
            className="mt-4 max-w-3xl"
          >
            {workspace.description || "No description yet."}
          </Typography>
        </div>
      </section>

      <WorkspaceEditDialog
        workspace={workspace}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}
