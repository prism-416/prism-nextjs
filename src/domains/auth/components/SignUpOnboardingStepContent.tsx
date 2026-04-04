"use client";

import { SignUpAccountStep } from "./SignUpAccountStep";
import { SignUpProfileStep } from "./SignUpProfileStep";
import { SignUpWorkspaceStep } from "./SignUpWorkspaceStep";
import type { OAuthProvider, SignUpFormState, SignUpStepKey } from "../types";

type UpdateField = <Key extends keyof SignUpFormState>(key: Key, value: SignUpFormState[Key]) => void;

type SignUpOnboardingStepContentProps = {
  currentStepKey: SignUpStepKey;
  formState: SignUpFormState;
  isCheckingUsername: boolean;
  isPasswordVisible: boolean;
  isUsernameAvailable: boolean | null;
  oauthProvider: OAuthProvider | null;
  onFieldChange: UpdateField;
  onPasswordToggle: () => void;
};

export function SignUpOnboardingStepContent({
  currentStepKey,
  formState,
  isCheckingUsername,
  isPasswordVisible,
  isUsernameAvailable,
  oauthProvider,
  onFieldChange,
  onPasswordToggle,
}: SignUpOnboardingStepContentProps) {
  if (currentStepKey === "account") {
    return (
      <SignUpAccountStep
        email={formState.email}
        password={formState.password}
        confirmPassword={formState.confirmPassword}
        isPasswordVisible={isPasswordVisible}
        oauthProvider={oauthProvider}
        onEmailChange={value => onFieldChange("email", value)}
        onPasswordChange={value => onFieldChange("password", value)}
        onConfirmPasswordChange={value => onFieldChange("confirmPassword", value)}
        onPasswordToggle={onPasswordToggle}
      />
    );
  }

  if (currentStepKey === "profile") {
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

  return (
    <SignUpWorkspaceStep
      workspaceName={formState.workspaceName}
      workspaceMode={formState.workspaceMode}
      onWorkspaceNameChange={value => onFieldChange("workspaceName", value)}
      onWorkspaceModeChange={value => onFieldChange("workspaceMode", value)}
    />
  );
}
