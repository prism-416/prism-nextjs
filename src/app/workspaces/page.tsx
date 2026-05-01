import { Suspense } from "react";
import type { Metadata } from "next";

import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";
import { WorkspacesContent } from "@/domains/workspaces/components/WorkspacesContent";
import { WorkspacesSkeleton } from "@/domains/workspaces/components/WorkspacesSkeleton";

export const metadata: Metadata = {
  title: "Workspaces",
};

export default function WorkspacesPage() {
  return (
    <WorkspaceShell
      workspace={{ name: "Workspaces", href: "/workspaces" }}
      contentClassName="bg-background"
    >
      <Suspense fallback={<WorkspacesSkeleton />}>
        <WorkspacesContent />
      </Suspense>
    </WorkspaceShell>
  );
}
