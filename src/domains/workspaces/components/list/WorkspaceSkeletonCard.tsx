import { Skeleton } from "@/atomics/atoms/Skeleton";

export function WorkspaceSkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/70 bg-surface p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="size-11 shrink-0 rounded-xl bg-prism-navy/5" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3 bg-prism-navy/5" />
          <Skeleton className="h-3 w-1/3 bg-prism-navy/5" />
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <Skeleton className="h-3 w-20 bg-prism-navy/5" />
        <Skeleton className="h-3 w-20 bg-prism-navy/5" />
      </div>
      <Skeleton className="mt-5 h-10 bg-prism-navy/5" />
      <Skeleton className="mt-5 h-3 w-1/2 bg-prism-navy/5" />
    </div>
  );
}
