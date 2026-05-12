import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProjectSprintSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="rounded-2xl border border-border/80 bg-surface p-5">
        <Skeleton className="h-5 w-28 bg-prism-navy/5" />
        <Skeleton className="mt-4 h-8 w-64 bg-prism-navy/5" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl bg-prism-navy/5" />
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-20 rounded-xl bg-prism-navy/5" />
          <Skeleton className="h-20 rounded-xl bg-prism-navy/5" />
          <Skeleton className="h-20 rounded-xl bg-prism-navy/5" />
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-surface">
        <div className="border-b border-border/70 px-4 py-3">
          <Skeleton className="h-5 w-36 bg-prism-navy/5" />
        </div>
        <div className="divide-y divide-border/70">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="p-4"
            >
              <Skeleton className="h-5 w-56 bg-prism-navy/5" />
              <Skeleton className="mt-2 h-4 w-full bg-prism-navy/5" />
              <Skeleton className="mt-2 h-4 w-8/12 bg-prism-navy/5" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-7 w-20 rounded-full bg-prism-navy/5" />
                <Skeleton className="h-7 w-20 rounded-full bg-prism-navy/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
