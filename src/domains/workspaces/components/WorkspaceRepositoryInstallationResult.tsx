"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Github, GitBranch, LoaderCircle, TriangleAlert } from "lucide-react";

import { Badge } from "@/atomics/atoms/Badge";
import { Button } from "@/atomics/atoms/Button";
import { Skeleton } from "@/atomics/atoms/Skeleton";
import { useConnectWorkspaceRepository } from "@/domains/workspaces/hooks/useConnectWorkspaceRepository";
import { useGithubInstallationRepositories } from "@/domains/workspaces/hooks/useGithubInstallationRepositories";
import { useWorkspaceById } from "@/domains/workspaces/hooks/useWorkspaceById";
import { getWorkspaceMutationErrorMessage } from "@/domains/workspaces/utils/error";
import {
  isGithubInstallationWindow,
  notifyRepositoryConnected,
} from "@/domains/workspaces/utils/github-installation-window";

type WorkspaceRepositoryInstallationResultProps = {
  workspaceId?: string;
  installationId?: string;
  setupAction?: string;
  providerError?: string;
  providerErrorDescription?: string;
};

function getRepositoryVisibilityLabel(visibility: string | null) {
  if (visibility === "private") {
    return "Private";
  }

  if (visibility === "internal") {
    return "Internal";
  }

  return "Public";
}

function ResultShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-prism-body">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center">
        <div className="w-full overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_16px_40px_rgba(12,71,103,0.08)]">
          {children}
        </div>
      </section>
    </main>
  );
}

function ResultHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-b border-border/60 px-6 py-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-prism-teal-500/10 text-prism-teal-700">
          <Github className="size-5" />
        </span>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-prism-heading">{title}</h1>
          <p className="mt-1 text-sm text-prism-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}

function InvalidResult({
  title,
  description,
  workspaceHref,
}: {
  title: string;
  description: string;
  workspaceHref?: string;
}) {
  return (
    <ResultShell>
      <ResultHeader
        title={title}
        description={description}
      />
      <div className="flex flex-col gap-4 px-6 py-6">
        <div className="flex items-start gap-3 rounded-lg border border-[#DC2626]/20 bg-[#DC2626]/5 px-4 py-3 text-sm text-prism-danger">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{description}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {workspaceHref ? (
            <Button
              asChild
              className="h-10 rounded-lg"
            >
              <Link href={workspaceHref}>Return to workspace settings</Link>
            </Button>
          ) : null}
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-lg"
          >
            <Link href="/workspaces">Go to workspaces</Link>
          </Button>
        </div>
      </div>
    </ResultShell>
  );
}

export function WorkspaceRepositoryInstallationResult({
  workspaceId,
  installationId,
  setupAction,
  providerError,
  providerErrorDescription,
}: WorkspaceRepositoryInstallationResultProps) {
  const router = useRouter();
  const [selectedRepositoryId, setSelectedRepositoryId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: workspace, isLoading: isWorkspaceLoading } = useWorkspaceById(workspaceId ?? null);
  const { data: repositories = [], isLoading: isRepositoriesLoading } = useGithubInstallationRepositories(
    workspaceId ?? null,
    installationId ?? null,
  );
  const { mutateAsync: connectRepository, isPending: isConnecting } = useConnectWorkspaceRepository();
  const workspaceSettingsHref = workspace ? `/workspaces/${encodeURIComponent(workspace.slug)}/settings` : undefined;
  const selectableRepositories = useMemo(() => repositories.filter(repository => !repository.archived), [repositories]);
  const activeRepositoryId = selectedRepositoryId || selectableRepositories[0]?.githubRepositoryId || "";
  const selectedRepository = selectableRepositories.find(
    repository => repository.githubRepositoryId === activeRepositoryId,
  );

  if (providerError) {
    return (
      <InvalidResult
        title="GitHub connection failed"
        description={providerErrorDescription || providerError}
        workspaceHref={workspaceSettingsHref}
      />
    );
  }

  if (!workspaceId || !installationId) {
    return (
      <InvalidResult
        title="GitHub connection failed"
        description="The GitHub installation callback is missing required workspace information."
        workspaceHref={workspaceSettingsHref}
      />
    );
  }

  const isLoading = isWorkspaceLoading || isRepositoriesLoading;

  const handleConnect = async () => {
    if (!workspaceId || !installationId || !activeRepositoryId) {
      return;
    }

    setErrorMessage(null);

    try {
      await connectRepository({
        workspaceId,
        payload: {
          githubInstallationId: installationId,
          githubRepositoryId: activeRepositoryId,
        },
      });

      if (isGithubInstallationWindow()) {
        notifyRepositoryConnected(workspaceId);
        window.close();
        return;
      }

      if (workspaceSettingsHref) {
        router.replace(workspaceSettingsHref);
      } else {
        router.replace("/workspaces");
      }
    } catch (error) {
      setErrorMessage(getWorkspaceMutationErrorMessage(error, "Failed to connect GitHub repository."));
    }
  };

  return (
    <ResultShell>
      <ResultHeader
        title="Connect GitHub repository"
        description={
          setupAction === "update"
            ? "Select a repository from the updated installation."
            : "Select a repository for this workspace."
        }
      />

      <div className="space-y-5 px-6 py-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : selectableRepositories.length > 0 ? (
          <>
            <label className="block">
              <span className="text-sm font-medium text-prism-heading">Repository</span>
              <select
                value={activeRepositoryId}
                onChange={event => {
                  setSelectedRepositoryId(event.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="mt-2 h-11 w-full rounded-lg border border-border/80 bg-background px-3 text-sm text-prism-heading outline-none ring-offset-background transition focus:border-prism-teal-500 focus:ring-2 focus:ring-prism-teal-500/20"
              >
                {selectableRepositories.map(repository => (
                  <option
                    key={repository.githubRepositoryId}
                    value={repository.githubRepositoryId}
                  >
                    {repository.fullName}
                  </option>
                ))}
              </select>
            </label>

            {selectedRepository ? (
              <div className="rounded-lg border border-border/70 bg-background px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Github className="size-4 shrink-0 text-prism-muted" />
                  <span className="truncate text-sm font-semibold text-prism-heading">
                    {selectedRepository.fullName}
                  </span>
                  <Badge size="sm">{getRepositoryVisibilityLabel(selectedRepository.visibility)}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-prism-muted">
                  {selectedRepository.defaultBranch ? (
                    <span className="inline-flex items-center gap-1.5">
                      <GitBranch className="size-3.5" />
                      {selectedRepository.defaultBranch}
                    </span>
                  ) : null}
                  <span>{selectedRepository.private ? "Private access granted" : "Public repository"}</span>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-background px-4 py-3 text-sm text-prism-muted">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <span>No selectable repositories were returned from this GitHub installation.</span>
          </div>
        )}

        {errorMessage ? <p className="text-sm text-prism-danger">{errorMessage}</p> : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            asChild
            variant="ghost"
            className="h-10 rounded-lg"
          >
            <Link href={workspaceSettingsHref ?? "/workspaces"}>Cancel</Link>
          </Button>
          <Button
            type="button"
            className="h-10 rounded-lg px-5"
            disabled={!activeRepositoryId || isConnecting || selectableRepositories.length === 0}
            onClick={() => {
              void handleConnect();
            }}
          >
            {isConnecting ? <LoaderCircle className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
            {isConnecting ? "Connecting..." : "Connect repository"}
          </Button>
        </div>
      </div>
    </ResultShell>
  );
}
