"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { checkUsernameAvailability, signUpWithEmail, signUpWithOAuthGoogle } from "../api";

import { SIGN_UP_STEPS } from "../constants/content";
import type { OAuthProvider, SignUpFormState } from "../types";
import { clearSignUpOAuthResume, getStepIndexFromResume, readSignUpOAuthResume } from "../utils/sign-up-oauth-session";

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
  const [oauthProvider, setOauthProvider] = useState<OAuthProvider | null>(null);
  const [oauthIdToken, setOauthIdToken] = useState<string | null>(null);
  const oauthResumeApplied = useRef(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formState, setFormState] = useState<SignUpFormState>(INITIAL_FORM_STATE);

  const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

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
      if (resume.idToken) {
        setOauthIdToken(resume.idToken);
      }
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

    return (
      formState.name.trim().length > 0 &&
      trimmedUsername.length > 0 &&
      isUsernameAvailable === true &&
      !isSubmittingSignup
    );
  }, [currentStep.key, formState, trimmedUsername, isUsernameAvailable, oauthProvider, isSubmittingSignup]);

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

        if (oauthProvider && oauthProvider !== "google") {
          setSignupError("This sign-in method is not supported for registration yet.");
          return;
        }

        if (oauthProvider === "google") {
          if (!oauthIdToken) {
            setSignupError("Your Google sign-in session expired. Please start again from sign in.");
            return;
          }

          const signUpResult = await signUpWithOAuthGoogle({
            idToken: oauthIdToken,
            fullName,
            username,
          });

          if (!signUpResult?.data?.userId) {
            setSignupError(signUpResult?.message || "Sign up failed.");
            return;
          }

          clearSignUpOAuthResume();
          setOauthIdToken(null);
          router.push("/sign-in");
          return;
        }

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

        clearSignUpOAuthResume();
        router.push("/sign-in");
      } catch {
        setSignupError("Sign up failed.");
      } finally {
        setIsSubmittingSignup(false);
      }
      return;
    }

    setCurrentStepIndex(prev => prev + 1);
  }, [
    canContinue,
    currentStep.key,
    formState.email,
    formState.name,
    formState.password,
    oauthIdToken,
    oauthProvider,
    router,
    trimmedUsername,
  ]);

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
    oauthProvider,
    setIsPasswordVisible,
    updateField,
  };
}
