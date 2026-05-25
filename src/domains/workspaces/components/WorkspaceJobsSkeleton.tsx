import { Skeleton } from "@/atomics/atoms/Skeleton";

export function WorkspaceJobsSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-7 w-52 bg-prism-navy/5" />
          <Skeleton className="mt-2 h-4 w-80 bg-prism-navy/5" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-lg bg-prism-navy/5" />
          <Skeleton className="h-10 w-32 rounded-lg bg-prism-navy/5" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/80 bg-surface">
        <div className="hidden h-9 grid-cols-[minmax(10rem,14rem)_minmax(0,1fr)_6.5rem] items-center gap-3 border-b border-border/70 bg-surface-strong px-3 md:grid">
          <Skeleton className="h-3 w-12 bg-prism-navy/5" />
          <Skeleton className="h-3 w-24 bg-prism-navy/5" />
          <Skeleton className="ml-auto h-3 w-10 bg-prism-navy/5" />
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="grid gap-2 border-b border-border/70 px-3 py-2.5 last:border-b-0 md:grid-cols-[minmax(10rem,14rem)_minmax(0,1fr)_6.5rem] md:items-center md:gap-3"
          >
            <Skeleton className="h-10 w-full bg-prism-navy/5" />
            <Skeleton className="h-10 w-full bg-prism-navy/5" />
            <Skeleton className="h-7 w-16 rounded-full bg-prism-navy/5" />
          </div>
        ))}
      </div>
    </section>
  );
}
