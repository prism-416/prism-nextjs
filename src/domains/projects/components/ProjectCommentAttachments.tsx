"use client";

import * as React from "react";
import { FileText, Loader2, X } from "lucide-react";

import { useDeleteProjectDocument } from "@/domains/projects/hooks/useDeleteProjectDocument";
import { useDownloadProjectDocument } from "@/domains/projects/hooks/useDownloadProjectDocument";
import type { ProjectDocument } from "@/domains/projects/types";
import { formatDocumentFileSize, getDocumentFormat } from "@/domains/projects/utils/document";
import { cn } from "@/shared/utils/cn";

type ProjectCommentAttachmentsProps = {
  projectId: string;
  itemId?: string;
  attachments: ProjectDocument[];
  canDownload: boolean;
  canDelete?: boolean;
};

export function ProjectCommentAttachments({
  projectId,
  itemId,
  attachments,
  canDownload,
  canDelete = false,
}: ProjectCommentAttachmentsProps) {
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const downloadDocument = useDownloadProjectDocument();
  const deleteDocument = useDeleteProjectDocument();

  if (attachments.length === 0) {
    return null;
  }

  async function handleDownload(attachment: ProjectDocument) {
    if (!canDownload) {
      return;
    }

    setError(null);
    setDownloadingId(attachment.documentId);

    try {
      await downloadDocument.mutateAsync({
        projectId,
        documentId: attachment.documentId,
        fileName: attachment.fileName,
      });
    } catch {
      setError("Attachment could not be downloaded.");
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDelete(attachment: ProjectDocument) {
    setError(null);
    setDeletingId(attachment.documentId);

    try {
      await deleteDocument.mutateAsync({
        projectId,
        documentId: attachment.documentId,
        itemId,
      });
    } catch {
      setError("Attachment could not be removed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-1.5">
      <ul className="flex max-w-full flex-col items-start gap-1">
        {attachments.map(attachment => {
          const isDownloading = downloadingId === attachment.documentId;
          const isDeleting = deletingId === attachment.documentId;
          const isBusy = isDownloading || isDeleting;
          const content = (
            <>
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-prism-navy/5 text-prism-muted">
                {isDownloading ? <Loader2 className="size-3 animate-spin" /> : <FileText className="size-3" />}
              </span>
              <span className="min-w-0 max-w-44 truncate text-xs font-medium text-prism-body">
                {attachment.fileName}
              </span>
              <span className="shrink-0 text-[11px] text-prism-muted">
                {getDocumentFormat(attachment.fileName)} · {formatDocumentFileSize(attachment.sizeBytes)}
              </span>
            </>
          );

          return (
            <li
              key={attachment.documentId}
              className="flex max-w-full items-center gap-1"
            >
              {canDownload ? (
                <button
                  type="button"
                  className={cn(
                    "inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border/60 bg-surface px-2 py-1",
                    "hover:border-prism-navy/25 hover:bg-prism-navy/5 disabled:cursor-wait disabled:opacity-70",
                  )}
                  aria-label={`Download ${attachment.fileName}`}
                  title={`Download ${attachment.fileName}`}
                  onClick={() => void handleDownload(attachment)}
                  disabled={isBusy}
                >
                  {content}
                </button>
              ) : (
                <div className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border/60 bg-surface px-2 py-1 opacity-75">
                  {content}
                </div>
              )}

              {canDelete ? (
                <button
                  type="button"
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-prism-muted hover:bg-prism-danger-soft/40 hover:text-prism-danger disabled:cursor-wait disabled:opacity-60"
                  aria-label={`Remove ${attachment.fileName}`}
                  title={`Remove ${attachment.fileName}`}
                  onClick={() => void handleDelete(attachment)}
                  disabled={isBusy}
                >
                  {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
      {error ? <p className="mt-1 text-xs text-prism-danger">{error}</p> : null}
    </div>
  );
}
