"use client";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";

const FOUNDATION_SECTIONS = [
  {
    title: "Overview",
    description: "Reserve the top-level summary area for workspace metrics, recent activity, and status signals.",
  },
  {
    title: "Projects",
    description:
      "Use this section for the primary list view once the workspace list and detail endpoints are connected.",
  },
  {
    title: "Members",
    description: "Keep a dedicated surface ready for teammate management, roles, and invitation flows.",
  },
] as const;

export function WorkspacePage() {
  return (
    <main className="min-h-screen bg-(image:--gradient-auth-main) px-6 py-10 text-primary lg:px-8 lg:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-[2rem] border border-prism-sand/70 bg-(image:--gradient-panel-surface) p-8 shadow-(--shadow-auth-panel)">
          <Typography
            variant="overline"
            tone="inherit"
            className="text-prism-body/50"
          >
            Workspace
          </Typography>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <Typography
                variant="h1"
                tone="primary"
                className="tracking-[-0.03em]"
              >
                Workspace page foundation
              </Typography>
              <Typography
                variant="body"
                tone="inherit"
                className="text-prism-body/70"
              >
                This route is now protected and ready for workspace list, detail, and creation APIs to be integrated in
                follow-up tickets.
              </Typography>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-prism-sand/80 bg-white/70"
                disabled
              >
                Invite members
              </Button>
              <Button
                type="button"
                className="rounded-xl px-6"
                disabled
              >
                Create workspace
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {FOUNDATION_SECTIONS.map(section => (
            <article
              key={section.title}
              className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-(--shadow-soft-navy-card)"
            >
              <Typography
                variant="title"
                tone="primary"
              >
                {section.title}
              </Typography>
              <Typography
                variant="bodySm"
                tone="inherit"
                className="mt-3 text-prism-body/70"
              >
                {section.description}
              </Typography>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-(--shadow-soft-navy-card)">
          <Typography
            variant="title"
            tone="primary"
          >
            Next implementation steps
          </Typography>
          <Typography
            variant="body"
            tone="inherit"
            className="mt-3 text-prism-body/70"
          >
            Connect the workspace endpoints first, then replace these placeholder sections with domain components fed by
            `useApiQuery` and `useApiMutation`.
          </Typography>
        </section>
      </div>
    </main>
  );
}
