"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/atomics/atoms/Dialog";
import { Input } from "@/atomics/atoms/Input";
import { Label } from "@/atomics/atoms/Label";
import { Textarea } from "@/atomics/atoms/Textarea";
import { Typography } from "@/atomics/atoms/Typography";
import { cn } from "@/shared/utils/cn";

import { useCreateWorkspace } from "@/domains/workspace/hooks/useCreateWorkspace";
import type { Workspace } from "@/domains/workspace/types";

type CreateWorkspaceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (workspace: Workspace) => void;
};

const NAME_MAX = 48;
const DESCRIPTION_MAX = 180;

export function CreateWorkspaceDialog({ open, onOpenChange, onCreated }: CreateWorkspaceDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const { mutateAsync, isPending, error, reset } = useCreateWorkspace();

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setName("");
        setDescription("");
        setFieldError(null);
        reset();
      }, 0);
    }
  }, [open, reset]);

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  const isNameValid = trimmedName.length >= 2;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isNameValid) {
      setFieldError("Workspace name must be at least 2 characters.");
      return;
    }

    setFieldError(null);

    try {
      const workspace = await mutateAsync({
        name: trimmedName,
        description: trimmedDescription || undefined,
      });
      onCreated?.(workspace);
      onOpenChange(false);
    } catch {
      // handled via `error` state
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="overflow-hidden p-0">
        <div
          className="relative px-6 pb-5 pt-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(120,196,212,0.18) 0%, rgba(157,123,255,0.14) 45%, rgba(255,107,198,0.10) 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-prism-navy text-primary-foreground shadow-[0_8px_24px_rgba(12,71,103,0.25)]">
              <Sparkles className="size-5" />
            </span>
            <DialogHeader className="gap-0.5">
              <DialogTitle>Create a new workspace</DialogTitle>
              <DialogDescription>
                Organize projects, invite teammates, and keep everything in one calm place.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-6 pb-6 pt-5"
          noValidate
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="workspace-name"
                className="text-prism-body"
              >
                Workspace name
              </Label>
              <Typography
                variant="caption"
                tone="muted"
              >
                {trimmedName.length}/{NAME_MAX}
              </Typography>
            </div>
            <Input
              id="workspace-name"
              name="name"
              autoFocus
              maxLength={NAME_MAX}
              placeholder="e.g. Atlas Studio"
              value={name}
              onChange={event => {
                setName(event.target.value);
                if (fieldError) setFieldError(null);
              }}
              className={cn(
                "h-11 rounded-xl border-border bg-surface-field focus-visible:ring-2 focus-visible:ring-ring",
                fieldError && "border-red-300 focus-visible:ring-red-300/60",
              )}
              aria-invalid={Boolean(fieldError)}
              aria-describedby={fieldError ? "workspace-name-error" : undefined}
            />
            {fieldError && (
              <Typography
                id="workspace-name-error"
                variant="caption"
                tone="inherit"
                className="text-red-600"
              >
                {fieldError}
              </Typography>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="workspace-description"
                className="text-prism-body"
              >
                Description
                <span className="ml-1 text-prism-muted/80">(optional)</span>
              </Label>
              <Typography
                variant="caption"
                tone="muted"
              >
                {trimmedDescription.length}/{DESCRIPTION_MAX}
              </Typography>
            </div>
            <Textarea
              id="workspace-description"
              name="description"
              rows={3}
              maxLength={DESCRIPTION_MAX}
              placeholder="What is this workspace for?"
              value={description}
              onChange={event => setDescription(event.target.value)}
              className="rounded-xl border-border bg-surface-field focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2"
            >
              <Typography
                variant="caption"
                tone="inherit"
                className="text-red-700"
              >
                {error.message || "Something went wrong. Please try again."}
              </Typography>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-10 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isNameValid || isPending}
              className="h-10 rounded-lg px-5"
            >
              {isPending ? "Creating..." : "Create workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
