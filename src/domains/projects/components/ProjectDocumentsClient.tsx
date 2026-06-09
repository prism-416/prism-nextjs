"use client";

import * as React from "react";
import { Download, FileText, Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { ConfirmDialog } from "@/atomics/organisms/ConfirmDialog";
import { useDeleteProjectDocument } from "@/domains/projects/hooks/useDeleteProjectDocument";
import { useDownloadProjectDocument } from "@/domains/projects/hooks/useDownloadProjectDocument";
import { useProjectDocumentPermissions } from "@/domains/projects/hooks/useProjectDocumentPermissions";
import { useProjectDocuments } from "@/domains/projects/hooks/useProjectDocuments";
import { useUploadProjectDocument } from "@/domains/projects/hooks/useUploadProjectDocument";
import type { ProjectDocument, ProjectDocumentSearchResult } from "@/domains/projects/types";
import { formatDocumentFileSize, getDocumentFormat } from "@/domains/projects/utils/document";
import { cn } from "@/shared/utils/cn";

const MAX_DOCUMENT_FILE_SIZE_BYTES = 25 * 1024 * 1024;

type ProjectDocumentsClientProps = {
  projectId: string;
  workspaceId: string;
  initialData?: ProjectDocumentSearchResult;
};

function formatDocumentDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProjectDocumentsClient({ projectId, workspaceId, initialData }: ProjectDocumentsClientProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [actionMessage, setActionMessage] = React.useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<ProjectDocument | null>(null);
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

  const { data, isPending, isError, refetch } = useProjectDocuments(projectId, undefined, initialData);
  const { canContribute, canManage } = useProjectDocumentPermissions(workspaceId);
  const uploadDocument = useUploadProjectDocument();
  const downloadDocument = useDownloadProjectDocument();
  const deleteDocument = useDeleteProjectDocument();

  const documents = data?.items ?? [];
  const isEmpty = !isPending && documents.length === 0;

  function handleUploadClick() {
    setActionMessage(null);
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.size <= 0) {
      setActionMessage("The selected file is empty.");
      return;
    }

    if (file.size > MAX_DOCUMENT_FILE_SIZE_BYTES) {
      setActionMessage("Files must be 25 MB or smaller.");
      return;
    }

    setActionMessage(null);

    try {
      await uploadDocument.mutateAsync({ projectId, payload: { file } });
    } catch {
      setActionMessage("The document could not be uploaded.");
    }
  }

  async function handleDownload(document: ProjectDocument) {
    setActionMessage(null);
    setDownloadingId(document.documentId);

    try {
      await downloadDocument.mutateAsync({
        projectId,
        documentId: document.documentId,
        fileName: document.fileName,
      });
    } catch {
      setActionMessage("The document could not be downloaded.");
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) {
      return;
    }

    setActionMessage(null);

    try {
      await deleteDocument.mutateAsync({ projectId, documentId: pendingDelete.documentId });
      setPendingDelete(null);
    } catch {
      setActionMessage("The document could not be deleted.");
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography
            variant="title"
            tone="primary"
          >
            Documents
          </Typography>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-1"
          >
            Upload files to share with everyone in this workspace.
          </Typography>
        </div>

        {canContribute ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              className="h-10 rounded-lg"
              onClick={handleUploadClick}
              disabled={uploadDocument.isPending}
            >
              {uploadDocument.isPending ? <Loader2 className="animate-spin" /> : <Upload />}
              {uploadDocument.isPending ? "Uploading…" : "Upload document"}
            </Button>
          </div>
        ) : null}
      </div>

      {actionMessage ? (
        <div
          role="alert"
          className="rounded-lg border border-prism-danger/30 bg-prism-danger/5 px-4 py-3"
        >
          <Typography
            variant="bodySm"
            tone="muted"
          >
            {actionMessage}
          </Typography>
        </div>
      ) : null}

      {isError ? (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-border/80 bg-surface p-5">
          <Typography
            variant="bodySm"
            tone="muted"
          >
            Documents could not be loaded.
          </Typography>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
          >
            Try again
          </Button>
        </div>
      ) : isEmpty ? (
        <div className="rounded-2xl border border-border/80 bg-surface p-5">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-prism-muted" />
            <Typography
              variant="title"
              tone="primary"
            >
              Documents
            </Typography>
          </div>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-4 italic"
          >
            {canContribute ? "No documents yet. Upload a file to get started." : "No documents yet."}
          </Typography>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface">
          <div className="hidden grid-cols-[minmax(0,1fr)_5rem_4rem_7rem_5rem] items-center gap-x-4 border-b border-border/70 bg-surface-strong px-4 py-2.5 md:grid">
            <Typography
              variant="caption"
              tone="muted"
            >
              Name
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
            >
              Size
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
            >
              Format
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
            >
              Uploaded
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
              className="text-center"
            >
              Actions
            </Typography>
          </div>

          {documents.map(document => {
            const isDownloading = downloadingId === document.documentId;
            const fileSize = formatDocumentFileSize(document.sizeBytes);
            const fileFormat = getDocumentFormat(document.fileName);
            const uploadedAt = formatDocumentDate(document.createdAt);

            const actions =
              canContribute || canManage ? (
                <div className="flex shrink-0 items-center gap-1 md:justify-center">
                  {canContribute ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-9"
                      title="Download"
                      aria-label={`Download ${document.fileName}`}
                      onClick={() => void handleDownload(document)}
                      disabled={isDownloading}
                    >
                      {isDownloading ? <Loader2 className="animate-spin" /> : <Download />}
                    </Button>
                  ) : null}

                  {canManage ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn("size-9 text-prism-danger hover:text-prism-danger")}
                      title="Delete"
                      aria-label={`Delete ${document.fileName}`}
                      onClick={() => {
                        setActionMessage(null);
                        setPendingDelete(document);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  ) : null}
                </div>
              ) : null;

            return (
              <div
                key={document.documentId}
                className="border-b border-border/70 last:border-b-0"
              >
                {/* Mobile: stacked card */}
                <div className="flex items-center gap-3 px-4 py-3 md:hidden">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-prism-navy/5 text-prism-muted">
                    <FileText className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Typography
                      variant="bodySm"
                      tone="primary"
                      truncate
                      className="font-semibold"
                    >
                      {document.fileName}
                    </Typography>
                    <Typography
                      variant="caption"
                      tone="muted"
                      truncate
                      className="mt-0.5"
                    >
                      {`${fileFormat} · ${fileSize} · ${uploadedAt}`}
                    </Typography>
                  </div>
                  {actions}
                </div>

                {/* Desktop: table row */}
                <div className="hidden grid-cols-[minmax(0,1fr)_5rem_4rem_7rem_5rem] items-center gap-x-4 px-4 py-3.5 md:grid">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-prism-navy/5 text-prism-muted">
                      <FileText className="size-4" />
                    </span>
                    <Typography
                      variant="bodySm"
                      tone="primary"
                      truncate
                      className="font-semibold"
                    >
                      {document.fileName}
                    </Typography>
                  </div>

                  <Typography
                    variant="bodySm"
                    tone="muted"
                    className="tabular-nums"
                  >
                    {fileSize}
                  </Typography>

                  <Typography
                    variant="caption"
                    tone="muted"
                    className="font-medium uppercase tracking-wide"
                  >
                    {fileFormat}
                  </Typography>

                  <Typography
                    variant="bodySm"
                    tone="muted"
                  >
                    {uploadedAt}
                  </Typography>

                  {actions}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete document"
        description={
          pendingDelete
            ? `Delete "${pendingDelete.title}"? This permanently removes the file for everyone.`
            : "Delete this document?"
        }
        confirmLabel="Delete document"
        tone="danger"
        isPending={deleteDocument.isPending}
        onOpenChange={open => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
        onConfirm={() => void handleConfirmDelete()}
      />
    </section>
  );
}
