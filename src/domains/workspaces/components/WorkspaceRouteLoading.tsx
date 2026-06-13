import { Skeleton } from "@/atomics/atoms/Skeleton";

export function WorkspaceRouteLoading() {
  return (
    <section
      className="mx-auto flex w-full max-w-6xl flex-col gap-5"
      aria-label="Loading page"
      aria-busy="true"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-7 w-40 bg-prism-navy/5" />
          <Skeleton className="mt-2 h-4 w-80 max-w-full bg-prism-navy/5" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg bg-prism-navy/5" />
      </div>

      <div className="overflow-hidden rounded-lg border border-border/80 bg-surface">
        <div className="border-b border-border/70 bg-surface-strong px-4 py-3">
          <Skeleton className="h-4 w-32 bg-prism-navy/5" />
        </div>
        <div className="divide-y divide-border/60">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_8rem_7rem] sm:items-center"
            >
              <div>
                <Skeleton className="h-5 w-48 max-w-full bg-prism-navy/5" />
                <Skeleton className="mt-2 h-4 w-full max-w-md bg-prism-navy/5" />
              </div>
              <Skeleton className="h-7 w-24 rounded-full bg-prism-navy/5" />
              <Skeleton className="h-4 w-20 bg-prism-navy/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
