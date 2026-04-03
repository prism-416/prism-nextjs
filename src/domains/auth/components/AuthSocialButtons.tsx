"use client";

import { FaGithub } from "react-icons/fa";

import { Button } from "@/atomics/atoms/Button";
import { FieldLegend, FieldSet } from "@/atomics/molecules/Field";
import { AUTH_SOCIAL_LABELS } from "@/domains/auth/constants/content";
import { GoogleSignInButton } from "@/domains/auth/components/GoogleSignInButton";
import { GITHUB_SIGNIN_URL } from "@/shared/constants/api";

const SOCIAL_OPTIONS = [
  {
    label: AUTH_SOCIAL_LABELS.github,
    href: GITHUB_SIGNIN_URL,
    icon: FaGithub,
  },
] as const;

type AuthSocialButtonsProps = {
  legend: string;
};

export function AuthSocialButtons({ legend }: AuthSocialButtonsProps) {
  return (
    <FieldSet className="gap-2">
      <FieldLegend
        variant="label"
        className="sr-only"
      >
        {legend}
      </FieldLegend>
      {SOCIAL_OPTIONS.map(option => {
        const Icon = option.icon;

        return (
          <Button
            key={option.label}
            asChild
            type="button"
            variant="outline"
            className="h-11 w-full justify-start gap-3 rounded-xl border-prism-sand bg-prism-surface-field text-primary hover:bg-prism-sand"
          >
            <a href={option.href}>
              <Icon className="size-4" />
              {option.label}
            </a>
          </Button>
        );
      })}

      <GoogleSignInButton />
    </FieldSet>
  );
}
