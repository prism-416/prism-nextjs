"use client";

import { Input } from "@/atomics/atoms/Input";
import { Label } from "@/atomics/atoms/Label";
import { Textarea } from "@/atomics/atoms/Textarea";
import { Typography } from "@/atomics/atoms/Typography";
import { cn } from "@/shared/utils/cn";

type CreateWorkspaceDetailsSectionProps = {
  name: string;
  description: string;
  fieldError?: string | null;
  nameMax: number;
  descriptionMax: number;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

export function CreateWorkspaceDetailsSection({
  name,
  description,
  fieldError = null,
  nameMax,
  descriptionMax,
  onNameChange,
  onDescriptionChange,
}: CreateWorkspaceDetailsSectionProps) {
  const trimmedNameLength = name.trim().length;
  const trimmedDescriptionLength = description.trim().length;

  return (
    <>
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
            {trimmedNameLength}/{nameMax}
          </Typography>
        </div>
        <Input
          id="workspace-name"
          name="name"
          autoFocus
          maxLength={nameMax}
          placeholder="e.g. Atlas Studio"
          value={name}
          onChange={event => onNameChange(event.target.value)}
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
            {trimmedDescriptionLength}/{descriptionMax}
          </Typography>
        </div>
        <Textarea
          id="workspace-description"
          name="description"
          rows={3}
          maxLength={descriptionMax}
          placeholder="What is this workspace for?"
          value={description}
          onChange={event => onDescriptionChange(event.target.value)}
          className="rounded-xl border-border bg-surface-field focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </>
  );
}
