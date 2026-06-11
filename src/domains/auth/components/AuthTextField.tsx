"use client";

import { Field, FieldError, FieldLabel } from "@/atomics/molecules/Field";
import { InputGroup, InputGroupInput } from "@/atomics/molecules/InputGroup";
import { cn } from "@/shared/utils/cn";

type AuthTextFieldProps = {
  autoComplete?: string;
  error?: string;
  id: string;
  invalid?: boolean;
  label: string;
  name: string;
  onChange?: (value: string) => void;
  placeholder: string;
  type?: string;
  value?: string;
};

export function AuthTextField({
  autoComplete,
  error,
  id,
  invalid = false,
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  value,
}: AuthTextFieldProps) {
  const errorId = `${id}-error`;
  const isInvalid = invalid || Boolean(error);

  return (
    <Field
      className="space-y-2"
      data-invalid={isInvalid}
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup
        className={cn(
          "h-11 overflow-hidden rounded-xl bg-prism-surface-field text-primary shadow-none",
          isInvalid ? "!border-prism-danger" : "!border-prism-sand",
        )}
      >
        <InputGroupInput
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          aria-invalid={isInvalid}
          aria-describedby={error ? errorId : undefined}
          value={value}
          onChange={event => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="auth-input h-full text-primary placeholder:text-prism-body/45"
        />
      </InputGroup>
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}
