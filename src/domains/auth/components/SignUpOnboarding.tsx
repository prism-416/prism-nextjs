"use client";

import { SignUpOnboardingFormPanel } from "./SignUpOnboardingFormPanel";
import { SignUpOnboardingSidebar } from "./SignUpOnboardingSidebar";
import { SignUpOnboardingStepContent } from "./SignUpOnboardingStepContent";
import { SignUpWelcomePanel } from "./SignUpWelcomePanel";
import { useSignUpOnboarding } from "../hooks/useSignUpOnboarding";

export function SignUpOnboarding() {
  const {
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
  } = useSignUpOnboarding();

  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10 lg:px-8 lg:py-12">
      <div className="w-full max-w-6xl text-primary">
        {isWelcomeStep ? (
          <SignUpWelcomePanel
            workspaceName={formState.workspaceName}
            oauthProvider={oauthProvider}
            onBack={handleBack}
          />
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)] lg:gap-12">
            <SignUpOnboardingSidebar currentStepIndex={currentStepIndex} />

            <SignUpOnboardingFormPanel
              canContinue={canContinue}
              currentStep={currentStep}
              currentStepIndex={currentStepIndex}
              onBack={handleBack}
              onContinue={handleContinue}
            >
              <SignUpOnboardingStepContent
                currentStepKey={currentStep.key}
                formState={formState}
                isCheckingUsername={isCheckingUsername}
                isPasswordVisible={isPasswordVisible}
                isUsernameAvailable={isUsernameAvailable}
                oauthProvider={oauthProvider}
                onFieldChange={updateField}
                onPasswordToggle={() => setIsPasswordVisible(prev => !prev)}
              />
            </SignUpOnboardingFormPanel>
          </div>
        )}
      </div>
    </section>
  );
}
