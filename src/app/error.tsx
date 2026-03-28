"use client";

import { useEffect } from "react";
import Link from "next/link";

import Container from "@/atomics/atoms/Container";
import { Typography } from "@/atomics/atoms/Typography";
import LandingFooter from "@/domains/home/components/LandingFooter";
import LandingHeader from "@/domains/home/components/LandingHeader";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <Container className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
        <div className="w-full max-w-xl rounded-4xl border border-border bg-surface-strong p-10 text-center shadow-sm shadow-prism-teal-500/10">
          <Typography
            variant="bodySm"
            tone="accent"
            weight="medium"
          >
            Unexpected Error
          </Typography>
          <Typography
            variant="h1"
            tone="primary"
            className="mt-3"
          >
            Something went wrong
          </Typography>
          <Typography
            variant="bodySm"
            tone="inherit"
            className="mt-4 text-muted sm:text-base"
          >
            An unexpected error occurred while processing your request. Please try again or return to the home page.
          </Typography>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-prism-navy-deep"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border-strong bg-surface px-6 text-sm font-medium text-secondary-foreground transition-colors hover:border-prism-teal-500 hover:text-primary"
            >
              Back to home
            </Link>
          </div>
        </div>
      </Container>
      <LandingFooter />
    </div>
  );
}
