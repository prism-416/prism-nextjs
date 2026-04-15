"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";

import { verifyEmail } from "../api";

type VerificationStatus = "idle" | "loading" | "success" | "error";

export function EmailVerification() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerificationStatus>(token ? "loading" : "idle");
  const [errorMessage, setErrorMessage] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (!token || calledRef.current) return;
    calledRef.current = true;

    verifyEmail(token)
      .then(result => {
        if (result?.data?.verified) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage("Email could not be verified. The link may have expired.");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("Verification failed. The link may be invalid or expired.");
      });
  }, [token]);

  if (!token) {
    return (
      <Shell>
        <StatusIcon variant="error" />
        <Typography
          variant="h3"
          tone="primary"
        >
          Verification failed
        </Typography>
        <Typography
          variant="bodySm"
          className="text-muted-foreground"
        >
          No verification token provided. Please check your email link.
        </Typography>
        <Button
          asChild
          variant="outline"
          className="mt-2"
        >
          <Link href="/sign-in">Go to sign in</Link>
        </Button>
      </Shell>
    );
  }

  return (
    <Shell>
      {status === "loading" && (
        <>
          <Spinner />
          <Typography
            variant="h3"
            tone="primary"
          >
            Verifying your email
          </Typography>
          <Typography
            variant="bodySm"
            className="text-muted-foreground"
          >
            Please wait a moment.
          </Typography>
        </>
      )}

      {status === "success" && (
        <>
          <StatusIcon variant="success" />
          <Typography
            variant="h3"
            tone="primary"
          >
            Email verified
          </Typography>
          <Typography
            variant="bodySm"
            className="text-muted-foreground"
          >
            Your email has been verified. You can now sign in.
          </Typography>
          <Button
            asChild
            className="mt-2"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <StatusIcon variant="error" />
          <Typography
            variant="h3"
            tone="primary"
          >
            Verification failed
          </Typography>
          <Typography
            variant="bodySm"
            className="text-muted-foreground"
          >
            {errorMessage}
          </Typography>
          <div className="mt-2 flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setStatus("loading");
                setErrorMessage("");
                verifyEmail(token)
                  .then(result => {
                    if (result?.data?.verified) {
                      setStatus("success");
                    } else {
                      setStatus("error");
                      setErrorMessage("Email could not be verified. The link may have expired.");
                    }
                  })
                  .catch(() => {
                    setStatus("error");
                    setErrorMessage("Verification failed. The link may be invalid or expired.");
                  });
              }}
            >
              Try again
            </Button>
            <Button
              asChild
              variant="ghost"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 px-4 text-center">{children}</div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-10 w-10 animate-spin text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function StatusIcon({ variant }: { variant: "success" | "error" }) {
  if (variant === "success") {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
}
