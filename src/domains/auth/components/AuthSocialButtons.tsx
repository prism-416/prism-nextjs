"use client";

import { useState } from "react";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { FieldLegend, FieldSet } from "@/atomics/molecules/Field";
import { AUTH_SOCIAL_LABELS, AUTH_SOCIAL_OAUTH_BUTTON_CLASSNAME } from "@/domains/auth/constants/content";
import { GoogleSignInButton } from "@/domains/auth/components/GoogleSignInButton";
import { getGithubAuthorizationUrl } from "@/domains/auth/api";
import { persistGithubOAuthState } from "@/domains/auth/utils/github-oauth-session";

type AuthSocialButtonsProps = {
  legend: string;
};

export function AuthSocialButtons({ legend }: AuthSocialButtonsProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleGitHubClick() {
    if (isRedirecting) return;

    setErrorMessage(null);
    setIsRedirecting(true);

    try {
      const result = await getGithubAuthorizationUrl();
      const data = result?.data;

      if (!data?.authorizationUrl || !data.state) {
        setErrorMessage("Failed to start GitHub sign-in.");
        setIsRedirecting(false);
        return;
      }

      persistGithubOAuthState(data.state, data.transaction);
      window.location.assign(data.authorizationUrl);
    } catch {
      setErrorMessage("Failed to connect to GitHub.");
      setIsRedirecting(false);
    }
  }

  return (
    <FieldSet className="gap-2">
      <FieldLegend
        variant="label"
        className="sr-only"
      >
        {legend}
      </FieldLegend>

      <Button
        type="button"
        variant="outline"
        className={AUTH_SOCIAL_OAUTH_BUTTON_CLASSNAME}
        disabled={isRedirecting}
        onClick={handleGitHubClick}
      >
        <FaGithub className="size-4" />
        {isRedirecting ? "Redirecting…" : AUTH_SOCIAL_LABELS.github}
      </Button>

      {errorMessage ? (
        <Typography
          variant="caption"
          tone="inherit"
          className="flex items-center gap-2 text-prism-body/70"
        >
          <FaGithub className="size-3.5" />
          {errorMessage}
        </Typography>
      ) : null}

      <GoogleSignInButton />
    </FieldSet>
  );
}
