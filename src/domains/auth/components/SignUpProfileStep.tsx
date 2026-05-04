"use client";

import { FieldDescription, FieldGroup } from "@/atomics/molecules/Field";
import { FormHintChecklist } from "@/domains/auth/components/FormHintChecklist";
import { getUsernameCheckLabel } from "@/domains/auth/utils/sign-up";
import { AuthTextField } from "./AuthTextField";

type SignUpProfileStepProps = {
  name: string;
  username: string;
  isCheckingUsername: boolean;
  isUsernameAvailable: boolean | null;
  onNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
};

export function SignUpProfileStep({
  name,
  username,
  isCheckingUsername,
  isUsernameAvailable,
  onNameChange,
  onUsernameChange,
}: SignUpProfileStepProps) {
  const hasUsername = username.trim().length > 0;

  const profileChecks = [
    { label: "Enter your full name", isValid: name.trim().length > 0 },
    {
      label: getUsernameCheckLabel(username, isCheckingUsername, isUsernameAvailable),
      isValid: hasUsername && isUsernameAvailable === true,
    },
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
