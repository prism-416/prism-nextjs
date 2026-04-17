"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { HiExclamationTriangle } from "react-icons/hi2";

import { Typography } from "@/atomics/atoms/Typography";
import { Button } from "@/atomics/atoms/Button";
import { useAuth } from "@/app/_providers/AuthProvider";
import { signInWithGithub } from "@/domains/auth/api";
import { clearGithubOAuthState, readGithubOAuthState } from "@/domains/auth/utils/github-oauth-session";

export function GitHubCallbackHandler() {
  const searchParams = useSearchParams();
  const { setSession, refreshSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const processed = useRef(false);

  const handleCallback = useEffectEvent(async () => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      const description = searchParams.get("error_description");
      setError(description || "GitHub authorization was denied.");
      clearGithubOAuthState();
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      setError("Missing authorization parameters from GitHub.");
      clearGithubOAuthState();
      return;
    }

    const stored = readGithubOAuthState();
    if (!stored || stored.state !== state) {
      setError("OAuth state mismatch. Please try again.");
      clearGithubOAuthState();
      return;
    }

    clearGithubOAuthState();

    try {
      const result = await signInWithGithub({ code, state });
      const data = result?.data;

      if (data?.accessToken) {
        const ok = await setSession(data);
        if (!ok) {
          setError("Failed to establish session.");
          return;
        }

        window.location.assign("/");
        return;
      }

      if (data?.refreshToken) {
        const ok = await refreshSession(data.refreshToken);
        if (!ok) {
          setError("Failed to establish session.");
          return;
        }

        window.location.assign("/");
        return;
      }

      if (data?.newUser) {
        setError("This GitHub account isn’t registered yet. Please sign up first.");
        return;
      }

      setError(result?.message || "GitHub sign-in failed.");
    } catch {
      setError("GitHub sign-in failed. Please try again.");
    }
  });

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    void handleCallback();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="flex max-w-sm flex-col items-center gap-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-red-200 bg-red-50">
            <HiExclamationTriangle className="size-6 text-red-500" />
          </div>

          <div className="space-y-2">
            <Typography
              variant="title"
              tone="primary"
            >
              Sign-in failed
            </Typography>
            <Typography
              variant="bodySm"
              tone="inherit"
              className="text-prism-body/60"
            >
              {error}
            </Typography>
          </div>

          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="rounded-xl"
            >
              <a href="/sign-in">Back to sign in</a>
            </Button>
            <Button
              asChild
              className="rounded-xl"
            >
              <a href="/sign-up">Sign up</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-6 py-12 lg:px-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-14 animate-pulse items-center justify-center rounded-2xl border border-prism-sand/70 bg-prism-surface-field">
          <FaGithub className="size-6 text-primary" />
        </div>

        <Typography
          variant="bodySm"
          tone="inherit"
          className="text-prism-body/60"
        >
          Connecting with GitHub…
        </Typography>
      </div>
    </div>
  );
}
