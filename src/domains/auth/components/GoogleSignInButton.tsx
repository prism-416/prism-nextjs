"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { FaGoogle } from "react-icons/fa";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useOAuth } from "@/app/_providers/OAuthProvider";
import { signInWithGoogle } from "@/domains/auth/api";
import { AUTH_SOCIAL_LABELS } from "@/domains/auth/constants/content";
import { AUTHENTICATED_ENTRY_PATH } from "@/shared/constants/site";
import type { GoogleAccountsIdApi, GoogleCredentialResponse } from "@/domains/auth/types";

const GOOGLE_IDENTITY_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let googleIdentityScriptPromise: Promise<void> | null = null;

type GoogleWindow = Window &
  typeof globalThis & {
    google?: {
      accounts?: {
        id?: GoogleAccountsIdApi;
      };
    };
  };

function getGoogleAccountsIdApi() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return (window as GoogleWindow).google?.accounts?.id;
}

function loadGoogleIdentityScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Identity Services is only available in the browser."));
  }

  if (getGoogleAccountsIdApi()) {
    return Promise.resolve();
  }

  if (googleIdentityScriptPromise) {
    return googleIdentityScriptPromise;
  }

  googleIdentityScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_IDENTITY_SCRIPT_SRC}"]`);

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Google Identity Services.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Google Identity Services."));
    document.head.appendChild(script);
  });

  return googleIdentityScriptPromise;
}

export function GoogleSignInButton() {
  const { setSession } = useAuth();
  const { googleClientId: clientId } = useOAuth();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        googleAccountsId.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          logo_alignment: "left",
          width: buttonRef.current.clientWidth || 320,
        });
      } catch {
        if (isMounted) {
          setErrorMessage("Failed to load Google sign-in.");
        }
      }
    }

    void initializeGoogleButton();

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full justify-start gap-3 rounded-xl border-prism-sand bg-prism-surface-field text-primary hover:bg-prism-sand"
          disabled={isSubmitting || !clientId}
        >
          <FaGoogle className="size-4" />
          {AUTH_SOCIAL_LABELS.google}
        </Button>

        <div
          ref={buttonRef}
          className="absolute inset-0 overflow-hidden rounded-xl opacity-0"
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
