import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProjectAgentSkeleton() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-5 xl:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.25fr)]">
      <div className="flex flex-col gap-5">
        <div>
          <Skeleton className="h-7 w-36 bg-prism-navy/5" />
          <Skeleton className="mt-2 h-4 w-80 bg-prism-navy/5" />
        </div>

        <div className="rounded-lg border border-border/80 bg-surface p-4">
          <Skeleton className="h-5 w-44 bg-prism-navy/5" />
          <Skeleton className="mt-3 h-4 w-72 bg-prism-navy/5" />
          <Skeleton className="mt-4 h-72 w-full rounded-lg bg-prism-navy/5" />
          <div className="mt-3 flex justify-end">
            <Skeleton className="h-10 w-40 rounded-lg bg-prism-navy/5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36 bg-prism-navy/5" />
          <Skeleton className="h-9 w-24 rounded-lg bg-prism-navy/5" />
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-border/80 bg-surface p-4"
          >
            <Skeleton className="h-5 w-32 bg-prism-navy/5" />
            <Skeleton className="mt-3 h-4 w-full bg-prism-navy/5" />
            <Skeleton className="mt-2 h-4 w-10/12 bg-prism-navy/5" />
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <Skeleton className="h-4 w-24 bg-prism-navy/5" />
              <Skeleton className="h-4 w-20 bg-prism-navy/5" />
              <Skeleton className="h-4 w-28 bg-prism-navy/5" />
            </div>
            <div className="mt-4 rounded-lg border border-border bg-surface-field-soft p-3">
              {Array.from({ length: 4 }).map((_, stepIndex) => (
                <div
                  key={stepIndex}
                  className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 py-2"
                >
                  <Skeleton className="size-8 rounded-full bg-prism-navy/5" />
                  <div>
                    <Skeleton className="h-4 w-56 max-w-full bg-prism-navy/5" />
                    <Skeleton className="mt-2 h-3 w-40 max-w-full bg-prism-navy/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
