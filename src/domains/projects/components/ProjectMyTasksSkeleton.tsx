import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProjectMyTasksSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-7 w-40 bg-prism-navy/5" />
          <Skeleton className="mt-2 h-4 w-80 bg-prism-navy/5" />
        </div>
        <Skeleton className="h-7 w-28 rounded-full bg-prism-navy/5" />
      </div>

      <div className="rounded-xl border border-border/80 bg-surface p-3">
        <Skeleton className="h-10 w-full rounded-lg bg-prism-navy/5" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Skeleton className="h-8 w-16 rounded-lg bg-prism-navy/5" />
          <Skeleton className="h-8 w-24 rounded-lg bg-prism-navy/5" />
          <Skeleton className="h-8 w-20 rounded-lg bg-prism-navy/5" />
          <Skeleton className="h-8 w-24 rounded-lg bg-prism-navy/5" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface">
        <div className="hidden h-9 grid-cols-[minmax(0,1fr)_8rem_8rem_8rem] items-center gap-3 border-b border-border/70 bg-surface-strong px-4 md:grid">
          <Skeleton className="h-3 w-16 bg-prism-navy/5" />
          <Skeleton className="h-3 w-14 bg-prism-navy/5" />
          <Skeleton className="h-3 w-16 bg-prism-navy/5" />
          <Skeleton className="h-3 w-12 bg-prism-navy/5" />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="grid gap-3 border-b border-border/70 px-4 py-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_8rem_8rem_8rem] md:items-center"
          >
            <div>
              <Skeleton className="h-5 w-48 bg-prism-navy/5" />
              <Skeleton className="mt-2 h-4 w-full bg-prism-navy/5" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full bg-prism-navy/5" />
            <Skeleton className="h-7 w-20 rounded-full bg-prism-navy/5" />
            <Skeleton className="h-4 w-20 bg-prism-navy/5" />
          </div>
        ))}
      </div>
    </section>
  );
}
