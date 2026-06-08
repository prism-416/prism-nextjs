import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProjectsSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-7 w-24 rounded-md bg-prism-navy/5" />
          <Skeleton className="mt-2 h-4 w-full max-w-sm rounded-md bg-prism-navy/5" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[74px] rounded-lg bg-prism-navy/5" />
          <Skeleton className="h-10 w-36 rounded-lg bg-prism-navy/5" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-lg bg-prism-navy/5 lg:max-w-sm" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            className="overflow-hidden rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]"
            key={index}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Skeleton className="size-11 rounded-xl bg-prism-navy/5" />
                <div>
                  <Skeleton className="h-5 w-32 bg-prism-navy/5" />
                  <Skeleton className="mt-2 h-3 w-20 bg-prism-navy/5" />
                </div>
              </div>
              <Skeleton className="size-9 rounded-full bg-prism-navy/5" />
            </div>
            <div className="mt-3 flex items-center gap-4">
              <Skeleton className="h-5 w-16 bg-prism-navy/5" />
              <Skeleton className="h-5 w-14 bg-prism-navy/5" />
            </div>
            <Skeleton className="mt-4 h-4 w-full bg-prism-navy/5" />
            <Skeleton className="mt-2 h-4 w-11/12 bg-prism-navy/5" />
            <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
              <Skeleton className="h-4 w-16 bg-prism-navy/5" />
              <Skeleton className="h-4 w-24 bg-prism-navy/5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
