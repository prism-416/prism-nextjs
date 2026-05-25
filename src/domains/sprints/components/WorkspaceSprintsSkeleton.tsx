import { Skeleton } from "@/atomics/atoms/Skeleton";

export function WorkspaceSprintsSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-7 w-36 bg-prism-navy/5" />
          <Skeleton className="mt-2 h-4 w-80 bg-prism-navy/5" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg bg-prism-navy/5" />
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-60 rounded-2xl bg-prism-navy/5"
          />
        ))}
      </div>
    </section>
  );
}
