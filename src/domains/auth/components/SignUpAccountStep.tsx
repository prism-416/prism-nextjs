"use client";

import { FaGoogle, FaGithub } from "react-icons/fa";
import { HiCheckCircle } from "react-icons/hi2";

import { Typography } from "@/atomics/atoms/Typography";
import { FieldDescription, FieldGroup, FieldSet } from "@/atomics/molecules/Field";
import { AuthFormSeparator } from "@/domains/auth/components/AuthFormSeparator";
import { AuthPasswordField } from "@/domains/auth/components/AuthPasswordField";
import { AuthSocialButtons } from "@/domains/auth/components/AuthSocialButtons";
import { AuthTextField } from "@/domains/auth/components/AuthTextField";
import { FormHintChecklist } from "@/domains/auth/components/FormHintChecklist";
import type { OAuthProvider } from "../types";

const OAUTH_PROVIDER_META: Record<OAuthProvider, { label: string; icon: React.ElementType }> = {
  google: { label: "Google", icon: FaGoogle },
  github: { label: "GitHub", icon: FaGithub },
};

type SignUpAccountStepProps = {
  email: string;
  password: string;
  confirmPassword: string;
  isPasswordVisible: boolean;
  oauthProvider: OAuthProvider | null;
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
  oauthProvider,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onPasswordToggle,
}: SignUpAccountStepProps) {
  if (oauthProvider) {
    const meta = OAUTH_PROVIDER_META[oauthProvider];
    const Icon = meta.icon;

    return (
      <FieldSet className="gap-6">
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-prism-sand/70 bg-prism-surface-field">
            <Icon className="size-6 text-primary" />
          </div>

          <div className="flex items-center gap-2 text-emerald-600">
            <HiCheckCircle className="size-5" />
            <Typography
              variant="bodySm"
              tone="inherit"
              className="font-semibold"
            >
              Verified with {meta.label}
            </Typography>
          </div>

          <Typography
            variant="bodySm"
            tone="inherit"
            align="center"
            className="max-w-xs text-prism-body/60"
          >
            Your account has been created through {meta.label}. Continue to set up your profile.
          </Typography>
        </div>
      </FieldSet>
    );
  }

  const accountChecks = [
    { label: "Enter your email", isValid: email.trim().length > 0 },
    { label: "Create a password", isValid: password.trim().length > 0 },
    { label: "Passwords match", isValid: confirmPassword.trim().length > 0 && password === confirmPassword },
  ] as const;

  return (
    <FieldSet className="gap-6">
      <AuthSocialButtons
        legend="Create an account with a social provider"
        githubIntent="signup"
      />

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
