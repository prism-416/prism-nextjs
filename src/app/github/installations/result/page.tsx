import type { Metadata } from "next";

import { WorkspaceRepositoryInstallationResult } from "@/domains/workspaces/components/WorkspaceRepositoryInstallationResult";

export const metadata: Metadata = {
  title: "GitHub Repository Connection",
};

type GithubInstallationResultPageProps = {
  searchParams: Promise<{
    workspaceId?: string | string[];
    installationId?: string | string[];
    setupAction?: string | string[];
    error?: string | string[];
    error_description?: string | string[];
  }>;
};

function resolveSearchParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
}

export default async function GithubInstallationResultPage({ searchParams }: GithubInstallationResultPageProps) {
  const params = await searchParams;

  return (
    <WorkspaceRepositoryInstallationResult
      workspaceId={resolveSearchParam(params.workspaceId)}
      installationId={resolveSearchParam(params.installationId)}
      setupAction={resolveSearchParam(params.setupAction)}
      providerError={resolveSearchParam(params.error)}
      providerErrorDescription={resolveSearchParam(params.error_description)}
    />
  );
}
