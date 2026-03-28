import Link from "next/link";

import Container from "@/atomics/atoms/Container";
import { Typography } from "@/atomics/atoms/Typography";
import LandingFooter from "@/domains/home/components/LandingFooter";
import LandingHeader from "@/domains/home/components/LandingHeader";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <Container className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
        <div className="w-full max-w-xl rounded-4xl border border-border bg-surface-strong p-10 text-center shadow-sm shadow-prism-teal-500/10">
          <Typography
            variant="bodySm"
            tone="inherit"
            weight="medium"
            className="text-prism-teal-500"
          >
            404 Error
          </Typography>
          <Typography
            variant="display"
            tone="primary"
            className="mt-3 sm:text-6xl"
          >
            Page Not Found
          </Typography>
          <Typography
            variant="bodySm"
            tone="inherit"
            className="mt-4 text-muted sm:text-base"
          >
            The page you requested may have been deleted or the address may have changed. Please go back to the home
            page and try again.
          </Typography>
          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-prism-navy-deep"
          >
            Go back to home
          </Link>
        </div>
      </Container>
      <LandingFooter />
    </div>
  );
}
