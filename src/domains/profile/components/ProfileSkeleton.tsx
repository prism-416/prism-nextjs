import { Skeleton } from "@/atomics/atoms/Skeleton";

export function ProfileSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)] sm:flex-row sm:items-center">
        <Skeleton className="size-20 rounded-full bg-prism-navy/10" />
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-7 w-48 rounded-lg bg-prism-navy/10" />
          <Skeleton className="h-4 w-36 rounded-lg bg-prism-navy/10" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border/80 bg-surface p-4"
          >
            <Skeleton className="h-4 w-20 rounded-lg bg-prism-navy/10" />
            <Skeleton className="mt-3 h-5 w-44 rounded-lg bg-prism-navy/10" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-6 w-28 rounded-lg bg-prism-navy/10" />
            <Skeleton className="h-4 w-52 rounded-lg bg-prism-navy/10" />
          </div>
          <Skeleton className="size-10 rounded-full bg-prism-navy/10" />
        </div>
        <div className="mt-5 grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="space-y-2"
            >
              <Skeleton className="h-4 w-32 rounded-lg bg-prism-navy/10" />
              <Skeleton className="h-11 w-full rounded-xl bg-prism-navy/10" />
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <Skeleton className="h-10 w-36 rounded-lg bg-prism-navy/10" />
        </div>
      </div>
    </section>
  );
}
