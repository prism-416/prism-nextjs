import { Typography } from "@/atomics/atoms/Typography";

export function ProjectNoResults() {
  return (
    <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center">
      <Typography
        variant="title"
        tone="primary"
      >
        No matching projects
      </Typography>
      <Typography
        variant="bodySm"
        tone="muted"
        className="mt-2"
      >
        Try a different project name, slug, or description.
      </Typography>
    </div>
  );
}
