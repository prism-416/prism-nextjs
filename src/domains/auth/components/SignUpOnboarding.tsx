"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { FieldSet } from "@/atomics/molecules/Field";
import { SignUpAccountStep } from "@/domains/auth/components/SignUpAccountStep";
import { AuthStepIndicator } from "@/domains/auth/components/AuthStepIndicator";
import { SignUpProfileStep } from "@/domains/auth/components/SignUpProfileStep";
import { SignUpWelcomePanel } from "@/domains/auth/components/SignUpWelcomePanel";
import { SignUpWorkspaceStep, type WorkspaceMode } from "@/domains/auth/components/SignUpWorkspaceStep";
import { SIGN_UP_STEPS } from "@/domains/auth/constants/content";
import { cn } from "@/shared/utils/cn";

type SignUpFormState = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  username: string;
  workspaceName: string;
  workspaceMode: WorkspaceMode;
};

const INITIAL_FORM_STATE: SignUpFormState = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  username: "",
  workspaceName: "",
  workspaceMode: "team",
};

export function SignUpOnboarding() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isWelcomeStep, setIsWelcomeStep] = useState(false);
  const [formState, setFormState] = useState<SignUpFormState>(INITIAL_FORM_STATE);

  const currentStep = SIGN_UP_STEPS[currentStepIndex];

  const canContinue = useMemo(() => {
    if (currentStep.key === "account") {
      return (
        formState.email.trim().length > 0 &&
        formState.password.trim().length > 0 &&
        formState.confirmPassword.trim().length > 0 &&
        formState.password === formState.confirmPassword
      );
    }

    if (currentStep.key === "profile") {
      return formState.name.trim().length > 0 && formState.username.trim().length > 0;
    }

    return formState.workspaceName.trim().length > 0;
  }, [currentStep.key, formState]);

  function updateField<Key extends keyof SignUpFormState>(key: Key, value: SignUpFormState[Key]) {
    setFormState(prev => ({ ...prev, [key]: value }));
  }

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    if (currentStepIndex === SIGN_UP_STEPS.length - 1) {
      setIsWelcomeStep(true);
      return;
    }

    setCurrentStepIndex(prev => prev + 1);
  }

  function handleBack() {
    if (isWelcomeStep) {
      setIsWelcomeStep(false);
      return;
    }

    if (currentStepIndex === 0) {
      return;
    }

    setCurrentStepIndex(prev => prev - 1);
  }

  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10 lg:px-8 lg:py-12">
      <div className="w-full max-w-6xl text-primary">
        {isWelcomeStep ? (
          <SignUpWelcomePanel
            workspaceName={formState.workspaceName}
            onBack={handleBack}
          />
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)] lg:gap-12">
            <div className="space-y-8 pt-4 text-white lg:pr-8">
              <div className="space-y-4">
                <Typography
                  variant="overline"
                  tone="inverse"
                  className="text-prism-cream/72 tracking-[0.3em]"
                >
                  Prizmatic Onboarding
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
                  After setup, you can move into project creation, teammate invites, and GitHub connection without
                  loading all of that into the first form.
                </Typography>
              </div>
            </div>

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
                {currentStep.key === "account" && (
                  <SignUpAccountStep
                    email={formState.email}
                    password={formState.password}
                    confirmPassword={formState.confirmPassword}
                    isPasswordVisible={isPasswordVisible}
                    onEmailChange={value => updateField("email", value)}
                    onPasswordChange={value => updateField("password", value)}
                    onConfirmPasswordChange={value => updateField("confirmPassword", value)}
                    onPasswordToggle={() => setIsPasswordVisible(prev => !prev)}
                  />
                )}

                {currentStep.key === "profile" && (
                  <SignUpProfileStep
                    name={formState.name}
                    username={formState.username}
                    onNameChange={value => updateField("name", value)}
                    onUsernameChange={value => updateField("username", value)}
                  />
                )}

                {currentStep.key === "workspace" && (
                  <SignUpWorkspaceStep
                    workspaceName={formState.workspaceName}
                    workspaceMode={formState.workspaceMode}
                    onWorkspaceNameChange={value => updateField("workspaceName", value)}
                    onWorkspaceModeChange={value => updateField("workspaceMode", value)}
                  />
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
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
                    disabled={!canContinue}
                    onClick={handleContinue}
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
          </div>
        )}
      </div>
    </section>
  );
}
