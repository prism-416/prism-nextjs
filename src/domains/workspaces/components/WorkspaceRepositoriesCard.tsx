"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Github, GitBranch, LoaderCircle, Plug, Trash2 } from "lucide-react";

import { Badge } from "@/atomics/atoms/Badge";
import { Button } from "@/atomics/atoms/Button";
import { Skeleton } from "@/atomics/atoms/Skeleton";
import { Typography } from "@/atomics/atoms/Typography";
import { useCreateWorkspaceGithubInstallationAuthorization } from "@/domains/workspaces/hooks/useCreateWorkspaceGithubInstallationAuthorization";
import { useDisconnectWorkspaceRepository } from "@/domains/workspaces/hooks/useDisconnectWorkspaceRepository";
import { useWorkspaceRepositories } from "@/domains/workspaces/hooks/useWorkspaceRepositories";
import type { WorkspaceRepositoryLink } from "@/domains/workspaces/types";
import { getWorkspaceMutationErrorMessage } from "@/domains/workspaces/utils/error";
import {
  markGithubInstallationWindow,
  subscribeToGithubInstallationMessages,
} from "@/domains/workspaces/utils/github-installation-window";
import { QUERY_KEYS } from "@/shared/query";

type WorkspaceRepositoriesCardProps = {
  workspaceId: string;
  canManage: boolean;
};

type RepositoryRowProps = {
  link: WorkspaceRepositoryLink;
  canManage: boolean;
  isDisconnecting: boolean;
  onDisconnect: (linkId: string) => void;
};

function getVisibilityLabel(link: WorkspaceRepositoryLink) {
  if (link.visibility === "private") {
    return "Private";
  }

  if (link.visibility === "internal") {
    return "Internal";
  }

  return "Public";
}

function RepositoryRow({ link, canManage, isDisconnecting, onDisconnect }: RepositoryRowProps) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <Github className="size-4 shrink-0 text-prism-muted" />
          <a
            href={link.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="truncate text-sm font-semibold text-prism-heading hover:text-prism-teal-700"
          >
            {link.repositoryFullName}
          </a>
          <ExternalLink className="size-3.5 shrink-0 text-prism-muted" />
          <Badge size="sm">{getVisibilityLabel(link)}</Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-prism-muted">
          {link.defaultBranch ? (
            <span className="inline-flex items-center gap-1.5">
              <GitBranch className="size-3.5" />
              {link.defaultBranch}
            </span>
          ) : null}
          <span>Connected {new Date(link.connectedAt).toLocaleDateString("en-US")}</span>
        </div>
      </div>

      {canManage ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-prism-muted hover:text-prism-danger"
          aria-label={`Disconnect ${link.repositoryFullName}`}
          disabled={isDisconnecting}
          onClick={() => onDisconnect(link.linkId)}
        >
          {isDisconnecting ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        </Button>
      ) : null}
    </div>
  );
}

function RepositorySkeletonRows() {
  return (
    <div className="divide-y divide-border/60">
      {["first", "second"].map(key => (
        <div
          key={key}
          className="px-5 py-4"
        >
          <Skeleton className="h-4 w-64 max-w-full" />
          <Skeleton className="mt-3 h-3 w-40 max-w-full" />
        </div>
      ))}
    </div>
  );
}

export function WorkspaceRepositoriesCard({ workspaceId, canManage }: WorkspaceRepositoriesCardProps) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [disconnectingLinkId, setDisconnectingLinkId] = useState<string | null>(null);
  const { data: links = [], isLoading } = useWorkspaceRepositories(workspaceId);
  const { mutateAsync: createAuthorization, isPending: isAuthorizing } =
    useCreateWorkspaceGithubInstallationAuthorization();
  const { mutateAsync: disconnectRepository } = useDisconnectWorkspaceRepository();

  useEffect(
    () =>
      subscribeToGithubInstallationMessages(message => {
        if (message.workspaceId !== workspaceId) return;
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.repositories(workspaceId) });
      }),
    [queryClient, workspaceId],
  );

  const handleConnect = async () => {
    setErrorMessage(null);
    const installationWindow = window.open("", "_blank");

    if (!installationWindow) {
      setErrorMessage("Allow new tabs to connect a GitHub repository.");
      return;
    }

    markGithubInstallationWindow(installationWindow);
    installationWindow.focus();

    try {
      const authorization = await createAuthorization(workspaceId);
      installationWindow.location.assign(authorization.authorizationUrl);
    } catch (error) {
      installationWindow.close();
      setErrorMessage(getWorkspaceMutationErrorMessage(error, "Failed to start GitHub connection."));
    }
  };

  const handleDisconnect = async (linkId: string) => {
    setErrorMessage(null);
    setDisconnectingLinkId(linkId);

    try {
      await disconnectRepository({ workspaceId, linkId });
    } catch (error) {
      setErrorMessage(getWorkspaceMutationErrorMessage(error, "Failed to disconnect GitHub repository."));
    } finally {
      setDisconnectingLinkId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]">
      <div className="flex flex-col gap-3 border-b border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Github className="size-4 text-prism-muted" />
            <h2 className="text-sm font-semibold text-prism-heading">GitHub repositories</h2>
          </div>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-1"
          >
            {links.length > 0 ? `${links.length} connected` : "No repositories connected."}
          </Typography>
        </div>

        {canManage ? (
          <Button
            type="button"
            onClick={() => {
              void handleConnect();
            }}
            disabled={isAuthorizing}
            className="h-9 shrink-0 rounded-lg px-4 text-sm"
          >
            {isAuthorizing ? <LoaderCircle className="size-4 animate-spin" /> : <Plug className="size-4" />}
            {isAuthorizing ? "Opening GitHub..." : "Connect repository"}
          </Button>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="border-b border-border/60 px-5 py-3 text-sm text-prism-danger">{errorMessage}</p>
      ) : null}

      {isLoading ? (
        <RepositorySkeletonRows />
      ) : links.length > 0 ? (
        <div className="divide-y divide-border/60">
          {links.map(link => (
            <RepositoryRow
              key={link.linkId}
              link={link}
              canManage={canManage}
              isDisconnecting={disconnectingLinkId === link.linkId}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      ) : (
        <div className="px-5 py-6">
          <Typography
            variant="bodySm"
            tone="muted"
          >
            Connect repositories once at the workspace level so projects can use the same GitHub access.
          </Typography>
        </div>
      )}
    </div>
  );
}
