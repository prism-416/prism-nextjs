import { Skeleton } from "@/atomics/atoms/Skeleton";
import { WorkspaceInvitationShell } from "@/domains/workspaces/components/invitation/WorkspaceInvitationLayout";

export function WorkspaceInvitationSkeleton() {
  return (
    <WorkspaceInvitationShell>
      <Skeleton className="size-12 rounded-full bg-prism-navy/5" />
      <Skeleton className="h-7 w-64 max-w-full bg-prism-navy/5" />
      <Skeleton className="h-4 w-80 max-w-full bg-prism-navy/5" />
      <div className="mt-2 flex gap-2">
        <Skeleton className="h-10 w-20 bg-prism-navy/5" />
        <Skeleton className="h-10 w-20 bg-prism-navy/5" />
      </div>
    </WorkspaceInvitationShell>
  );
}
