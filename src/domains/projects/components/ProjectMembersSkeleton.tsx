import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProjectMembersSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="rounded-2xl border border-border/80 bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Skeleton className="size-9 rounded-lg bg-prism-navy/5" />
            <div>
              <Skeleton className="h-5 w-24 bg-prism-navy/5" />
              <Skeleton className="mt-2 h-4 w-72 bg-prism-navy/5" />
            </div>
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
    </section>
  );
}
