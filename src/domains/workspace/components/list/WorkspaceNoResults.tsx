import { Typography } from "@/atomics/atoms/Typography";

export function WorkspaceNoResults() {
  return (
    <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center">
      <Typography
        variant="title"
        tone="primary"
      >
        No matching workspaces
      </Typography>
      <Typography
        variant="bodySm"
        tone="muted"
        className="mt-2"
      >
        Try a different workspace name, slug, or description.
      </Typography>
    </div>
  );
}
