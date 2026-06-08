"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Github, GitBranch, LoaderCircle, TriangleAlert } from "lucide-react";

import { Badge } from "@/atomics/atoms/Badge";
import { Button } from "@/atomics/atoms/Button";
import { Skeleton } from "@/atomics/atoms/Skeleton";
import { useConnectWorkspaceRepository } from "@/domains/workspaces/hooks/useConnectWorkspaceRepository";
import { useGithubInstallationRepositories } from "@/domains/workspaces/hooks/useGithubInstallationRepositories";
import { useWorkspaceById } from "@/domains/workspaces/hooks/useWorkspaceById";
import { useWorkspaceRepositories } from "@/domains/workspaces/hooks/useWorkspaceRepositories";
import type { GithubRepositoryOption } from "@/domains/workspaces/types";
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

type RepositoryOptionRowProps = {
  repository: GithubRepositoryOption;
  isConnected: boolean;
  isConnecting: boolean;
  isDisabled: boolean;
  onConnect: (repositoryId: string) => void;
};

function RepositoryOptionRow({
  repository,
  isConnected,
  isConnecting,
  isDisabled,
  onConnect,
}: RepositoryOptionRowProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/60 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Github className="size-4 shrink-0 text-prism-muted" />
          <a
            href={repository.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="truncate text-sm font-semibold text-prism-heading hover:text-prism-teal-700"
          >
            {repository.fullName}
          </a>
          <ExternalLink className="size-3.5 shrink-0 text-prism-muted" />
          <Badge size="sm">{getRepositoryVisibilityLabel(repository.visibility)}</Badge>
          {repository.archived ? <Badge size="sm">Archived</Badge> : null}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-prism-muted">
          {repository.defaultBranch ? (
            <span className="inline-flex items-center gap-1.5">
              <GitBranch className="size-3.5" />
              {repository.defaultBranch}
            </span>
          ) : null}
          <span>{repository.private ? "Private access granted" : "Public repository"}</span>
        </div>
      </div>

      <Button
        type="button"
        variant={isConnected ? "outline" : "default"}
        className="h-9 shrink-0 rounded-lg px-4 text-sm"
        disabled={isDisabled || isConnected || repository.archived}
        onClick={() => onConnect(repository.githubRepositoryId)}
      >
        {isConnecting ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : isConnected ? (
          <CheckCircle2 className="size-4" />
        ) : null}
        {isConnecting ? "Connecting..." : isConnected ? "Connected" : repository.archived ? "Archived" : "Connect"}
      </Button>
    </div>
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
  const [connectingRepositoryId, setConnectingRepositoryId] = useState<string | null>(null);
  const [isConnectingAll, setIsConnectingAll] = useState(false);
  const [locallyConnectedRepositoryIds, setLocallyConnectedRepositoryIds] = useState<Set<string>>(() => new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: workspace, isLoading: isWorkspaceLoading } = useWorkspaceById(workspaceId ?? null);
  const { data: repositories = [], isLoading: isRepositoriesLoading } = useGithubInstallationRepositories(
    workspaceId ?? null,
    installationId ?? null,
  );
  const { data: connectedRepositories = [], isLoading: isConnectedRepositoriesLoading } = useWorkspaceRepositories(
    workspaceId ?? null,
  );
  const { mutateAsync: connectRepository, isPending: isConnecting } = useConnectWorkspaceRepository();
  const workspaceSettingsHref = workspace ? `/workspaces/${encodeURIComponent(workspace.slug)}/settings` : undefined;
  const connectedRepositoryIds = useMemo(
    () =>
      new Set([
        ...connectedRepositories.map(repository => repository.githubRepositoryId),
        ...locallyConnectedRepositoryIds,
      ]),
    [connectedRepositories, locallyConnectedRepositoryIds],
  );
  const sortedRepositories = useMemo(
    () =>
      [...repositories].sort((a, b) => {
        const aConnected = connectedRepositoryIds.has(a.githubRepositoryId);
        const bConnected = connectedRepositoryIds.has(b.githubRepositoryId);

        if (aConnected !== bConnected) return aConnected ? 1 : -1;
        if (a.archived !== b.archived) return a.archived ? 1 : -1;

        return a.fullName.localeCompare(b.fullName);
      }),
    [connectedRepositoryIds, repositories],
  );
  const connectableRepositoryCount = sortedRepositories.filter(
    repository => !repository.archived && !connectedRepositoryIds.has(repository.githubRepositoryId),
  ).length;
  const connectableRepositories = useMemo(
    () =>
      sortedRepositories.filter(
        repository => !repository.archived && !connectedRepositoryIds.has(repository.githubRepositoryId),
      ),
    [connectedRepositoryIds, sortedRepositories],
  );
  const isLoading = isWorkspaceLoading || isRepositoriesLoading || isConnectedRepositoriesLoading;

  useEffect(() => {
    if (
      providerError ||
      isLoading ||
      !workspaceId ||
      !installationId ||
      connectableRepositories.length > 0 ||
      sortedRepositories.length === 0
    ) {
      return;
    }

    if (!isGithubInstallationWindow()) {
      return;
    }

    notifyRepositoryConnected(workspaceId);
    window.close();
  }, [
    connectableRepositories.length,
    installationId,
    isLoading,
    providerError,
    sortedRepositories.length,
    workspaceId,
  ]);

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

  const handleConnect = async (repositoryId: string) => {
    if (!workspaceId || !installationId || connectedRepositoryIds.has(repositoryId)) {
      return;
    }

    setErrorMessage(null);
    setConnectingRepositoryId(repositoryId);

    try {
      await connectRepository({
        workspaceId,
        payload: {
          githubInstallationId: installationId,
          githubRepositoryId: repositoryId,
        },
      });

      setLocallyConnectedRepositoryIds(previous => {
        const next = new Set(previous);
        next.add(repositoryId);
        return next;
      });

      if (isGithubInstallationWindow()) {
        notifyRepositoryConnected(workspaceId);
      }
    } catch (error) {
      setErrorMessage(getWorkspaceMutationErrorMessage(error, "Failed to connect GitHub repository."));
    } finally {
      setConnectingRepositoryId(null);
    }
  };

  const handleConnectAll = async () => {
    if (!workspaceId || !installationId || connectableRepositories.length === 0) {
      return;
    }

    setErrorMessage(null);
    setIsConnectingAll(true);

    try {
      setConnectingRepositoryId("all");

      const results = await Promise.allSettled(
        connectableRepositories.map(repository =>
          connectRepository({
            workspaceId,
            payload: {
              githubInstallationId: installationId,
              githubRepositoryId: repository.githubRepositoryId,
            },
          }),
        ),
      );
      const connectedIds = connectableRepositories
        .filter((_, index) => results[index]?.status === "fulfilled")
        .map(repository => repository.githubRepositoryId);
      const failedCount = results.filter(result => result.status === "rejected").length;

      if (connectedIds.length > 0) {
        setLocallyConnectedRepositoryIds(previous => {
          const next = new Set(previous);
          connectedIds.forEach(repositoryId => next.add(repositoryId));
          return next;
        });
      }

      if (failedCount > 0) {
        setErrorMessage(
          failedCount === connectableRepositories.length
            ? "Failed to connect GitHub repositories."
            : `${failedCount} GitHub repositories could not be connected.`,
        );
      }

      if (connectedIds.length > 0 && isGithubInstallationWindow()) {
        notifyRepositoryConnected(workspaceId);
      }
    } finally {
      setConnectingRepositoryId(null);
      setIsConnectingAll(false);
    }
  };

  const handleDone = () => {
    if (workspaceId && isGithubInstallationWindow()) {
      notifyRepositoryConnected(workspaceId);
      window.close();
    }

    router.replace(workspaceSettingsHref ?? "/workspaces");
  };

  return (
    <ResultShell>
      <ResultHeader
        title="Connect GitHub repository"
        description={
          setupAction === "update"
            ? "Connect any newly available repositories for this workspace."
            : "Connect repositories from this GitHub installation."
        }
      />

      <div className="space-y-5 px-6 py-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : sortedRepositories.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-prism-muted">
                {connectableRepositoryCount > 0
                  ? `${connectableRepositoryCount} repositories can be connected.`
                  : "All available repositories are already connected."}
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-border/70 bg-background">
              {sortedRepositories.map(repository => {
                const isConnected = connectedRepositoryIds.has(repository.githubRepositoryId);

                return (
                  <RepositoryOptionRow
                    key={repository.githubRepositoryId}
                    repository={repository}
                    isConnected={isConnected}
                    isConnecting={connectingRepositoryId === repository.githubRepositoryId}
                    isDisabled={isConnecting || isConnectingAll}
                    onConnect={repositoryId => {
                      void handleConnect(repositoryId);
                    }}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-background px-4 py-3 text-sm text-prism-muted">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <span>No repositories were returned from this GitHub installation.</span>
          </div>
        )}

        {errorMessage ? <p className="text-sm text-prism-danger">{errorMessage}</p> : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            className="h-10 rounded-lg px-5"
            disabled={isConnecting || isConnectingAll || connectableRepositories.length === 0}
            onClick={() => {
              void handleConnectAll();
            }}
          >
            {isConnectingAll ? <LoaderCircle className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
            {isConnectingAll ? "Connecting..." : "Connect all"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-10 rounded-lg"
            onClick={handleDone}
          >
            Done
          </Button>
        </div>
      </div>
    </ResultShell>
  );
}
