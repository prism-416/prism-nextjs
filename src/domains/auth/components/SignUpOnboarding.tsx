"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/atomics/atoms/Button";
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
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f4ecd6]/72">
                  Prizmatic Onboarding
                </p>
                <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white xl:text-5xl">
                  {currentStep.title}
                </h1>
                <p className="max-w-lg text-base leading-7 text-white/72">{currentStep.description}</p>
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
                        <p className="text-sm font-semibold text-white">{step.label}</p>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#f4ecd6]/68">
                          {step.step}
                        </p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/70">{step.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-3xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f4ecd6]/68">What comes next</p>
                <p className="mt-3 max-w-lg text-sm leading-7 text-white/72">
                  After setup, you can move into project creation, teammate invites, and GitHub connection without
                  loading all of that into the first form.
                </p>
              </div>
            </div>

            <FieldSet className="gap-8 rounded-[1.65rem] border border-prism-sand/70 bg-[linear-gradient(180deg,rgba(252,248,239,0.94)_0%,rgba(255,255,255,0.72)_100%)] p-6 shadow-[0_28px_120px_rgba(3,23,34,0.24)] backdrop-blur-md lg:sticky lg:top-10 lg:p-8">
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-prism-body/45">Current step</p>
                  <p className="text-2xl font-semibold tracking-[-0.03em] text-primary">{currentStep.label}</p>
                </div>

                <div className="rounded-full border border-prism-sand/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-prism-body/52">
                  {currentStep.step} / {SIGN_UP_STEPS.length.toString().padStart(2, "0")}
                </div>
              </div>

              <div
                key={currentStep.key}
                className="space-y-7 rounded-3xl border border-white/75 bg-white/80 p-6 shadow-[0_14px_40px_rgba(12,71,103,0.08)]"
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
                      "rounded-xl px-4 text-prism-body/72 hover:bg-[#efe7d7] hover:text-primary",
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

              <p className="text-center text-sm text-prism-body/70">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-semibold text-primary underline underline-offset-4">
                  Sign in
                </Link>
              </p>
            </FieldSet>
          </div>
        )}
      </div>
    </section>
  );
}
