"use client";

import { FieldDescription, FieldGroup, FieldSet } from "@/atomics/molecules/Field";
import { AuthFormSeparator } from "@/domains/auth/components/AuthFormSeparator";
import { AuthPasswordField } from "@/domains/auth/components/AuthPasswordField";
import { AuthSocialButtons } from "@/domains/auth/components/AuthSocialButtons";
import { AuthTextField } from "@/domains/auth/components/AuthTextField";
import { FormHintChecklist } from "@/domains/auth/components/FormHintChecklist";

type SignUpAccountStepProps = {
  email: string;
  password: string;
  confirmPassword: string;
  isPasswordVisible: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onPasswordToggle: () => void;
};

export function SignUpAccountStep({
  email,
  password,
  confirmPassword,
  isPasswordVisible,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onPasswordToggle,
}: SignUpAccountStepProps) {
  const accountChecks = [
    { label: "Enter your email", isValid: email.trim().length > 0 },
    { label: "Create a password", isValid: password.trim().length > 0 },
    { label: "Passwords match", isValid: confirmPassword.trim().length > 0 && password === confirmPassword },
  ] as const;

  return (
    <FieldSet className="gap-6">
      <AuthSocialButtons legend="Create an account with a social provider" />

      <AuthFormSeparator />

      <FieldGroup className="gap-5">
        <AuthTextField
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          value={email}
          onChange={onEmailChange}
          placeholder="you@company.com"
        />

        <AuthPasswordField
          id="password"
          name="password"
          label="Password"
          autoComplete="new-password"
          value={password}
          onChange={onPasswordChange}
          placeholder="Create a password"
          isVisible={isPasswordVisible}
          onVisibilityToggle={onPasswordToggle}
        />

        <AuthPasswordField
          id="confirm-password"
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          placeholder="Confirm your password"
          isVisible={isPasswordVisible}
          onVisibilityToggle={onPasswordToggle}
        />
      </FieldGroup>

      <FormHintChecklist items={accountChecks} />

      <FieldDescription className="text-sm leading-6 text-prism-body/66">
        By continuing, you agree to the Terms and Privacy Policy.
      </FieldDescription>
    </FieldSet>
  );
}
