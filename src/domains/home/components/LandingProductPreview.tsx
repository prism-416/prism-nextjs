import { CalendarDays, CheckSquare, LayoutDashboard, Plus } from "lucide-react";

import { UserAvatarStack } from "@/atomics/atoms/Avatar";
import { Typography } from "@/atomics/atoms/Typography";
import { cn } from "@/shared/utils/cn";

import LandingSectionIntro from "./LandingSectionIntro";
import LandingSectionShell from "./LandingSectionShell";
import {
  LANDING_PRODUCT_BOARD,
  LANDING_PRODUCT_PREVIEW_INTRO,
  type LandingBoardPriority,
  type LandingBoardStatus,
  type LandingProductBoardColumn,
  type LandingProductBoardItem,
} from "../constants/content";

// Presentational tokens mirrored from the live project dashboard. The home
// domain must not import from domains/projects, so the labels/colors that keep
// this preview faithful to the real board are duplicated here intentionally.
const STATUS_LABELS: Record<LandingBoardStatus, string> = {
  todo: "Todo",
  in_progress: "In progress",
  in_review: "In review",
  done: "Done",
};

// Column header dots (matches WORK_ITEM_STATUS_DOT_CLASS_NAMES).
const STATUS_HEADER_DOT: Record<LandingBoardStatus, string> = {
  todo: "bg-prism-muted",
  in_progress: "bg-prism-info",
  in_review: "bg-prism-review",
  done: "bg-prism-success",
};

// Status badge dots on cards (matches ProjectDashboardStatusMenu).
const STATUS_BADGE_DOT: Record<LandingBoardStatus, string> = {
  todo: "bg-prism-muted/55",
  in_progress: "bg-prism-info",
  in_review: "bg-prism-review",
  done: "bg-prism-success",
};

const PRIORITY_LABELS: Record<LandingBoardPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

// Matches WORK_ITEM_PRIORITY_CLASS_NAMES in ProjectWorkItemPriorityBadge.
const PRIORITY_BADGE_CLASS: Record<LandingBoardPriority, string> = {
  low: "border-border bg-surface-strong text-prism-muted",
  medium: "border-prism-teal-500/25 bg-prism-teal-500/10 text-prism-navy",
  high: "border-prism-glow-gold/45 bg-prism-glow-gold/15 text-prism-navy",
  urgent: "border-prism-danger-soft bg-prism-danger-soft/25 text-prism-danger",
};

const TOTAL_WORK_ITEMS = LANDING_PRODUCT_BOARD.reduce((sum, column) => sum + column.items.length, 0);

function getColumnCount(status: LandingBoardStatus) {
  return LANDING_PRODUCT_BOARD.find(column => column.status === status)?.items.length ?? 0;
}

const PREVIEW_METRICS: readonly { label: string; value: string }[] = [
  { label: "Work items", value: String(TOTAL_WORK_ITEMS) },
  { label: "In progress", value: String(getColumnCount("in_progress")) },
  { label: "In review", value: String(getColumnCount("in_review")) },
] as const;

