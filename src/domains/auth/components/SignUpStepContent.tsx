"use client";

import { SignUpAccountStep } from "./SignUpAccountStep";
import { SignUpProfileStep } from "./SignUpProfileStep";
import type { SignUpFormState, SignUpStepKey } from "../types";

type UpdateField = <Key extends keyof SignUpFormState>(key: Key, value: SignUpFormState[Key]) => void;

type SignUpStepContentProps = {
  currentStepKey: SignUpStepKey;
  formState: SignUpFormState;
  isCheckingUsername: boolean;
  isPasswordVisible: boolean;
  isUsernameAvailable: boolean | null;
  onFieldChange: UpdateField;
  onPasswordToggle: () => void;
};

export function SignUpStepContent({
  currentStepKey,
  formState,
  isCheckingUsername,
  isPasswordVisible,
  isUsernameAvailable,
  onFieldChange,
  onPasswordToggle,
}: SignUpStepContentProps) {
  if (currentStepKey === "account") {
    return (
      <SignUpAccountStep
        email={formState.email}
        password={formState.password}
        confirmPassword={formState.confirmPassword}
        isPasswordVisible={isPasswordVisible}
        onEmailChange={value => onFieldChange("email", value)}
        onPasswordChange={value => onFieldChange("password", value)}
        onConfirmPasswordChange={value => onFieldChange("confirmPassword", value)}
        onPasswordToggle={onPasswordToggle}
      />
    );
  }

  return (
    <SignUpProfileStep
      name={formState.name}
      username={formState.username}
      isCheckingUsername={isCheckingUsername}
      isUsernameAvailable={isUsernameAvailable}
      onNameChange={value => onFieldChange("name", value)}
      onUsernameChange={value => onFieldChange("username", value)}
    />
  );
}
