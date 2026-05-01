import { Skeleton } from "@/atomics/atoms/Skeleton";

export function WorkspaceMembersSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div>
        <Skeleton className="h-7 w-40 bg-prism-navy/5" />
        <Skeleton className="mt-2 h-4 w-72 bg-prism-navy/5" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-b border-border/60 px-5 py-4 last:border-b-0"
          >
            <Skeleton className="size-10 rounded-full bg-prism-navy/5" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-36 bg-prism-navy/5" />
              <Skeleton className="mt-2 h-3 w-24 bg-prism-navy/5" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full bg-prism-navy/5" />
          </div>
        ))}
      </div>
    </section>
  );
}
