"use client";

import { ButtonHTMLAttributes } from "react";

import { Typography } from "@/atomics/atoms/Typography";
import { Input } from "@/atomics/atoms/Input";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/atomics/molecules/Field";
import { FormHintChecklist } from "@/domains/auth/components/FormHintChecklist";
import { cn } from "@/shared/utils/cn";

const WORKSPACE_MODES = [
  {
    value: "team",
    label: "For my team",
    description: "Set up a shared space for projects, work items, and teammates.",
  },
  {
    value: "solo",
    label: "Just exploring",
    description: "Start alone and invite collaborators when the structure is ready.",
  },
] as const;

export type WorkspaceMode = (typeof WORKSPACE_MODES)[number]["value"];

type SignUpWorkspaceStepProps = {
  workspaceName: string;
  workspaceMode: WorkspaceMode;
  onWorkspaceNameChange: (value: string) => void;
  onWorkspaceModeChange: (value: WorkspaceMode) => void;
};

export function SignUpWorkspaceStep({
  workspaceName,
  workspaceMode,
  onWorkspaceNameChange,
  onWorkspaceModeChange,
}: SignUpWorkspaceStepProps) {
  const workspaceChecks = [
    { label: "Enter a workspace name", isValid: workspaceName.trim().length > 0 },
    { label: "Choose who this workspace is for", isValid: Boolean(workspaceMode) },
  ] as const;

  return (
    <FieldSet className="gap-6">
      <FieldGroup className="gap-5">
        <Field className="space-y-2">
          <FieldLabel htmlFor="workspace">Workspace name</FieldLabel>
          <Input
            id="workspace"
            name="workspace"
            type="text"
            autoComplete="organization"
            value={workspaceName}
            onChange={event => onWorkspaceNameChange(event.target.value)}
            placeholder="Team or company name"
            className="h-11 rounded-xl border-prism-sand bg-prism-surface-field text-primary placeholder:text-prism-body/45"
          />
        </Field>
      </FieldGroup>

      <FieldSet className="gap-3">
        <FieldLegend
          variant="label"
          className="text-sm font-medium text-primary"
        >
          Who is this for?
        </FieldLegend>

        <div className="grid gap-3">
          {WORKSPACE_MODES.map(mode => (
            <WorkspaceModeCard
              key={mode.value}
              isSelected={mode.value === workspaceMode}
              label={mode.label}
              description={mode.description}
              onClick={() => onWorkspaceModeChange(mode.value)}
            />
          ))}
        </div>
      </FieldSet>

      <FormHintChecklist items={workspaceChecks} />
    </FieldSet>
  );
}

type WorkspaceModeCardProps = {
  isSelected: boolean;
  label: string;
  description: string;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

function WorkspaceModeCard({ isSelected, label, description, onClick }: WorkspaceModeCardProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-2xl border px-4 py-4 text-left transition-colors",
        isSelected
          ? "border-primary bg-primary/6 shadow-(--shadow-soft-navy)"
          : "border-prism-sand bg-prism-surface-field-soft hover:border-primary/30 hover:bg-white/70",
      )}
      onClick={onClick}
    >
      <Typography
        variant="bodySm"
        tone="primary"
        weight="semibold"
      >
        {label}
      </Typography>
      <Typography
        variant="bodySm"
        tone="inherit"
        className="mt-1 text-prism-body/68"
      >
        {description}
      </Typography>
    </button>
  );
}
