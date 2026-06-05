"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { FaGoogle } from "react-icons/fa";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useOAuth } from "@/app/_providers/OAuthProvider";
import { signInWithGoogle } from "@/domains/auth/api";
import { AUTH_SOCIAL_GOOGLE_OAUTH_BUTTON_CLASSNAME, AUTH_SOCIAL_LABELS } from "@/domains/auth/constants/content";
import type { GoogleCredentialResponse } from "@/domains/auth/types";
import { getGoogleAccountsIdApi, loadGoogleIdentityScript } from "@/domains/auth/utils/google-identity";
import { AUTHENTICATED_ENTRY_PATH } from "@/shared/constants/site";
import { cn } from "@/shared/utils/cn";

export function GoogleSignInButton() {
  const { setSession } = useAuth();
  const { googleClientId: clientId } = useOAuth();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  const handleCredentialResponse = useEffectEvent(async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      setErrorMessage("Google did not return an ID token.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await signInWithGoogle(response.credential);
      const userData = result?.data;

      if (!userData?.accessToken) {
        setErrorMessage(result?.message || "Google sign-in failed.");
        return;
      }

      const ok = await setSession(userData);

      if (!ok) {
        setErrorMessage("Google sign-in failed.");
        return;
      }

      window.location.assign(AUTHENTICATED_ENTRY_PATH);
    } catch {
      setErrorMessage("Google sign-in failed.");
    } finally {
      setIsSubmitting(false);
    }
  });

  useEffect(() => {
    let isMounted = true;

    async function initializeGoogleButton() {
      setIsGoogleReady(false);

      if (!clientId) {
        setErrorMessage("Google sign-in is unavailable.");
        return;
      }

      try {
        await loadGoogleIdentityScript();

        if (!isMounted || !buttonRef.current) {
          return;
        }

        const googleAccountsId = getGoogleAccountsIdApi();

        if (!googleAccountsId) {
          setErrorMessage("Google sign-in is unavailable.");
          return;
        }

        buttonRef.current.replaceChildren();
        googleAccountsId.initialize({
          client_id: clientId,
          callback: googleResponse => {
            void handleCredentialResponse(googleResponse);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          context: "signin",
          ux_mode: "popup",
        });
        // Do not pass `width` — GIS has regressed on numeric widths and may fail to render.
        googleAccountsId.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          logo_alignment: "left",
        });

        if (isMounted) {
          setIsGoogleReady(true);
          setErrorMessage(null);
        }
      } catch {
        if (isMounted) {
          setErrorMessage("Failed to load Google sign-in.");
        }
      }
    }

    void initializeGoogleButton();

    return () => {
      isMounted = false;
      getGoogleAccountsIdApi()?.cancel?.();
    };
  }, [clientId]);

  function handleDecorativeButtonClick() {
    if (isSubmitting || !clientId || isGoogleReady) {
      return;
    }

    setErrorMessage("Google sign-in is still loading. Try again in a moment.");
  }

  return (
    <div className="space-y-2">
      <div className="group relative">
        <Button
          type="button"
          variant="outline"
          className={cn(AUTH_SOCIAL_GOOGLE_OAUTH_BUTTON_CLASSNAME, isGoogleReady && "pointer-events-none")}
          disabled={isSubmitting || !clientId}
          onClick={handleDecorativeButtonClick}
        >
          <FaGoogle className="size-4" />
          {isSubmitting ? "Signing in…" : AUTH_SOCIAL_LABELS.google}
        </Button>

        <div
          ref={buttonRef}
          className={cn(
            "absolute inset-0 z-10 overflow-hidden rounded-xl [&>div]:h-full [&>div]:w-full",
            isGoogleReady ? "cursor-pointer opacity-[0.01]" : "pointer-events-none opacity-0",
          )}
          aria-busy={isSubmitting}
          aria-hidden="true"
        />
      </div>

      {errorMessage ? (
        <Typography
          variant="caption"
          tone="inherit"
          className="flex items-center gap-2 text-prism-body/70"
        >
          <FaGoogle className="size-3.5" />
          {errorMessage}
        </Typography>
      ) : null}
    </div>
  );
}
