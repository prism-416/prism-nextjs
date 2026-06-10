import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProjectAgentSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-[96rem] flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-48 bg-prism-navy/5" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl bg-prism-navy/5" />
      </div>

      <div className="grid w-full gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(22rem,0.85fr)]">
        <div className="rounded-xl border border-border/80 bg-surface p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Skeleton className="h-6 w-44 bg-prism-navy/5" />
              <Skeleton className="mt-2 h-4 w-full max-w-md bg-prism-navy/5" />
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Skeleton className="h-8 w-20 rounded-full bg-prism-navy/5" />
              <Skeleton className="h-8 w-24 rounded-full bg-prism-navy/5" />
              <Skeleton className="h-9 w-24 rounded-lg bg-prism-navy/5" />
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-border/80 bg-surface p-5"
              >
                <Skeleton className="h-5 w-36 bg-prism-navy/5" />
                <Skeleton className="mt-3 h-4 w-full bg-prism-navy/5" />
                <Skeleton className="mt-2 h-4 w-10/12 bg-prism-navy/5" />
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Skeleton className="h-4 w-24 bg-prism-navy/5" />
                  <Skeleton className="h-4 w-20 bg-prism-navy/5" />
                  <Skeleton className="h-4 w-28 bg-prism-navy/5" />
                </div>
                <div className="mt-5 rounded-xl border border-border bg-surface-field-soft p-4">
                  {Array.from({ length: 4 }).map((_, stepIndex) => (
                    <div
                      key={stepIndex}
                      className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 py-2.5"
                    >
                      <Skeleton className="size-10 rounded-full bg-prism-navy/5" />
                      <div>
                        <Skeleton className="h-4 w-64 max-w-full bg-prism-navy/5" />
                        <Skeleton className="mt-2 h-3 w-40 max-w-full bg-prism-navy/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-surface p-5">
          <Skeleton className="h-5 w-40 bg-prism-navy/5" />
          <Skeleton className="mt-3 h-4 w-72 max-w-full bg-prism-navy/5" />
          <Skeleton className="mt-4 h-96 w-full rounded-lg bg-prism-navy/5" />
          <div className="mt-3 flex justify-end">
            <Skeleton className="h-10 w-40 rounded-lg bg-prism-navy/5" />
          </div>
        </div>
      </div>
    </section>
  );
}
