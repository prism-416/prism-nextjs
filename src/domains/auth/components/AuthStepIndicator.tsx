"use client";

import { Typography } from "@/atomics/atoms/Typography";
import type { SignUpStepContent } from "@/domains/auth/constants/content";
import { cn } from "@/shared/utils/cn";

type AuthStepIndicatorProps = {
  steps: readonly SignUpStepContent[];
  currentStepIndex: number;
  tone?: "light" | "dark";
};

export function AuthStepIndicator({ steps, currentStepIndex, tone = "light" }: AuthStepIndicatorProps) {
  return (
    <nav
      aria-label="Sign up progress"
      className="space-y-3"
    >
      <div
        className={cn(
          "flex items-center justify-between",
          tone === "dark" ? "text-prism-cream/82" : "text-prism-body/48",
        )}
      >
        <Typography
          as="span"
          variant="overline"
          tone="inherit"
          className="text-[0.7rem] tracking-[0.28em]"
        >
          Onboarding
        </Typography>
        <Typography
          as="span"
          variant="overline"
          tone="inherit"
          className="text-[0.7rem] tracking-[0.28em]"
        >
          {currentStepIndex + 1} / {steps.length}
        </Typography>
      </div>

      <ol
        className="grid grid-cols-3 gap-2"
        aria-label="Sign up steps"
      >
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isComplete = index < currentStepIndex;

          return (
            <li
              key={step.key}
              className="space-y-2"
            >
              <div
                className={cn(
                  "h-2 rounded-full transition-colors",
                  tone === "dark" && (isActive ? "bg-prism-cream" : isComplete ? "bg-white/80" : "bg-white/18"),
                  tone === "light" && (isActive || isComplete ? "bg-primary" : "bg-prism-sand/80"),
                )}
              />
              <div className="space-y-0.5">
                <Typography
                  variant="overline"
                  tone="inherit"
                  className={cn("text-[0.68rem]", tone === "dark" ? "text-prism-cream/62" : "text-prism-body/42")}
                >
                  {step.step}
                </Typography>
                <Typography
                  variant="bodySm"
                  tone="inherit"
                  className={cn(
                    tone === "dark" &&
                      (isActive
                        ? "font-semibold text-white"
                        : isComplete
                          ? "font-medium text-white/84"
                          : "font-medium text-white/60"),
                    tone === "light" && (isActive ? "font-semibold text-primary" : "font-medium text-prism-body/62"),
                  )}
                >
                  {step.label}
                </Typography>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
