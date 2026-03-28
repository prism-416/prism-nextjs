"use client";

import { Field, FieldLabel } from "@/atomics/molecules/Field";
import { InputGroup, InputGroupInput } from "@/atomics/molecules/InputGroup";

type AuthTextFieldProps = {
  autoComplete?: string;
  id: string;
  label: string;
  name: string;
  onChange?: (value: string) => void;
  placeholder: string;
  type?: string;
  value?: string;
};

export function AuthTextField({
  autoComplete,
  id,
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  value,
}: AuthTextFieldProps) {
  return (
    <Field className="space-y-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup className="h-11 rounded-xl border-prism-sand bg-prism-surface-field text-primary shadow-none">
        <InputGroupInput
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={event => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="h-full text-primary placeholder:text-prism-body/45"
        />
      </InputGroup>
    </Field>
  );
}
