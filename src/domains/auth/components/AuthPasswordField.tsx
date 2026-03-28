"use client";

import { Eye, EyeOff } from "lucide-react";

import { Field, FieldLabel } from "@/atomics/molecules/Field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/atomics/molecules/InputGroup";

type AuthPasswordFieldProps = {
  autoComplete: string;
  id: string;
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
  id,
  isVisible,
  label,
  name,
  onChange,
  onVisibilityToggle,
  placeholder,
  value,
}: AuthPasswordFieldProps) {
  return (
    <Field className="space-y-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup className="h-11 rounded-xl border-prism-sand bg-prism-surface-field text-primary shadow-none">
        <InputGroupInput
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={event => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="h-full text-primary placeholder:text-prism-body/45"
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
    </Field>
  );
}
