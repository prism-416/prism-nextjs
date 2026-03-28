"use client";

import { Typography } from "@/atomics/atoms/Typography";
import { FieldSeparator } from "@/atomics/molecules/Field";

type AuthFormSeparatorProps = {
  label?: string;
};

export function AuthFormSeparator({ label = "Or" }: AuthFormSeparatorProps) {
  return (
    <FieldSeparator className="py-1">
      <Typography
        as="span"
        variant="overline"
        tone="inherit"
        weight="medium"
        className="px-1 text-prism-body/50 tracking-[0.2em]"
      >
        {label}
      </Typography>
    </FieldSeparator>
  );
}
