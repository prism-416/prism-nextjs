"use client";

import { Eye, EyeOff } from "lucide-react";

import { Field, FieldError, FieldLabel } from "@/atomics/molecules/Field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/atomics/molecules/InputGroup";
import { cn } from "@/shared/utils/cn";

type AuthPasswordFieldProps = {
  autoComplete: string;
  error?: string;
  id: string;
  invalid?: boolean;
  isVisible: boolean;
  label: string;
  name: string;
  onChange?: (value: string) => void;
  onVisibilityToggle: () => void;
  placeholder: string;
  value?: string;
};

export function AuthPasswordField({
  autoComplete,
  error,
  id,
  invalid = false,
  isVisible,
  label,
  name,
  onChange,
  onVisibilityToggle,
  placeholder,
  value,
}: AuthPasswordFieldProps) {
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
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={isInvalid}
          aria-describedby={error ? errorId : undefined}
          value={value}
          onChange={event => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="auth-input h-full text-primary placeholder:text-prism-body/45"
        />
        <InputGroupAddon
          align="inline-end"
          className="pr-2 has-[>button]:mr-0"
        >
          <InputGroupButton
            size="icon-sm"
            className="rounded-full text-prism-body/70 hover:bg-prism-sand hover:text-primary"
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
