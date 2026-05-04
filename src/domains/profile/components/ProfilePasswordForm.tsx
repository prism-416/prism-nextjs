"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { Field, FieldGroup, FieldLabel } from "@/atomics/molecules/Field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/atomics/molecules/InputGroup";
import { useChangePassword } from "@/domains/profile/hooks/useChangePassword";

type PasswordFieldName = "currentPassword" | "newPassword" | "confirmPassword";

type PasswordFormState = Record<PasswordFieldName, string>;

type PasswordVisibilityState = Record<PasswordFieldName, boolean>;

type PasswordFieldProps = {
  autoComplete: string;
  id: PasswordFieldName;
  isVisible: boolean;
  label: string;
  onChange: (value: string) => void;
  onVisibilityToggle: () => void;
  value: string;
};

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;
const INITIAL_FORM_STATE: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
const INITIAL_VISIBILITY_STATE: PasswordVisibilityState = {
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
};

function getPasswordMutationErrorMessage(error: unknown) {
  const data = (error as { data?: { message?: string } } | undefined)?.data;

  return data?.message || "Password could not be changed.";
}

function PasswordField({
  autoComplete,
  id,
  isVisible,
  label,
  onChange,
  onVisibilityToggle,
  value,
}: PasswordFieldProps) {
  return (
    <Field className="gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup className="h-11 rounded-xl border-border bg-surface-field">
        <InputGroupInput
          id={id}
          name={id}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={id === "currentPassword" ? 1 : PASSWORD_MIN_LENGTH}
          maxLength={PASSWORD_MAX_LENGTH}
          value={value}
          onChange={event => onChange(event.target.value)}
          className="h-full text-prism-heading placeholder:text-prism-muted"
        />
        <InputGroupAddon
          align="inline-end"
          className="pr-2 has-[>button]:mr-0"
        >
          <InputGroupButton
            size="icon-sm"
            className="rounded-full text-prism-muted hover:bg-prism-navy/5 hover:text-prism-heading"
            onClick={onVisibilityToggle}
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

export function ProfilePasswordForm() {
  const [formState, setFormState] = useState<PasswordFormState>(INITIAL_FORM_STATE);
  const [visibility, setVisibility] = useState<PasswordVisibilityState>(INITIAL_VISIBILITY_STATE);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { mutateAsync, isPending, error, reset } = useChangePassword();

  const canSubmit = useMemo(() => {
    return (
      formState.currentPassword.length > 0 &&
      formState.newPassword.length >= PASSWORD_MIN_LENGTH &&
      formState.confirmPassword.length >= PASSWORD_MIN_LENGTH &&
      formState.newPassword === formState.confirmPassword
    );
  }, [formState]);

  function handleFieldChange(field: PasswordFieldName, value: string) {
    setFormState(previous => ({ ...previous, [field]: value }));
    setFieldError(null);
    setSuccessMessage(null);
    reset();
  }

  function handleVisibilityToggle(field: PasswordFieldName) {
    setVisibility(previous => ({ ...previous, [field]: !previous[field] }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formState.currentPassword) {
      setFieldError("Current password is required.");
      return;
    }

    if (formState.newPassword.length < PASSWORD_MIN_LENGTH) {
      setFieldError("New password must be at least 8 characters.");
      return;
    }

    if (formState.newPassword.length > PASSWORD_MAX_LENGTH) {
      setFieldError("New password must be 72 characters or fewer.");
      return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      setFieldError("New passwords do not match.");
      return;
    }

    setFieldError(null);
    setSuccessMessage(null);

    try {
      await mutateAsync({
        currentPassword: formState.currentPassword,
        newPassword: formState.newPassword,
      });
      setFormState(INITIAL_FORM_STATE);
      setVisibility(INITIAL_VISIBILITY_STATE);
      setSuccessMessage("Password changed.");
    } catch {
      // Mutation error is rendered below.
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]"
      noValidate
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-prism-heading">Password</h2>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-1"
          >
            Change your account password.
          </Typography>
        </div>
        <div className="grid size-10 place-items-center rounded-full bg-prism-navy/5 text-prism-navy">
          <KeyRound className="size-5" />
        </div>
      </div>

      <FieldGroup className="mt-5 gap-4">
        <PasswordField
          id="currentPassword"
          label="Current password"
          autoComplete="current-password"
          value={formState.currentPassword}
          isVisible={visibility.currentPassword}
          onChange={value => handleFieldChange("currentPassword", value)}
          onVisibilityToggle={() => handleVisibilityToggle("currentPassword")}
        />
        <PasswordField
          id="newPassword"
          label="New password"
          autoComplete="new-password"
          value={formState.newPassword}
          isVisible={visibility.newPassword}
          onChange={value => handleFieldChange("newPassword", value)}
          onVisibilityToggle={() => handleVisibilityToggle("newPassword")}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          value={formState.confirmPassword}
          isVisible={visibility.confirmPassword}
          onChange={value => handleFieldChange("confirmPassword", value)}
          onVisibilityToggle={() => handleVisibilityToggle("confirmPassword")}
        />
      </FieldGroup>

      {fieldError || error ? (
        <Typography
          variant="bodySm"
          tone="inherit"
          className="mt-4 text-red-500"
        >
          {fieldError || getPasswordMutationErrorMessage(error)}
        </Typography>
      ) : null}

      {successMessage ? (
        <Typography
          variant="bodySm"
          tone="inherit"
          className="mt-4 text-prism-teal-500"
        >
          {successMessage}
        </Typography>
      ) : null}

      <div className="mt-5 flex justify-end">
        <Button
          type="submit"
          disabled={isPending || !canSubmit}
          className="h-10 rounded-lg px-4"
        >
          {isPending ? "Changing..." : "Change password"}
        </Button>
      </div>
    </form>
  );
}
