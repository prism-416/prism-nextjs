import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProjectAgentSkeleton() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="flex flex-col gap-5">
        <div>
          <Skeleton className="h-7 w-36 bg-prism-navy/5" />
          <Skeleton className="mt-2 h-4 w-80 bg-prism-navy/5" />
        </div>

        <div className="rounded-xl border border-border/80 bg-surface p-4">
          <Skeleton className="h-5 w-44 bg-prism-navy/5" />
          <Skeleton className="mt-3 h-4 w-72 bg-prism-navy/5" />
          <Skeleton className="mt-4 h-40 w-full rounded-lg bg-prism-navy/5" />
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
            className="rounded-xl border border-border/80 bg-surface p-4"
          >
            <Skeleton className="h-5 w-32 bg-prism-navy/5" />
            <Skeleton className="mt-3 h-4 w-full bg-prism-navy/5" />
            <Skeleton className="mt-2 h-4 w-10/12 bg-prism-navy/5" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-24 bg-prism-navy/5" />
              <Skeleton className="h-4 w-20 bg-prism-navy/5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
