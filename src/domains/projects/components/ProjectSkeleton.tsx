import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProjectSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface p-6 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="size-14 rounded-2xl bg-prism-navy/5" />
            <div>
              <Skeleton className="h-7 w-48 bg-prism-navy/5" />
              <Skeleton className="mt-2 h-4 w-28 bg-prism-navy/5" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-lg bg-prism-navy/5" />
        </div>
        <Skeleton className="mt-6 h-4 w-full bg-prism-navy/5" />
        <Skeleton className="mt-2 h-4 w-10/12 bg-prism-navy/5" />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-20 rounded-xl bg-prism-navy/5" />
          <Skeleton className="h-20 rounded-xl bg-prism-navy/5" />
          <Skeleton className="h-20 rounded-xl bg-prism-navy/5" />
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-2xl border border-border/80 bg-surface p-5">
          <Skeleton className="h-5 w-36 bg-prism-navy/5" />
          <Skeleton className="mt-5 h-4 w-full bg-prism-navy/5" />
          <Skeleton className="mt-3 h-4 w-11/12 bg-prism-navy/5" />
          <Skeleton className="mt-3 h-4 w-9/12 bg-prism-navy/5" />
        </div>
        <div className="rounded-2xl border border-border/80 bg-surface p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Skeleton className="h-5 w-28 bg-prism-navy/5" />
              <Skeleton className="mt-2 h-4 w-72 bg-prism-navy/5" />
            </div>
            <Skeleton className="h-7 w-20 rounded-full bg-prism-navy/5" />
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.2fr)]">
            <div className="rounded-xl border border-border/70 bg-surface-strong p-4">
              <Skeleton className="h-4 w-24 bg-prism-navy/5" />
              <Skeleton className="mt-4 h-10 rounded-lg bg-prism-navy/5" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-12 rounded-lg bg-prism-navy/5" />
                <Skeleton className="h-12 rounded-lg bg-prism-navy/5" />
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-surface p-4">
              <div className="space-y-3">
                <Skeleton className="h-20 rounded-xl bg-prism-navy/5" />
                <Skeleton className="h-20 rounded-xl bg-prism-navy/5" />
                <Skeleton className="h-20 rounded-xl bg-prism-navy/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
