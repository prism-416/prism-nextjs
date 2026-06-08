import { Skeleton } from "@/atomics/atoms/Skeleton";
import { WorkspaceSkeletonCard } from "@/domains/workspaces/components/list/WorkspaceSkeletonCard";

export function WorkspacesSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Skeleton className="h-7 w-32 rounded-md bg-prism-navy/5" />
            <Skeleton className="mt-2 h-4 w-full max-w-sm rounded-md bg-prism-navy/5" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[74px] rounded-lg bg-prism-navy/5" />
            <Skeleton className="h-10 w-40 rounded-lg bg-prism-navy/5" />
          </div>
        </div>
        <Skeleton className="h-10 w-full rounded-lg bg-prism-navy/5 lg:max-w-sm" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <WorkspaceSkeletonCard key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
