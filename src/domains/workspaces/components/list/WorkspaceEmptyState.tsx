import { Plus, Sparkles } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";

type WorkspaceEmptyStateProps = {
  onCreate: () => void;
};

export function WorkspaceEmptyState({ onCreate }: WorkspaceEmptyStateProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-dashed border-border-strong/60 bg-surface px-8 py-16 text-center"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 0%, rgba(157,123,255,0.10), transparent 40%), radial-gradient(circle at 80% 100%, rgba(120,196,212,0.12), transparent 40%)",
      }}
    >
      <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-prism-navy text-primary-foreground shadow-[0_8px_24px_rgba(12,71,103,0.20)]">
        <Sparkles className="size-5" />
      </span>
      <Typography
        variant="h3"
        tone="primary"
      >
        No workspaces yet
      </Typography>
      <Typography
        variant="body"
        tone="muted"
        className="mx-auto mt-3 max-w-md"
      >
        Create your first workspace to start collaborating with your team.
      </Typography>
      <Button
        onClick={onCreate}
        className="mt-6 h-10 gap-1.5 rounded-lg px-5"
      >
        <Plus className="size-4" />
        Create workspace
      </Button>
    </div>
  );
}
