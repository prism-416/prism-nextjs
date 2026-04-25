"use client";

import { Sparkles } from "lucide-react";

import { DialogDescription, DialogHeader, DialogTitle } from "@/atomics/atoms/Dialog";

export function CreateWorkspaceDialogHero() {
  return (
    <div
      className="relative px-6 pb-5 pt-6"
      style={{
        background:
          "linear-gradient(135deg, rgba(120,196,212,0.18) 0%, rgba(157,123,255,0.14) 45%, rgba(255,107,198,0.10) 100%)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-prism-navy text-primary-foreground shadow-[0_8px_24px_rgba(12,71,103,0.25)]">
          <Sparkles className="size-5" />
        </span>
        <DialogHeader className="gap-0.5">
          <DialogTitle>Create a new workspace</DialogTitle>
          <DialogDescription>
            Organize projects, invite teammates, and keep everything in one calm place.
          </DialogDescription>
        </DialogHeader>
      </div>
    </div>
  );
}