export default function LandingProductPreview() {
  return (
    <LandingSectionShell
      id="workflow"
      className="relative overflow-hidden border-b border-border bg-(image:--gradient-workflow-surface) py-16 md:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-prism-teal-500/60 to-transparent" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <LandingSectionIntro {...LANDING_PRODUCT_PREVIEW_INTRO} />
        <div className="grid w-full max-w-md grid-cols-3 gap-3 lg:w-auto">
          {PREVIEW_METRICS.map(metric => (
            <div
              key={metric.label}
              className="rounded-3xl border border-border bg-white/72 p-4 shadow-[0_14px_40px_rgba(12,71,103,0.06)]"
            >
              <Typography
                variant="caption"
                tone="muted"
                weight="medium"
              >
                {metric.label}
              </Typography>
              <Typography
                variant="h3"
                tone="inherit"
                className="mt-1 text-prism-navy"
              >
                {metric.value}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-10 md:mt-14">
        <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_55%_30%,rgba(99,178,255,0.16),transparent_55%),radial-gradient(circle_at_18%_18%,rgba(255,107,198,0.08),transparent_32%)] blur-2xl" />
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface-strong/92 p-2 shadow-2xl shadow-prism-navy/12 backdrop-blur sm:p-3">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(255,241,168,0.22),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(157,123,255,0.1),transparent_26%)]" />
          <div className="relative overflow-hidden rounded-[1.5rem] border border-border/70 bg-surface-strong">
            <BoardHeader />
            <div className="border-t border-border/70 bg-background p-3 sm:p-4">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                {LANDING_PRODUCT_BOARD.map(column => (
                  <PreviewColumn
                    key={column.status}
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

function BoardHeader() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
      <div>
        <div className="flex items-center gap-2">
          <LayoutDashboard
            className="size-5 text-prism-muted"
            aria-hidden
          />
          <Typography
            variant="h3"
            tone="primary"
            className="text-xl tracking-normal"
          >
            Dashboard
          </Typography>
        </div>
        <Typography
          variant="bodySm"
          tone="muted"
          className="mt-1"
        >
          Review top-level work items by status.
        </Typography>
      </div>

      <div
        className="flex items-center gap-2"
        aria-hidden
      >
        <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-4 text-sm font-medium text-prism-body">
          <CheckSquare className="size-4" />
          Select
        </span>
        <span className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Plus className="size-4" />
          New work item
        </span>
      </div>
    </div>
  );
}

function PreviewColumn({ column }: { column: LandingProductBoardColumn }) {
  return (
    <section className="flex flex-col rounded-2xl border border-border/80 bg-surface-strong">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={cn("size-2 shrink-0 rounded-full", STATUS_HEADER_DOT[column.status])}
            aria-hidden
          />
          <Typography
            as="h3"
            variant="bodySm"
            tone="primary"
            weight="semibold"
          >
            {STATUS_LABELS[column.status]}
          </Typography>
        </div>
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-prism-navy/5 px-2 text-xs font-medium text-prism-muted">
          {column.items.length}
        </span>
      </div>

      <div className="grid gap-3 p-3">
        {column.items.map(item => (
          <PreviewCard
            key={item.code}
            item={item}
            status={column.status}
          />
        ))}
      </div>
    </section>
  );
}

function PreviewCard({ item, status }: { item: LandingProductBoardItem; status: LandingBoardStatus }) {
  return (
    <article className="rounded-xl border border-border/80 bg-surface p-3 shadow-[0_1px_0_rgba(255,255,255,0.65)_inset]">
      <Typography
        as="span"
        variant="code"
        tone="muted"
        className="shrink-0 text-[11px] leading-none"
      >
        {item.code}
      </Typography>
      <Typography
        variant="bodySm"
        tone="primary"
        weight="semibold"
        className="mt-1.5 line-clamp-2"
      >
        {item.title}
      </Typography>
      <Typography
        variant="caption"
        tone="muted"
        className="mt-1.5 line-clamp-3"
      >
        {item.description}
      </Typography>

      {item.schedule && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-prism-muted">
          <CalendarDays className="size-3.5 shrink-0" />
          <span>{item.schedule}</span>
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StatusBadge status={status} />
        <PriorityBadge priority={item.priority} />
      </div>

      {item.assignees.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <UserAvatarStack
            users={item.assignees.map(assignee => ({ id: assignee.id, name: assignee.name }))}
            avatarClassName="size-6 text-[10px]"
          />
        </div>
      )}
    </article>
  );
}

function StatusBadge({ status }: { status: LandingBoardStatus }) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface-strong px-2.5 text-xs font-medium text-prism-body">
      <span
        className={cn("size-2 shrink-0 rounded-full", STATUS_BADGE_DOT[status])}
        aria-hidden
      />
      {STATUS_LABELS[status]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: LandingBoardPriority }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium",
        PRIORITY_BADGE_CLASS[priority],
      )}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
