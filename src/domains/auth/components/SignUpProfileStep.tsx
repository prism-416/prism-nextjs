"use client";

import { Input } from "@/atomics/atoms/Input";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/atomics/molecules/Field";
import { FormHintChecklist } from "@/domains/auth/components/FormHintChecklist";

type SignUpProfileStepProps = {
  name: string;
  username: string;
  onNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
};

export function SignUpProfileStep({ name, username, onNameChange, onUsernameChange }: SignUpProfileStepProps) {
  const profileChecks = [
    { label: "Enter your full name", isValid: name.trim().length > 0 },
    { label: "Choose a username", isValid: username.trim().length > 0 },
  ] as const;

  return (
    <FieldGroup className="gap-5">
      <Field className="space-y-2">
        <FieldLabel htmlFor="name">Full name</FieldLabel>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={event => onNameChange(event.target.value)}
          placeholder="Your name"
          className="h-11 rounded-xl border-prism-sand bg-prism-surface-field text-primary placeholder:text-prism-body/45"
        />
      </Field>

      <Field className="space-y-2">
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="nickname"
          value={username}
          onChange={event => onUsernameChange(event.target.value)}
          placeholder="How your team will see you"
          className="h-11 rounded-xl border-prism-sand bg-prism-surface-field text-primary placeholder:text-prism-body/45"
        />
      </Field>

      <FormHintChecklist items={profileChecks} />

      <FieldDescription className="text-sm leading-6 text-prism-body/66">You can change this later.</FieldDescription>
    </FieldGroup>
  );
}
