"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { checkUsernameAvailability, signUpWithEmail } from "../api";

import { SIGN_UP_STEPS } from "../constants/content";
import type { SignUpFormState } from "../types";

const INITIAL_FORM_STATE: SignUpFormState = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  username: "",
};

export function useSignUp() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formState, setFormState] = useState<SignUpFormState>(INITIAL_FORM_STATE);

  const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const currentStep = SIGN_UP_STEPS[currentStepIndex];

  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const usernameCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmedUsername = formState.username.trim();

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
      return (
        formState.email.trim().length > 0 &&
        formState.password.trim().length > 0 &&
        formState.confirmPassword.trim().length > 0 &&
        formState.password === formState.confirmPassword
      );
    }

    return (
      formState.name.trim().length > 0 &&
      trimmedUsername.length > 0 &&
      isUsernameAvailable === true &&
      !isSubmittingSignup
    );
  }, [currentStep.key, formState, trimmedUsername, isUsernameAvailable, isSubmittingSignup]);

  function updateField<Key extends keyof SignUpFormState>(key: Key, value: SignUpFormState[Key]) {
    setSignupError(null);
    setFormState(prev => ({ ...prev, [key]: value }));
  }

  const handleContinue = useCallback(async () => {
    if (!canContinue) {
      return;
    }

    if (currentStep.key === "profile") {
      setSignupError(null);
      setIsSubmittingSignup(true);
      try {
        const fullName = formState.name.trim();
        const username = trimmedUsername;
        const email = formState.email.trim();
        const password = formState.password;

        const signUpResult = await signUpWithEmail({
          email,
          password,
          fullName,
          username,
        });

        if (!signUpResult?.data?.userId) {
          setSignupError(signUpResult?.message || "Sign up failed.");
          return;
        }

        router.push("/sign-in");
      } catch {
        setSignupError("Sign up failed.");
      } finally {
        setIsSubmittingSignup(false);
      }
      return;
    }

    setCurrentStepIndex(prev => prev + 1);
  }, [canContinue, currentStep.key, formState.email, formState.name, formState.password, router, trimmedUsername]);

  function handleBack() {
    if (currentStepIndex === 0) {
      return;
    }

    setCurrentStepIndex(prev => prev - 1);
  }

  return {
    canContinue,
    continueError: signupError,
    currentStep,
    currentStepIndex,
    formState,
    handleBack,
    handleContinue,
    isCheckingUsername,
    isContinueSubmitting: isSubmittingSignup,
    isPasswordVisible,
    isUsernameAvailable,
    setIsPasswordVisible,
    updateField,
  };
}
