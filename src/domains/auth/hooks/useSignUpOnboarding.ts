"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { SIGN_UP_STEPS } from "../constants/content";
import type { SignUpFormState, SignUpStepKey } from "../types";

const INITIAL_FORM_STATE: SignUpFormState = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  username: "",
  workspaceName: "",
  workspaceMode: "team",
};

function resolveInitialStepIndex(stepParam: string | null): number {
  if (!stepParam) return 0;
  const index = SIGN_UP_STEPS.findIndex(s => s.key === (stepParam as SignUpStepKey));
  return index >= 0 ? index : 0;
}

export function useSignUpOnboarding() {
  const searchParams = useSearchParams();
  const initialStepIndex = resolveInitialStepIndex(searchParams.get("step"));

  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
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

  return {
    canContinue,
    currentStep,
    currentStepIndex,
    formState,
    handleBack,
    handleContinue,
    isPasswordVisible,
    isWelcomeStep,
    setIsPasswordVisible,
    updateField,
  };
}
