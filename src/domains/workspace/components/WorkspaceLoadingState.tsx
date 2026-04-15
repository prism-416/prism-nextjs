"use client";

import { Typography } from "@/atomics/atoms/Typography";

export function WorkspaceLoadingState() {
  return (
    <main className="min-h-screen bg-(image:--gradient-auth-main) px-6 py-12 text-primary">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="rounded-3xl border border-prism-sand/70 bg-white/80 px-8 py-10 text-center shadow-(--shadow-soft-navy-card)">
          <Typography
            variant="overline"
            tone="inherit"
            className="text-prism-body/50"
          >
            Workspace
          </Typography>
          <Typography
            variant="h3"
            tone="primary"
            className="mt-3"
          >
            Checking your session
          </Typography>
          <Typography
            variant="body"
            tone="inherit"
            className="mt-3 max-w-md text-prism-body/70"
          >
            Please wait while we prepare your workspace.
          </Typography>
        </div>
      </div>
    </main>
  );
}
