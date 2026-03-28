"use client";

import { FieldDescription, FieldGroup } from "@/atomics/molecules/Field";
import { AuthTextField } from "./AuthTextField";
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
      <AuthTextField
        id="name"
        name="name"
        label="Full name"
        autoComplete="name"
        value={name}
        onChange={onNameChange}
        placeholder="Your name"
      />

      <AuthTextField
        id="username"
        name="username"
        label="Username"
        autoComplete="nickname"
        value={username}
        onChange={onUsernameChange}
        placeholder="How your team will see you"
      />

      <FormHintChecklist items={profileChecks} />

      <FieldDescription className="text-sm leading-6 text-prism-body/66">You can change this later.</FieldDescription>
    </FieldGroup>
  );
}
