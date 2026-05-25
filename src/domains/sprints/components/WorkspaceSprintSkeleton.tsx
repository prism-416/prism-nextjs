import { Skeleton } from "@/atomics/atoms/Skeleton";

export function WorkspaceSprintSkeleton() {
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
      <Skeleton className="h-72 rounded-2xl bg-prism-navy/5" />
    </section>
  );
}
