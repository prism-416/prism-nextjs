"use client";

import { type FormEvent, useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/atomics/molecules/Field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/atomics/molecules/InputGroup";
import { useChangePassword } from "@/domains/profile/hooks/useChangePassword";

type PasswordFieldName = "currentPassword" | "newPassword" | "confirmPassword";

type PasswordFormState = Record<PasswordFieldName, string>;

type PasswordFieldErrors = Partial<Record<PasswordFieldName, string>>;

type PasswordVisibilityState = Record<PasswordFieldName, boolean>;

type PasswordFieldProps = {
  autoComplete: string;
  id: PasswordFieldName;
  isVisible: boolean;
  label: string;
  onChange: (value: string) => void;
  onVisibilityToggle: () => void;
  value: string;
  error?: string;
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

type PasswordMutationError = {
  data?: {
    code?: unknown;
    message?: unknown;
  } | null;
  message?: unknown;
  response?: {
    data?: {
      code?: unknown;
      message?: unknown;
    } | null;
    status?: unknown;
  };
  status?: unknown;
};

function getErrorMessage(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string").join(" ");
  }

  return typeof value === "string" ? value : "";
}

function getPasswordMutationError(error: unknown): { field?: PasswordFieldName; message: string } {
  const candidate = error as PasswordMutationError | null;
  const data = candidate?.response?.data ?? candidate?.data;
  const code = typeof data?.code === "string" ? data.code : null;
  const status = candidate?.response?.status ?? candidate?.status;
  const message = getErrorMessage(data?.message ?? candidate?.message);

  if (code === "INVALID_CURRENT_PASSWORD") {
    return {
      field: "currentPassword",
      message: "Current password is incorrect.",
    };
  }

  if (status === 401) {
    return { message: "Your session expired. Please sign in again." };
  }

  return { message: message || "Password could not be changed." };
}

function PasswordField({
  autoComplete,
  error,
  id,
  isVisible,
  label,
  onChange,
  onVisibilityToggle,
  value,
}: PasswordFieldProps) {
  const errorId = `${id}-error`;

  return (
    <Field
      className="gap-2"
      data-invalid={Boolean(error)}
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup className="h-11 rounded-xl border-border bg-surface-field">
        <InputGroupInput
          id={id}
          name={id}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={id === "currentPassword" ? 1 : PASSWORD_MIN_LENGTH}
          maxLength={PASSWORD_MAX_LENGTH}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
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
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}

export function ProfilePasswordForm() {
  const [formState, setFormState] = useState<PasswordFormState>(INITIAL_FORM_STATE);
  const [visibility, setVisibility] = useState<PasswordVisibilityState>(INITIAL_VISIBILITY_STATE);
  const [fieldErrors, setFieldErrors] = useState<PasswordFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { mutateAsync, isPending, error, reset } = useChangePassword();

  function handleFieldChange(field: PasswordFieldName, value: string) {
    setFormState(previous => ({ ...previous, [field]: value }));
    setFieldErrors(previous => ({ ...previous, [field]: undefined }));
    setFormError(null);
    setSuccessMessage(null);
    reset();
  }

  function handleVisibilityToggle(field: PasswordFieldName) {
    setVisibility(previous => ({ ...previous, [field]: !previous[field] }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formState.currentPassword) {
      setFieldErrors({ currentPassword: "Current password is required." });
      return;
    }

    if (formState.newPassword.length < PASSWORD_MIN_LENGTH) {
      setFieldErrors({ newPassword: "New password must be at least 8 characters." });
      return;
    }

    if (formState.newPassword.length > PASSWORD_MAX_LENGTH) {
      setFieldErrors({ newPassword: "New password must be 72 characters or fewer." });
      return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      setFieldErrors({ confirmPassword: "New passwords do not match." });
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setSuccessMessage(null);

    try {
      await mutateAsync({
        currentPassword: formState.currentPassword,
        newPassword: formState.newPassword,
      });
      setFormState(INITIAL_FORM_STATE);
      setVisibility(INITIAL_VISIBILITY_STATE);
      setSuccessMessage("Password changed.");
    } catch (mutationError) {
      const passwordError = getPasswordMutationError(mutationError);

      if (passwordError.field) {
        setFieldErrors({ [passwordError.field]: passwordError.message });
        return;
      }

      setFormError(passwordError.message);
    }
  }

  const mutationError = error ? getPasswordMutationError(error) : null;
  const displayedFormError = formError ?? (mutationError?.field ? null : (mutationError?.message ?? null));

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
          error={fieldErrors.currentPassword}
          onChange={value => handleFieldChange("currentPassword", value)}
          onVisibilityToggle={() => handleVisibilityToggle("currentPassword")}
        />
        <PasswordField
          id="newPassword"
          label="New password"
          autoComplete="new-password"
          value={formState.newPassword}
          isVisible={visibility.newPassword}
          error={fieldErrors.newPassword}
          onChange={value => handleFieldChange("newPassword", value)}
          onVisibilityToggle={() => handleVisibilityToggle("newPassword")}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          value={formState.confirmPassword}
          isVisible={visibility.confirmPassword}
          error={fieldErrors.confirmPassword}
          onChange={value => handleFieldChange("confirmPassword", value)}
          onVisibilityToggle={() => handleVisibilityToggle("confirmPassword")}
        />
      </FieldGroup>

      {displayedFormError ? (
        <Typography
          variant="bodySm"
          tone="inherit"
          className="mt-4 text-red-500"
        >
          {displayedFormError}
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
          disabled={isPending}
          className="h-10 rounded-lg px-4"
        >
          {isPending ? "Changing..." : "Change password"}
        </Button>
      </div>
    </form>
  );
}
