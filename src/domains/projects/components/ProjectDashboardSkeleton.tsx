import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProjectDashboardSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-7 w-40 bg-prism-navy/5" />
          <Skeleton className="mt-2 h-4 w-80 bg-prism-navy/5" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg bg-prism-navy/5" />
      </div>

      <div className="grid min-w-[72rem] gap-4 overflow-hidden lg:min-w-0 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, columnIndex) => (
          <div
            key={columnIndex}
            className="min-h-72 rounded-2xl border border-border/80 bg-surface-strong"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <Skeleton className="h-5 w-24 bg-prism-navy/5" />
              <Skeleton className="h-6 w-8 rounded-full bg-prism-navy/5" />
            </div>
            <div className="grid gap-3 p-3">
              {Array.from({ length: 2 }).map((_, itemIndex) => (
                <div
                  key={itemIndex}
                  className="rounded-xl border border-border/80 bg-surface p-3"
                >
                  <Skeleton className="h-5 w-36 bg-prism-navy/5" />
                  <Skeleton className="mt-2 h-4 w-full bg-prism-navy/5" />
                  <Skeleton className="mt-2 h-4 w-8/12 bg-prism-navy/5" />
                  <Skeleton className="mt-4 h-4 w-32 bg-prism-navy/5" />
                  <Skeleton className="mt-3 h-7 w-20 rounded-full bg-prism-navy/5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
