import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProjectWorkItemSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="rounded-2xl border border-border/80 bg-surface p-5">
        <Skeleton className="h-5 w-32 bg-prism-navy/5" />
        <Skeleton className="mt-4 h-8 w-72 bg-prism-navy/5" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl bg-prism-navy/5" />
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-20 rounded-xl bg-prism-navy/5" />
          <Skeleton className="h-20 rounded-xl bg-prism-navy/5" />
          <Skeleton className="h-20 rounded-xl bg-prism-navy/5" />
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-surface">
        <div className="flex items-center justify-between gap-2 border-b border-border/70 px-4 py-3">
          <Skeleton className="h-5 w-36 bg-prism-navy/5" />
          <Skeleton className="h-9 w-36 rounded-lg bg-prism-navy/5" />
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/80 bg-surface p-3"
            >
              <Skeleton className="h-5 w-40 bg-prism-navy/5" />
              <Skeleton className="mt-2 h-4 w-full bg-prism-navy/5" />
              <Skeleton className="mt-2 h-4 w-8/12 bg-prism-navy/5" />
              <Skeleton className="mt-4 h-7 w-20 rounded-full bg-prism-navy/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
