"use client";

import { Typography } from "@/atomics/atoms/Typography";
import { AuthStepIndicator } from "./AuthStepIndicator";
import { SIGN_UP_STEPS } from "../constants/content";
import { cn } from "@/shared/utils/cn";

type SignUpSidebarProps = {
  currentStepIndex: number;
};

export function SignUpSidebar({ currentStepIndex }: SignUpSidebarProps) {
  const currentStep = SIGN_UP_STEPS[currentStepIndex];

  return (
    <div className="space-y-8 pt-4 text-white lg:pr-8">
      <div className="space-y-4">
        <Typography
          variant="overline"
          tone="inverse"
          className="text-prism-cream/72 tracking-[0.3em]"
        >
          Get Started
        </Typography>
        <Typography
          variant="h1"
          tone="inverse"
          lineHeight="tight"
          className="max-w-xl tracking-[-0.04em] xl:text-5xl"
        >
          {currentStep.title}
        </Typography>
        <Typography
          variant="body"
          tone="inverse"
          lineHeight="7"
          className="max-w-lg text-white/72"
        >
          {currentStep.description}
        </Typography>
      </div>

      <div className="rounded-[1.7rem] border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
        <AuthStepIndicator
          steps={SIGN_UP_STEPS}
          currentStepIndex={currentStepIndex}
          tone="dark"
        />
      </div>

      <div className="grid gap-3">
        {SIGN_UP_STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;

          return (
            <div
              key={step.key}
              className={cn(
                "rounded-2xl border p-4 transition-colors",
                isActive ? "border-white/24 bg-white/12" : "border-white/10 bg-white/5",
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <Typography
                  variant="bodySm"
                  tone="inverse"
                  weight="semibold"
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="overline"
                  tone="inverse"
                  className="text-[0.68rem] text-prism-cream/68 tracking-[0.28em]"
                >
                  {step.step}
                </Typography>
              </div>
              <Typography
                variant="bodySm"
                tone="inverse"
                className="mt-2 text-white/70"
              >
                {step.description}
              </Typography>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
        <Typography
          variant="overline"
          tone="inverse"
          className="text-prism-cream/68"
        >
          What comes next
        </Typography>
        <Typography
          variant="bodySm"
          tone="inverse"
          lineHeight="7"
          className="mt-3 max-w-lg text-white/72"
        >
          Once you sign up, your workspace will be created automatically. From there you can create projects, invite
          teammates, and connect integrations.
        </Typography>
      </div>
    </div>
  );
}
