"use client";

import { Eye, EyeOff } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/atomics/molecules/Field";
import { AUTH_SOCIAL_LABELS } from "@/domains/auth/constants/content";
import { FormHintChecklist } from "@/domains/auth/components/FormHintChecklist";
import { GITHUB_LOGIN_URL, GOOGLE_LOGIN_URL } from "@/shared/constants/api";

const SOCIAL_OPTIONS = [
  {
    label: AUTH_SOCIAL_LABELS.github,
    href: GITHUB_LOGIN_URL,
    icon: FaGithub,
  },
  {
    label: AUTH_SOCIAL_LABELS.google,
    href: GOOGLE_LOGIN_URL,
    icon: FaGoogle,
  },
] as const;

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
      <FieldSet className="gap-2">
        <FieldLegend
          variant="label"
          className="sr-only"
        >
          Create an account with a social provider
        </FieldLegend>
        {SOCIAL_OPTIONS.map(option => {
          const Icon = option.icon;

          return (
            <Button
              key={option.label}
              asChild
              type="button"
              variant="outline"
              className="h-11 w-full justify-start gap-3 rounded-xl border-prism-sand bg-prism-surface-field text-primary hover:bg-prism-sand"
            >
              <a href={option.href}>
                <Icon className="size-4" />
                {option.label}
              </a>
            </Button>
          );
        })}
      </FieldSet>

      <FieldSeparator className="py-1">
        <span className="px-1 text-xs font-medium uppercase tracking-[0.2em] text-prism-body/50">Or</span>
      </FieldSeparator>

      <FieldGroup className="gap-5">
        <Field className="space-y-2">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={event => onEmailChange(event.target.value)}
            placeholder="you@company.com"
            className="h-11 rounded-xl border-prism-sand bg-prism-surface-field text-primary placeholder:text-prism-body/45"
          />
        </Field>

        <Field className="space-y-2">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={event => onPasswordChange(event.target.value)}
              placeholder="Create a password"
              className="h-11 rounded-xl border-prism-sand bg-prism-surface-field pr-12 text-primary placeholder:text-prism-body/45"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-full text-prism-body/70 hover:bg-prism-sand hover:text-primary"
              onClick={onPasswordToggle}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
        </Field>

        <Field className="space-y-2">
          <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
          <div className="relative">
            <Input
              id="confirm-password"
              name="confirmPassword"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={event => onConfirmPasswordChange(event.target.value)}
              placeholder="Confirm your password"
              className="h-11 rounded-xl border-prism-sand bg-prism-surface-field pr-12 text-primary placeholder:text-prism-body/45"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-full text-prism-body/70 hover:bg-prism-sand hover:text-primary"
              onClick={onPasswordToggle}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
        </Field>
      </FieldGroup>

      <FormHintChecklist items={accountChecks} />

      <FieldDescription className="text-sm leading-6 text-prism-body/66">
        By continuing, you agree to the Terms and Privacy Policy.
      </FieldDescription>
    </FieldSet>
  );
}
