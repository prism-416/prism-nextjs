import { Skeleton } from "@/atomics/atoms/Skeleton";
import MainLayout from "@/atomics/templates/MainLayout";
import { AppHeader } from "@/domains/workspace/components/AppHeader";
import { AppSidebar } from "@/domains/workspace/components/AppSidebar";
import { WorkspaceSkeletonCard } from "@/domains/workspace/components/list/WorkspaceSkeletonCard";

export function WorkspaceSkeleton() {
  return (
    <MainLayout
      header={<AppHeader workspace={{ name: "Workspace" }} />}
      sidebar={<AppSidebar />}
      contentClassName="bg-background"
    >
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
    </MainLayout>
  );
}
