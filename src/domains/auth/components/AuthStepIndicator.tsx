"use client";

import { cn } from "@/shared/utils/cn";
import type { SignUpStepContent } from "@/domains/auth/constants/content";

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
          "flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.28em]",
          tone === "dark" ? "text-prism-cream/82" : "text-prism-body/48",
        )}
      >
        <span>Onboarding</span>
        <span>
          {currentStepIndex + 1} / {steps.length}
        </span>
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
                <p
                  className={cn(
                    "text-[0.68rem] font-semibold uppercase tracking-[0.24em]",
                    tone === "dark" ? "text-prism-cream/62" : "text-prism-body/42",
                  )}
                >
                  {step.step}
                </p>
                <p
                  className={cn(
                    "text-sm transition-colors",
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
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
