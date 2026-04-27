import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProjectsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          className="rounded-xl border border-border/80 bg-surface p-5"
          key={index}
        >
          <Skeleton className="h-5 w-2/3 bg-prism-navy/5" />
          <Skeleton className="mt-3 h-4 w-full bg-prism-navy/5" />
          <Skeleton className="mt-2 h-4 w-4/5 bg-prism-navy/5" />
        </div>
      ))}
    </div>
  );
}
