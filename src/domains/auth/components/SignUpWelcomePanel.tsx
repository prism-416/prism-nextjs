"use client";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { FieldSet } from "@/atomics/molecules/Field";

type SignUpWelcomePanelProps = {
  workspaceName: string;
  onBack: () => void;
};

export function SignUpWelcomePanel({ workspaceName, onBack }: SignUpWelcomePanelProps) {
  const resolvedWorkspaceName = workspaceName.trim() || "Your workspace";

  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)] lg:gap-12">
      <div className="space-y-6 pt-4 text-white lg:pr-8">
        <Typography
          variant="overline"
          tone="inverse"
          className="text-prism-cream/72 tracking-[0.3em]"
        >
          Workspace Ready
        </Typography>
        <Typography
          variant="h1"
          tone="inverse"
          lineHeight="tight"
          className="max-w-xl tracking-[-0.04em] xl:text-5xl"
        >
          Your workspace is ready
        </Typography>
        <Typography
          variant="body"
          tone="inverse"
          lineHeight="7"
          className="max-w-lg text-white/72"
        >
          Start building your workflow with a few next steps.
        </Typography>
        <div className="rounded-3xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
          <Typography
            variant="overline"
            tone="inverse"
            className="text-prism-cream/68"
          >
            Workspace
          </Typography>
          <Typography
            variant="h3"
            tone="inverse"
            className="mt-3"
          >
            {resolvedWorkspaceName}
          </Typography>
          <Typography
            variant="bodySm"
            tone="inverse"
            lineHeight="7"
            className="mt-3 text-white/72"
          >
            Check your inbox to verify your email.
          </Typography>
        </div>
      </div>

      <FieldSet className="gap-8 rounded-[1.65rem] border border-prism-sand/70 bg-(image:--gradient-panel-surface) p-6 shadow-(--shadow-auth-panel) backdrop-blur-md lg:p-8">
        <FieldSet className="gap-3">
          <Button
            type="button"
            size="lg"
            className="h-11 rounded-xl"
          >
            Create first project
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-prism-sand bg-prism-surface-field text-primary hover:bg-prism-sand"
          >
            Invite teammates
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-prism-sand bg-prism-surface-field text-primary hover:bg-prism-sand"
          >
            Connect GitHub
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-xl text-prism-body/72 hover:bg-prism-sand-soft hover:text-primary"
          >
            Do this later
          </Button>
        </FieldSet>

        <div className="flex justify-start">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="rounded-xl px-0 text-prism-body/72 hover:bg-transparent hover:text-primary"
          >
            Back
          </Button>
        </div>
      </FieldSet>
    </div>
  );
}
