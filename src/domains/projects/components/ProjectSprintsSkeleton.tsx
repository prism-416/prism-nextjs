import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProjectSprintsSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-7 w-36 bg-prism-navy/5" />
          <Skeleton className="mt-2 h-4 w-80 bg-prism-navy/5" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg bg-prism-navy/5" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, columnIndex) => (
          <div
            key={columnIndex}
            className="rounded-2xl border border-border/80 bg-surface"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <Skeleton className="h-5 w-24 bg-prism-navy/5" />
              <Skeleton className="h-6 w-8 rounded-full bg-prism-navy/5" />
            </div>
            <div className="divide-y divide-border/70">
              {Array.from({ length: 2 }).map((_, itemIndex) => (
                <div
                  key={itemIndex}
                  className="p-4"
                >
                  <Skeleton className="h-5 w-32 bg-prism-navy/5" />
                  <Skeleton className="mt-2 h-4 w-full bg-prism-navy/5" />
                  <Skeleton className="mt-2 h-4 w-8/12 bg-prism-navy/5" />
                  <Skeleton className="mt-4 h-7 w-28 rounded-full bg-prism-navy/5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
