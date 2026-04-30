import { Suspense } from "react";
import type { Metadata } from "next";

import { WorkspaceInvitationContent } from "@/domains/workspaces/components/WorkspaceInvitationContent";
import { WorkspaceInvitationSkeleton } from "@/domains/workspaces/components/WorkspaceInvitationSkeleton";

export const metadata: Metadata = {
  title: "Workspace Invitation",
};

type AcceptWorkspaceInvitationPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

function resolveToken(token: string | string[] | undefined) {
  const value = Array.isArray(token) ? token[0] : token;
  return value?.trim() || undefined;
}

export default async function AcceptWorkspaceInvitationPage({ searchParams }: AcceptWorkspaceInvitationPageProps) {
  const { token } = await searchParams;

  return (
    <Suspense fallback={<WorkspaceInvitationSkeleton />}>
      <WorkspaceInvitationContent token={resolveToken(token)} />
    </Suspense>
  );
}
