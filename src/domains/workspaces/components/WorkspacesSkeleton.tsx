import { Skeleton } from "@/atomics/atoms/Skeleton";
import { WorkspaceSkeletonCard } from "@/domains/workspaces/components/list/WorkspaceSkeletonCard";

export function WorkspacesSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Skeleton className="h-10 min-w-[220px] flex-1 rounded-lg bg-prism-navy/5 lg:max-w-sm" />
            <Skeleton className="h-10 w-20 rounded-lg bg-prism-navy/5" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[74px] rounded-lg bg-prism-navy/5" />
            <Skeleton className="h-10 w-40 rounded-lg bg-prism-navy/5" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <WorkspaceSkeletonCard key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
