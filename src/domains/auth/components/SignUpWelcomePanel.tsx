"use client";

import { Button } from "@/atomics/atoms/Button";
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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f4ecd6]/72">Workspace Ready</p>
        <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white xl:text-5xl">
          Your workspace is ready
        </h1>
        <p className="max-w-lg text-base leading-7 text-white/72">
          Start building your workflow with a few next steps.
        </p>
        <div className="rounded-3xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f4ecd6]/68">Workspace</p>
          <p className="mt-3 text-2xl font-semibold text-white">{resolvedWorkspaceName}</p>
          <p className="mt-3 text-sm leading-7 text-white/72">Check your inbox to verify your email.</p>
        </div>
      </div>

      <FieldSet className="gap-8 rounded-[1.65rem] border border-prism-sand/70 bg-[linear-gradient(180deg,rgba(252,248,239,0.94)_0%,rgba(255,255,255,0.72)_100%)] p-6 shadow-[0_28px_120px_rgba(3,23,34,0.24)] backdrop-blur-md lg:p-8">
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
            className="h-11 rounded-xl border-prism-sand bg-[rgba(252,248,239,0.88)] text-primary hover:bg-[#e8deca]"
          >
            Invite teammates
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-prism-sand bg-[rgba(252,248,239,0.88)] text-primary hover:bg-[#e8deca]"
          >
            Connect GitHub
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-xl text-prism-body/72 hover:bg-[#efe7d7] hover:text-primary"
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
