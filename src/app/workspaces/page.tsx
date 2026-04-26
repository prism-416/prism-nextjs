import { Suspense } from "react";
import type { Metadata } from "next";

import { WorkspaceContent } from "@/domains/workspace/components/WorkspaceContent";
import { WorkspaceSkeleton } from "@/domains/workspace/components/WorkspaceSkeleton";

export const metadata: Metadata = {
  title: "Workspaces",
};

export default function WorkspacesPage() {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <WorkspaceContent />
    </Suspense>
  );
}
