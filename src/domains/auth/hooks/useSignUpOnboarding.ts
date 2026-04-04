"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { checkUsernameAvailability } from "../api";

import { SIGN_UP_STEPS } from "../constants/content";
import type { OAuthProvider, SignUpFormState } from "../types";
import { clearSignUpOAuthResume, getStepIndexFromResume, readSignUpOAuthResume } from "../utils/sign-up-oauth-session";

const INITIAL_FORM_STATE: SignUpFormState = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  username: "",
  workspaceName: "",
  workspaceMode: "team",
};

export function useSignUpOnboarding() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [oauthProvider, setOauthProvider] = useState<OAuthProvider | null>(null);
  const oauthResumeApplied = useRef(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isWelcomeStep, setIsWelcomeStep] = useState(false);
  const [formState, setFormState] = useState<SignUpFormState>(INITIAL_FORM_STATE);

  const currentStep = SIGN_UP_STEPS[currentStepIndex];

  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const usernameCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmedUsername = formState.username.trim();

  useLayoutEffect(() => {
    if (oauthResumeApplied.current) {
      return;
    }
    oauthResumeApplied.current = true;

    const resume = readSignUpOAuthResume();
    if (resume) {
      setCurrentStepIndex(getStepIndexFromResume(resume));
      setOauthProvider(resume.provider);
    }
  }, []);

  useEffect(() => {
    if (usernameCheckTimer.current) {
      clearTimeout(usernameCheckTimer.current);
    }

    if (!trimmedUsername) {
      setIsUsernameAvailable(null);
      setIsCheckingUsername(false);
      return;
    }

    setIsCheckingUsername(true);
    setIsUsernameAvailable(null);

    usernameCheckTimer.current = setTimeout(async () => {
      try {
        await checkUsernameAvailability(trimmedUsername);
        setIsUsernameAvailable(true);
      } catch {
        setIsUsernameAvailable(false);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => {
      if (usernameCheckTimer.current) {
        clearTimeout(usernameCheckTimer.current);
      }
    };
  }, [trimmedUsername]);

  const canContinue = useMemo(() => {
    if (currentStep.key === "account") {
      if (oauthProvider) return true;

      return (
        formState.email.trim().length > 0 &&
        formState.password.trim().length > 0 &&
        formState.confirmPassword.trim().length > 0 &&
        formState.password === formState.confirmPassword
      );
    }

    if (currentStep.key === "profile") {
      return formState.name.trim().length > 0 && trimmedUsername.length > 0 && isUsernameAvailable === true;
    }

    return formState.workspaceName.trim().length > 0;
  }, [currentStep.key, formState, trimmedUsername, isUsernameAvailable, oauthProvider]);

  function updateField<Key extends keyof SignUpFormState>(key: Key, value: SignUpFormState[Key]) {
    setFormState(prev => ({ ...prev, [key]: value }));
  }

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    if (currentStepIndex === SIGN_UP_STEPS.length - 1) {
      clearSignUpOAuthResume();
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
    isCheckingUsername,
    isPasswordVisible,
    isUsernameAvailable,
    isWelcomeStep,
    oauthProvider,
    setIsPasswordVisible,
    updateField,
  };
}
