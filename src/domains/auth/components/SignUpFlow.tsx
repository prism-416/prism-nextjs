"use client";

import { SignUpFormPanel } from "./SignUpFormPanel";
import { SignUpSidebar } from "./SignUpSidebar";
import { SignUpStepContent } from "./SignUpStepContent";
import { useSignUp } from "../hooks/useSignUp";

export function SignUpFlow() {
  const {
    canContinue,
    continueError,
    currentStep,
    currentStepIndex,
    formState,
    handleBack,
    handleContinue,
    isCheckingUsername,
    isContinueSubmitting,
    isPasswordVisible,
    isUsernameAvailable,
    oauthProvider,
    setIsPasswordVisible,
    updateField,
  } = useSignUp();

  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10 lg:px-8 lg:py-12">
      <div className="w-full max-w-6xl text-primary">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)] lg:gap-12">
          <SignUpSidebar currentStepIndex={currentStepIndex} />

          <SignUpFormPanel
            canContinue={canContinue}
            continueError={continueError}
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            isContinueSubmitting={isContinueSubmitting}
            onBack={handleBack}
            onContinue={handleContinue}
          >
            <SignUpStepContent
              currentStepKey={currentStep.key}
              formState={formState}
              isCheckingUsername={isCheckingUsername}
              isPasswordVisible={isPasswordVisible}
              isUsernameAvailable={isUsernameAvailable}
              oauthProvider={oauthProvider}
              onFieldChange={updateField}
              onPasswordToggle={() => setIsPasswordVisible(prev => !prev)}
            />
          </SignUpFormPanel>
        </div>
      </div>
    </section>
  );
}
