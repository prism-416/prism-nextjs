"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { FieldSet } from "@/atomics/molecules/Field";
import { SIGN_UP_STEPS } from "../constants/content";
import type { SignUpStepContent } from "../types";
import { cn } from "@/shared/utils/cn";

type SignUpOnboardingFormPanelProps = {
  canContinue: boolean;
  children: ReactNode;
  continueError: string | null;
  currentStep: SignUpStepContent;
  currentStepIndex: number;
  isContinueSubmitting: boolean;
  onBack: () => void;
  onContinue: () => void | Promise<void>;
};

export function SignUpOnboardingFormPanel({
  canContinue,
  children,
  continueError,
  currentStep,
  currentStepIndex,
  isContinueSubmitting,
  onBack,
  onContinue,
}: SignUpOnboardingFormPanelProps) {
  return (
    <FieldSet className="gap-8 rounded-[1.65rem] border border-prism-sand/70 bg-(image:--gradient-panel-surface) p-6 shadow-(--shadow-auth-panel) backdrop-blur-md lg:sticky lg:top-10 lg:p-8">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-1.5">
          <Typography
            variant="overline"
            tone="inherit"
            className="text-prism-body/45 tracking-[0.28em]"
          >
            Current step
          </Typography>
          <Typography
            variant="h3"
            tone="primary"
            className="tracking-[-0.03em]"
          >
            {currentStep.label}
          </Typography>
        </div>

        <div className="rounded-full border border-prism-sand/80 bg-white/80 px-4 py-2">
          <Typography
            as="span"
            variant="overline"
            tone="inherit"
            className="text-prism-body/52"
          >
            {currentStep.step} / {SIGN_UP_STEPS.length.toString().padStart(2, "0")}
          </Typography>
        </div>
      </div>

      <div
        key={currentStep.key}
        className="space-y-7 rounded-3xl border border-white/75 bg-white/80 p-6 shadow-(--shadow-soft-navy-card)"
      >
        {children}

        {continueError ? (
          <Typography
            variant="bodySm"
            tone="inherit"
            className="text-prism-danger"
          >
            {continueError}
          </Typography>
        ) : null}

        <div className="flex items-center justify-between gap-3 pt-1">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className={cn(
              "rounded-xl px-4 text-prism-body/72 hover:bg-prism-sand-soft hover:text-primary",
              currentStepIndex === 0 && "invisible",
            )}
          >
            Back
          </Button>

          <Button
            type="button"
            size="lg"
            className="rounded-xl px-6"
            disabled={!canContinue || isContinueSubmitting}
            onClick={() => {
              void onContinue();
            }}
          >
            {currentStep.key === "workspace" ? "Create workspace" : "Continue"}
          </Button>
        </div>
      </div>

      <Typography
        variant="bodySm"
        tone="inherit"
        align="center"
        className="text-prism-body/70"
      >
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-primary underline underline-offset-4"
        >
          Sign in
        </Link>
      </Typography>
    </FieldSet>
  );
}
