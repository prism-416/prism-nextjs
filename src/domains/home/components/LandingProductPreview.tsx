import { Bot, CheckCheck, GitPullRequest, Sparkles } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";
import { cn } from "@/shared/utils/cn";

import LandingSectionIntro from "./LandingSectionIntro";
import LandingSectionShell from "./LandingSectionShell";
import {
  LANDING_PRODUCT_BOARD,
  LANDING_PRODUCT_METRICS,
  LANDING_PRODUCT_PREVIEW_INTRO,
  type LandingProductBoardColumn,
  type LandingProductBoardItem,
} from "../constants/content";

const BOARD_COLUMN_STYLES: Record<string, { dot: string; glow: string }> = {
  Ready: {
    dot: "bg-prism-glow-gold",
    glow: "bg-prism-glow-gold/18",
  },
  "In Progress": {
    dot: "bg-prism-glow-sky",
    glow: "bg-prism-glow-sky/18",
  },
  Done: {
    dot: "bg-prism-teal-500",
    glow: "bg-prism-teal-500/14",
  },
} as const;

export default function LandingProductPreview() {
  return (
    <LandingSectionShell
      id="workflow"
      className="relative overflow-hidden border-b border-border bg-(image:--gradient-workflow-surface) py-16 md:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-prism-teal-500/60 to-transparent" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-center lg:gap-12">
        <div>
          <LandingSectionIntro {...LANDING_PRODUCT_PREVIEW_INTRO} />
          <div className="mt-6 grid gap-3 sm:grid-cols-3 md:mt-8 md:gap-4">
            {LANDING_PRODUCT_METRICS.map(metric => (
              <div
                key={metric.label}
                className="rounded-3xl border border-border bg-white/72 p-4 shadow-[0_14px_40px_rgba(12,71,103,0.06)] transition duration-150 hover:-translate-y-0.5 hover:border-prism-teal-500/45 sm:p-5"
              >
                <Typography
                  variant="bodySm"
                  tone="muted"
                  weight="medium"
                >
                  {metric.label}
                </Typography>
                <Typography
                  variant="h3"
                  tone="inherit"
                  className="mt-2 text-prism-navy"
                >
                  {metric.value}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_55%_45%,rgba(99,178,255,0.16),transparent_55%),radial-gradient(circle_at_22%_18%,rgba(255,107,198,0.08),transparent_32%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface-strong/92 p-2 shadow-2xl shadow-prism-navy/12 backdrop-blur sm:p-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,241,168,0.26),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(157,123,255,0.1),transparent_28%)]" />
            <div className="relative rounded-[1.5rem] border border-border/70 bg-white/88">
              <PreviewHeader />
              <div className="grid gap-3 border-t border-border/70 bg-prism-sand-soft/28 p-3 sm:p-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {LANDING_PRODUCT_BOARD.map(column => (
                  <PreviewColumn
                    key={column.title}
                    column={column}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingSectionShell>
  );
}

function PreviewHeader() {
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-prism-navy text-white shadow-lg shadow-prism-navy/15">
          <Sparkles
            className="size-5"
            aria-hidden
          />
        </div>
        <div>
          <Typography
            variant="overline"
            tone="muted"
            weight="medium"
          >
            Sprint command center
          </Typography>
          <Typography
            variant="title"
            tone="inherit"
            className="mt-1 text-prism-navy"
          >
            Autonomous launch sprint
          </Typography>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusPill icon={Bot}>18 agent actions</StatusPill>
        <StatusPill icon={CheckCheck}>On track</StatusPill>
      </div>
    </div>
  );
}

function PreviewColumn({ column }: { column: LandingProductBoardColumn }) {
  const styles = BOARD_COLUMN_STYLES[column.title];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-white/82 p-3">
      <div className={cn("absolute right-3 top-3 size-14 rounded-full blur-2xl", styles.glow)} />
      <div className="relative flex items-center justify-between gap-3 px-1 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={cn("size-2 rounded-full", styles.dot)} />
            <Typography
              as="h3"
              variant="bodySm"
              tone="inherit"
              weight="semibold"
              className="text-prism-navy"
            >
              {column.title}
            </Typography>
          </div>
          <Typography
            variant="caption"
            tone="muted"
            className="mt-1"
          >
            {column.summary}
          </Typography>
        </div>
      </div>

      <div className="relative grid gap-3">
        {column.items.map(item => (
          <PreviewCard
            key={item.title}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}

function PreviewCard({ item }: { item: LandingProductBoardItem }) {
  return (
    <article className="rounded-2xl border border-border/70 bg-white p-3 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-prism-teal-500/40 hover:shadow-md sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <Typography
          variant="bodySm"
          tone="inherit"
          weight="semibold"
          className="text-prism-navy"
        >
          {item.title}
        </Typography>
        <GitPullRequest
          className="mt-0.5 size-4 shrink-0 text-prism-muted"
          aria-hidden
        />
      </div>
      <Typography
        variant="caption"
        tone="muted"
        className="mt-2"
      >
        {item.meta}
      </Typography>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-prism-navy/5 px-3 py-1 text-xs font-semibold text-prism-navy">
        <Bot
          className="size-3.5"
          aria-hidden
        />
        {item.agent}
      </div>
    </article>
  );
}

function StatusPill({ icon: Icon, children }: { icon: typeof Bot; children: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/76 px-3 py-1.5 text-xs font-semibold text-prism-navy">
      <Icon
        className="size-3.5"
        aria-hidden
      />
      {children}
    </div>
  );
}
